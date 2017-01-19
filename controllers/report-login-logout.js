/**
 * Created by hoangdv on 8/24/16.
 */

exports.index = {
	json: function (req, res) {

	},
	html: function (req, res) {
		var statusArr = [];
		_async.parallel({
			agents: function(next){
				_async.waterfall([
					function(next){
						permissionConditions(req, next);
					},
					function(userIds, next){
						_Users.find({_id: {$in: userIds}}, next);
					}
				], next);
			},
			data: function(next){
				_async.waterfall([
					function(next){
						_AgentStatus.find({},function(err, result){
							statusArr = result;
							next(err);
						});
					},
					function(next){
						permissionConditions(req, next);
					},
					function(userIds, next){
						if(!req.query.isFilter){
							return next(null);
						}
						_async.parallel({
							timeline: function(done) {
								getTimelines(userIds, statusArr, req, done);
							},
							overall: function(done) {
								getOverallReport(userIds, statusArr, req, done);
							}
						}, next);
					}
				], next);
			}
		}, function(err, result){
			return _.render(req, res, 'report-login-logout', _.extend({
				datas: _.has(result.data, 'overall') ? result.data.overall.data : [],
				agents: result.agents,
				status: statusArr,
				paging: _.has(result.data, 'overall') ? result.data.overall.paging : {},
				msToTime: msToTime,
				timeline: _.has(result.data, 'timeline') ? result.data.timeline: [],
				title: 'Báo cáo Login - Logout',
				plugins: ['moment', ['bootstrap-select'],'export-excel', 'google-chart']
			}, {}), true, err);
		});
	}
};

/**
 *
 * @param userIds
 * @param statusArr
 * @param req
 * @param callback
 * @returns {*}
 */
