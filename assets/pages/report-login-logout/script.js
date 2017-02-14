/**
 * Created by hoangdv on 8/24/16.
 */
var DFT = function ($) {
	var queryFilter = function () {
		var _data = $('#form').serializeJSON();
		var listFilter = _.chain(_.keys(_data))
			.reduce(function (memo, item) {
				if(!_.isEqual(_data[item], ''))
					memo[item.replace("filter_", "")] = _data[item];
				return memo;
			}, {})
			.value();

		window.location.hash = newUrl(window.location.hash.replace('#', ''), listFilter);
	};

	var bindClick = function () {
		$(document).on('click', '#filter-btn', function () {
			queryFilter();
		});
		$('#exportexcel').on('click', function () {
			var currentDate = moment().format('DD-MM-YYYY');
			var exportexcel = tableToExcel('exceldata', 'Detailed Report');
			$(this).attr('download', currentDate + '_LoginLogoutReport.xls');
			$(this).attr('href', exportexcel);
		});
		$('#exportexcelgroupbyday').on('click', function (e) {
/*			var currentDate = moment().format('DD-MM-YYYY');
			var exportexcel = tableToExcel('exceldatagroupbyday', 'Detailed Report Group By Day');
			$(this).attr('download', currentDate + '_LoginLogoutReportGroupByDay.xls');
			$(this).attr('href', exportexcel);*/
			tableHtmlToExcel.bind(this)('exceldatagroupbyday', 'Detailed Report Group By Day');
		});
	};

	/**
	 *
	 * @param idTable id of table data
	 * @param sheetName
	 * @param fileName Optional
	 */
	var tableHtmlToExcel = function(idTable, sheetName, fileName) {
		if (!fileName) {
			fileName = moment().format('DD-MM-YYYY') + '_' + (sheetName.replace(/\s/g,'')) + '.xls';
		}
		var exportexcel = tableToExcel(idTable, sheetName);
		$(this).attr('download', fileName);
		$(this).attr('href', exportexcel);
	};

	var bindTextValue = function () {
		_.each(_.allKeys(_config.MESSAGE.REPORT_LOGIN_LOGOUT), function (item) {
			$('.' + item).html(_config.MESSAGE.REPORT_LOGIN_LOGOUT[item]);
		});
	};

	var msToTime = function(s) {
		if(s == 0) return '00:00:00';
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;
		return _.pad(hrs, 2, '0') + ':' + _.pad(mins, 2, '0') + ':' + _.pad(secs, 2, '0');
	};

	/**
	 *
	 * @param timeline array time status
	 * @param idSelector
	 */
	function drawTimelineChar(timeline, idSelector) {
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn({type: 'string', id: 'Date'});
		dataTable.addColumn({type: 'string', id: 'Status'});
		dataTable.addColumn({type: 'date', id: 'Start'});
		dataTable.addColumn({type: 'date', id: 'End'});
		var rows = [];

		// Hacked to String Object to get Date from ISO String
		if (!String.prototype.getTime) {
			String.prototype.getTime = function() {
				var self = this;
				var _d = moment(self.toString());
				if (_d.isValid()) {
					return _d.toDate();
				}
				return new Date();
			};
		}

		timeline.map(function(time) {
			time.status = _.sortBy(time.status, function(stt) {
				return stt.startTime.getTime();
			});
			var sttLen = time.status.length;
			if (sttLen == 1) {
				return rows.push({
					name: time.agent.name.toString(),
					status: time.status[0].status.toString(),
					start: time.status[0].startTime.getTime(),
					end: time.status[0].endTime.getTime()
				});
			}
			for (var i = 0; i < sttLen; i++) {
				var stt = {
					name: time.agent.name.toString(),
					status: time.status[i].status.toString(),
					start: time.status[i].startTime.getTime(),
					end: time.status[i].endTime.getTime()
				};
				// Tìm cho tới khi đổi trạng thái
				for (var j = i + 1; j < sttLen; j++) {
					stt.end = time.status[j].startTime.getTime();
					// Cùng trạng thái
					if (time.status[i].status == time.status[j].status) {
						stt.end = time.status[j].endTime.getTime();
						i = j;
					} else {
						break;
					}
				}
				rows.push(stt);
			}
		});
		$('#' + idSelector).height(_.uniq(rows, function(r) {
				return r.name;
			}).length * 50 + 50);
		var container = document.getElementById(idSelector);
		var chart = new google.visualization.Timeline(container);
		var chartRows = [];
		rows.map(function(r) {
			var start = moment(r.start)._d;
			var end = moment(r.end)._d;
			chartRows.push([r.name, r.status, start, end]);
		});
		dataTable.addRows(chartRows);
		var options = {
			colors: ['#4285F4', '#DB4437', '#F4B400', '#88DD88']
		};
		return chart.draw(dataTable, options);
	}

	/**
	 *
	 */
	var drawCharts = function() {
		if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined')) {
			google.charts.load("current", {packages: ["timeline"], 'language': 'vi'});
			google.charts.setOnLoadCallback(drawCharts);
		} else {
			if (typeof timeline !== 'undefined') {
				drawTimelineChar(timeline, 'timelines');
			}
			if (typeof  timelineByDay !== 'undefined') {
				timelineByDay.map(function(timeline) {
					var time = timeline._id;
					var selector = "chart" + "-" + time.day + "-" + time.month + "-" + time.year;
					drawTimelineChar(timeline.timelines, selector);
				});
			}
		}
	};

	return {
		init: function () {
			bindClick();
			bindTextValue();

			$('.multi-date-picker').datepicker({
				multidate: 2,
				multidateSeparator: ' - ',
				format: 'dd/mm/yyyy',
				todayHighlight: true
			});

			if ($('.pagination')[0]) {
				delete window.location.obj.page;
				var _url = $.param(window.location.obj);
				$('.pagination a').each(function (i, v) {
					$(v).attr('href', $(v).attr('href') + '&' + _url);
				});
			}

			_.each($.deparam(window.location.hash.split('?')[1] || ''), function (v, k) {
				var el = $('#' + k.replace(['[]'], ''));
				if (el[0]) {
					switch (el.prop('tagName')) {
						case 'INPUT':
							el.val(v);
							break;
						case 'SELECT':
							el.val(v);
							if (el.is('.selectpicker')) el.selectpicker('refresh');
							if(el.chosen) el.trigger("chosen:updated");
							break;
					}
				}
			});

			drawCharts();
		},
		uncut: function () {
			$(document).off('click', '#exportexcel');
		}
	};
}(jQuery);