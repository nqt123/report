/**
 * Created by Đại Đồng on 10/05/2016.
 */
exports.index = {
    json: function (req, res) {
        _Company.distinct("_id", req.query.idParent ? {_id:req.query.idParent}:{}, function(err,com){
            _AgentGroups.distinct("_id", {idParent:{$in:com}}, function (err, r) {
                _Users.find({$or: [{'agentGroupLeaders.group': {$in: r}}, {'agentGroupMembers.group': {$in: r}}, {'companyLeaders.company': {$in: com}}]}, function (err, r2) {
                    res.status(200).json(r2);
                });
            });
        });
    },
    html: function (req, res) {
        var query = {};
        query = _.cleanRequest(req.query, ['startDate', 'endDate']);
        var serQuery = {};
        var transQuery = {};
        var companyQuery = {};
        var ticketQuery = {};
        var cond = {};
        cond.$or = [];
        if (_.has(req.query, "startDate") || _.has(req.query, "endDate")) {
            query.startTime = {};
            query.created = {};
            if (_.has(req.query, "startDate")) {
                query.startTime.$gte = _moment(req.query['startDate'], "DD/MM/YYYY").startOf('day').valueOf();
                query.created.$gte = _moment(req.query['startDate'], "DD/MM/YYYY").startOf('day')._d;
            }
            if (_.has(req.query, "endDate")) {
                query.startTime.$lte = _moment(req.query['endDate'], "DD/MM/YYYY").endOf('day').valueOf();
                query.created.$lte = _moment(req.query['endDate'], "DD/MM/YYYY").endOf('day')._d;
            }
        }
        if (_.has(req.query, "status")) {
            query.status = parseInt(req.query.status);
        }
        if (req.session.auth.company) {
            // Phân quyền dữ liệu
            serQuery.idCompany = _.convertObjectId(req.session.auth.company._id);
            companyQuery._id = _.convertObjectId(req.session.auth.company._id);
            cond.$or.push({'companyLeaders.company': _.convertObjectId(req.session.auth.company._id)});
            if (!req.session.auth.company.leader) {
                _.render(req, res, 'report-inbound-overall-agent-productivity', {
                    title: 'Báo cáo gọi vào - Báo tổng quát theo điện thoại viên',
                    result: [],
                    company: [],
                    agent: [],
                    plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], 'export-excel']
                }, true, new Error("Không đủ quyền truy cập"));
                return;
            }
        }
        _async.parallel({
            com: function (cb) {
                // Truy vấn công ty
                _Company.find(companyQuery, cb);
            },
            agent: function (cb) {
                // Truy vấn agent
                _async.waterfall([
                    function (callback) {
                        _Company.distinct("_id", req.session.auth.company ? {_id: req.session.auth.company} : {}, function (err, com) {
                            _AgentGroups.find({idParent:{$in:com}}, {_id: 1}, function (err, result) {
                                if (err) return callback(err, null);
                                var ag = _.pluck(result, '_id');
                                cond.$or.push({'agentGroupLeaders.group': {$in: ag}}, {'agentGroupMembers.group': {$in: ag}}, {'companyLeaders.company': {$in: com}});
                                _Users.find(cond, callback);
                            });
                        });
                    }
                ], cb);
            }
        }, function (err, result) {
            _.isEmpty(req.query) ? (_.render(req, res, 'report-inbound-overall-agent-productivity', {
                title: 'Báo cáo gọi vào - Báo tổng quát theo điện thoại viên',
                result: [],
                company: result.com,
                agent: result.agent,
                plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], 'export-excel']
            }, true, err)) : (
                // Query báo cáo
                _async.waterfall([
                    function(cb){
                        // Lọc theo công ty
                        var serviceQuery = {};
                        if (_.has(req.query, 'idCompany')) {
                            serviceQuery.idCompany = _.convertObjectId(req.query.idCompany);
                        };
                        _Services.distinct("_id", serviceQuery, cb);
                    },
                    function (a,cb) {
                        // Truy vấn dữ liệu call
                        var aggregate = [];
                        transQuery.transType = {$in: [1,7,8]};
                        transQuery.serviceType = 3;
                        transQuery.serviceId = {$in:a};
                        ticketQuery = {idService:{$in:a}, status:{$ne: -1}};
                        if (_.has(query, 'startTime')) {
                            transQuery.startTime = query.startTime;
                        }
                        if (_.has(query, 'created')) {
                            ticketQuery.$or = [];
                            ticketQuery.$or.push({created:query.created});
                            ticketQuery.$or.push({updated:query.created});
                        }
                        if (_.has(req.query, 'agentId')) {
                            transQuery.agentId = {$in: _.arrayObjectId(req.query.agentId)};
                            ticketQuery.idAgent = {$in: _.arrayObjectId(req.query.agentId)};
                        }
                        aggregate.push({$match: transQuery});
                        aggregate.push({
                            $group: {
                                _id: {agent:"$agentId", callId:"$callId"},
                                totalCall: {$sum: 1},
                                connected: {$sum: {$cond: [{$gt: ["$answerTime", 0]}, 1, 0]}},
                                callDuration:{$sum:"$callDuration"}
                            }
                        });
                        aggregate.push({$group:{
                            _id:"$_id.agent",
                            totalCall:{$sum: "$totalCall"},
                            callDuration:{$sum:"$callDuration"},
                            connected: {$sum: "$connected"},
                            missed: {$sum: {$subtract: ["$totalCall", "$connected"]}},
                            avgCallDuration: {$avg: "$callDuration"},
                        }})
                        aggregate.push({
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "agentInfo"
                            }
                        });
                        aggregate.push({ $unwind: { path: '$agentInfo', preserveNullAndEmptyArrays: true }});
                        aggregate.push({ $project:{
                            _id:1,
                            agent: '$agentInfo.displayName',
                            totalCall:1,
                            callDuration:1,
                            connected: 1,
                            missed: 1,
                            avgCallDuration: 1}});
                        aggregate.push({$sort: {agent : 1}});
                        _CdrTransInfo.aggregate(aggregate, cb)
                    },
                    function(trans, next){
                        // Truy vấn dữ liệu trạng thái làm việc
                        var aggs = [];
                        aggs.push({$match: {agentId: {$in: _.pluck(trans, '_id')}}});
                        if (_.has(query, 'startTime')) {
                            aggs.push({$match: {startTime: query.created}});
                        }
                        aggs.push({$project: {
                            agentId: 1,
                            duration: {$subtract: ["$endTime", "$startTime"]}
                        }});
                        aggs.push({$group: {
                            _id: "$agentId",
                            duration: {$sum: "$duration"}
                        }});
                        _AgentStatusLog.aggregate(aggs, function(err, data){
                            _.each(trans, function(tran){
                                _.each(data, function(log){
                                    if(!_.isEmpty(tran._id) && _.isEqual(tran._id.toString(), log._id.toString())){
                                        tran.statusDuration = log.duration;
                                    };
                                });
                            });
                            next(err, trans);
                        });
                    },
                    function(r, cb){
                        // Truy vấn dữ liệu ticket
                        _Tickets.aggregate([
                            {$match:ticketQuery},
                            {$group:{
                                _id:'$idAgent',
                                total:{$sum:1},
                                done:{$sum:{$cond:[{$eq:['$status',2]},1,0]}}
                            }},
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "_id",
                                    foreignField: "_id",
                                    as: "agentInfo"
                                }
                            },
                            {
                                $unwind:{ path: '$agentInfo', preserveNullAndEmptyArrays: true }
                            },
                            {
                                $project:{
                                    _id:1,
                                    agent: '$agentInfo.displayName',
                                    total:1,
                                    done:1
                                }
                            }
                        ], function(err,r2){
                            var result = [];
                            r = _.each(r, function(o){
                                if(o._id) o._id = o._id.toString();
                            });
                            r2 = _.each(r2, function(o){
                                if(o._id) o._id = o._id.toString();
                            });
                            _.each(_.union(_.pluck(r,'_id'), _.pluck(r2,'_id')), function(o){
                                var obj1 = _.findWhere(r, {_id: o}) ? _.findWhere(r, {_id: o}):{_id:o,totalCall:0, callDuration:0, connected: 0, missed: 0, avgCallDuration: 0};
                                var obj2 = _.findWhere(r2, {_id: o}) ? _.findWhere(r2, {_id: o}):{_id:o,total:0,done:0};
                                result.push(_.extend(obj1,obj2));
                            })
                            cb(err, result);
                        })
                    }
                ], function (err, results) {
                    _.render(req, res, 'report-inbound-overall-agent-productivity', {
                        title: 'Báo cáo gọi vào - Báo tổng quát theo điện thoại viên',
                        result: results,
                        company: result.com,
                        agent: result.agent,
                        plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], 'export-excel']
                    }, true, err)
                })
            )
        })
    }
}