function getOverallReport(userIds, statusArr, req, callback) {
	var page = _.has(req.query, 'page') ? parseInt(req.query.page) : 1;
	var rows = _.has(req.query, 'rows') ? parseInt(req.query.rows) : 10;

	var sort = _.cleanSort(req.query,'');
	var obj = {};
	var aggs = [];
	aggs.push({$match: {agentId: {$in: userIds}}});
	if (_.has(req.query, 'startTime')) {
		var fieldName = 'startTime';
		var _d1 = _moment(req.query[fieldName].split(' - ')[0], 'DD/MM/YYYY');
		var _d2 = req.query[fieldName].split(' - ')[1] ? _moment(req.query[fieldName].split(' - ')[1], 'DD/MM/YYYY') : _moment(_d1).endOf('day');

		var startDay = (_d1._d < _d2._d) ? _d1 : _d2;
		var endDay = (_d1._d < _d2._d) ? _d2 : _d1;
		startDay = startDay.startOf('day');
		endDay = endDay.endOf('day');

		obj['startTime'] = {$gte: startDay._d, $lt: endDay._d};
	}

	if (_.has(req.query, 'agentId') && req.query.agentId.length > 0) {
		obj['agentId'] = {$in: _.arrayObjectId(req.query.agentId)};
	}
	obj['endTime'] = {$ne: null};

	aggs.push({$match: obj});

	aggs.push({ $project: {
		_id: 1,
		startTime: 1,
		endTime: 1,
		agentId: 1,
		status: 1,
		duration: {$subtract: ["$endTime", "$startTime"]},
		day: {$dayOfYear: "$startTime"},
		year: {$year: "$startTime"},
	}});

	aggs.push({ $group: {
		_id: {agentId: "$agentId", day: "$day", year: "$year"},
		duration: {$sum: "$duration"},
		startTime: {$min: "$startTime"},
		endTime: {$max: "$endTime"},
		status: {$push: {status: "$status", startTime: "$startTime", endTime: "$endTime", duration: "$duration"}}
	}});

	aggs.push({ $group: {
		_id: "$_id.agentId",
		totalDuration: {$sum:  "$duration"},
		avgDuration: {$avg: "$duration"},
		startTime: {$min: "$startTime"},
		endTime: {$max: "$endTime"},
		status: {$push: "$status"}
	}});

	aggs.push({$lookup: {from: 'users', localField: '_id', foreignField: '_id', as: 'user'}});
	aggs.push({ $unwind: { path: '$user', preserveNullAndEmptyArrays: true } });
	aggs.push({$project: {
		name: {$concat: ['$user.displayName', ' (', '$user.name', ')']},
		agentId: '$user._id',
		status: 1,
		startTime: {$dateToString: { format: "%H:%M %d/%m/%Y", date: {$add: ["$startTime", 7 * 60 * 60 * 1000]} } },
		endTime: {$dateToString: { format: "%H:%M %d/%m/%Y", date: {$add: ["$endTime", 7 * 60 * 60 * 1000]} } },
		avgDuration: 1,
		totalDuration: 1
	}});

	_AgentStatusLog.aggregatePaginate(_AgentStatusLog.aggregate(aggs), {page: page, limit: rows}, function(err, result, pageCount, count){
		var codeArr = _.pluck(statusArr, 'statusCode');
		codeArr.push(4);
		_.each(result, function(el){
			var status = {};
			el.status = _.sortBy(_.flatten(el.status), 'startTime');
			el.changeTime = 0;
			el.totalDuration = 0;

			// hoangdv calculat status duration
			var sttLen = el.status.length;
			if (sttLen == 1) {
				status[el.status[0].status] = el.status[0].duration;
			}
			for (var i = 0; i < sttLen - 1; i++) {
				var stt = {
					status: el.status[i].status,
					start: el.status[i].startTime.getTime(),
					end: el.status[i].endTime.getTime()
				};
				for (var j = i + 1; j <= sttLen - 1; j++) {
					var isSameDay = _moment(el.status[i].startTime).format('DD/MM/YYYY') == _moment(el.status[j].startTime).format('DD/MM/YYYY');
					// Không cùng ngày
					if (!isSameDay) {
						break;
					}
					stt.end = el.status[j].startTime.getTime();
					if (el.status[i].status == el.status[j].status) {
						stt.end = el.status[j].endTime.getTime();
						i = j;
					} else {
						el.changeTime++;
						break;
					}
				}
				if (!_.has(status, stt.status)) {
					status[stt.status] = stt.end - stt.start;
				} else {
					status[stt.status] += stt.end - stt.start;
				}
				el.totalDuration += stt.end - stt.start;
			}
			var days = _moment(el.endTime, 'HH:mm DD/MM/YYYY').diff(_moment(el.startTime, 'HH:mm DD/MM/YYYY'), 'days') + 1;
			el.avgDuration = Math.floor(el.totalDuration / days);
			status['Missing'] = 0;
			_.each(_.keys(status), function(key){
				if(!_.isEqual(key, 'Missing') && codeArr.indexOf(Number(key)) < 0){
					status['Missing'] += status[key];
				}
			});
			// end hoangdv
			el.status = status;
		});
		var paginator = new pagination.SearchPaginator({
			prelink: '/report-login-logout',
			current: page,
			rowsPerPage: rows,
			totalResult: count
		});

		callback(err, {data: result, paging: paginator.getPaginationData()});
	});
}

/**
 *
 * @param userIds
 * @param statusArr
 * @param req
 * @param callback
 */
function getTimelines(userIds, statusArr, req, callback) {
	var obj = {};
	var aggs = [];
	aggs.push({$match: {agentId: {$in: userIds}}});
	if (_.has(req.query, 'startTime')) {
		var fieldName = 'startTime';
		var _d1 = _moment(req.query[fieldName].split(' - ')[0], 'DD/MM/YYYY');
		var _d2 = req.query[fieldName].split(' - ')[1] ? _moment(req.query[fieldName].split(' - ')[1], 'DD/MM/YYYY') : _moment(_d1).endOf('day');

		var startDay = (_d1._d < _d2._d) ? _d1 : _d2;
		var endDay = (_d1._d < _d2._d) ? _d2 : _d1;
		startDay = startDay.startOf('day');
		endDay = endDay.endOf('day');

		obj['startTime'] = {$gte: startDay._d, $lt: endDay._d};
	}

	if (_.has(req.query, 'agentId') && req.query.agentId.length > 0) {
		obj['agentId'] = {$in: _.arrayObjectId(req.query.agentId)};
	}
	obj['endTime'] = {$ne: null};

	aggs.push({$match: obj});
	aggs.push({
		$sort: {
			startTime: 1
		}
	});
	aggs.push({ $project: {
		_id: 1,
		startTime: 1,
		endTime: 1,
		agentId: 1,
		status: 1,
	}});

	aggs.push({ $group: {
		_id: {
			agentId: "$agentId",
			day: {$dayOfMonth: {$add: ["$startTime", 7 * 60 * 60 * 1000]}},
			month: {$month: {$add: ["$startTime", 7 * 60 * 60 * 1000]}},
			year: {$year: {$add: ["$startTime", 7 * 60 * 60 * 1000]}},
			//status: "$status"
		},
		status: {
			$push: {
				status: "$status",
				startTime: {$add: ["$startTime", 0]},
				endTime: {$add: ["$startTime", 0]},
			}
		}
	}});
	aggs.push({
		$lookup: {
			from: 'users',
			localField: '_id.agentId',
			foreignField: '_id',
			as: 'user'
		}
	});
	aggs.push({ $unwind: { path: '$user', preserveNullAndEmptyArrays: true } });
	aggs.push({$project: {
		time: "$_id",
		agent: {
			_id: "$user._id",
			name: {$concat: ['$user.displayName', ' (', '$user.name', ')']}
		},
		status: 1
	}});


	_AgentStatusLog.aggregate(aggs, function(err, result) {
		if (err) return callback(err);
		_.each(result, function(el){
			_.each(el.status, function(stt) {
				if (stt.status == 4) {
					return stt.status = 'Not Answering';
				}
				var status = _.find(statusArr, function(s) {
					return s.statusCode == stt.status;
				});
				if (status) {
					stt.status = status.name;
				} else {
					stt.status = 'Missing';
				}
			});
		});
		callback(err, result);
	});
}

/**
 * Convert millisecond to hh:mm:ss
 * @param s Millisecond
 * @returns {*}
 */
function msToTime(s) {
	if(s == 0) return '00:00:00';
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return _.pad(hrs, 2, '0') + ':' + _.pad(mins, 2, '0') + ':' + _.pad(secs, 2, '0');
}

/**
 *
 * @param req
 * @param callback
 * @returns {*}
 */
function permissionConditions(req, callback) {
	if(!(req.session.auth && req.session.auth)) {
		var err = new Error('session auth null');
		return callback(err);
	};
	var _ids = [new mongodb.ObjectId(req.session.user._id.toString())];
	var _isTeamLeader = req.session.auth.company && !req.session.auth.company.leader && req.session.auth.company.group.leader;
	var _isCompanyLeader = req.session.auth.company && req.session.auth.company.leader;
	var _isTenantLeader = !req.session.auth.company;

	var _paralledArr = [];

	if(_isTeamLeader){
		_paralledArr.push(function(next){
			_Users.distinct('_id', {$or: [
				{agentGroupLeaders: {$elemMatch: {group: req.session.auth.company.group._id}}},
				{agentGroupMembers: {$elemMatch: {group: req.session.auth.company.group._id}}}
			]}, function(err, result){
				_ids = _.union(_ids, result);
				next(err);
			});
		});
	};

	var _groupQuery = {};
	var _companyQuery = {};
	if(_isCompanyLeader){
		_groupQuery = {idParent: req.session.auth.company._id};
		_companyQuery = {idCompany: req.session.auth.company._id};
	};

	if(_isCompanyLeader || _isTenantLeader){
		_paralledArr.push(function(next){
			_async.waterfall([
				function(next){
					_Campains.distinct('_id',_companyQuery, next);
				},
				function(ids, next){
					_CampaignAgent.distinct('idAgent', {idCampaign: {$in: ids}}, next);
				}
			], function(err, result){
				_ids = _.union(_ids, result);
				next(err);
			});
		});

		_paralledArr.push(function(next){
			_async.waterfall([
				function(next){
					_AgentGroups.distinct('_id',_groupQuery, next);
				},
				function(ids, next){
					_Users.distinct('_id', {$or: [
						{agentGroupLeaders: {$elemMatch: {group: {$in: ids}}}},
						{agentGroupMembers: {$elemMatch: {group: {$in: ids}}}}
					]}, next);
				}
			], function(err, result){
				_ids = _.union(_ids, result);
				next(err);
			});
		});
	};

	_async.parallel(_paralledArr, function(err, result){
		callback(err, _ids);
	});
}