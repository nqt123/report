
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
		$('#exportexcel').on('click', function (event) {
			var currentDate = moment().format('DD-MM-YYYY');
			var exportexcel = tableToExcel('exceldata', 'Detailed Report');
			$(this).attr('download', currentDate + '_LoginLogoutReport_Albert.xls')
			$(this).attr('href', exportexcel);
		});
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
							if(el.chosen()) el.trigger("chosen:updated");
							break;
					}
				}
			});
		},
		uncut: function () {
			$(document).off('click', '#exportexcel');
		}
	};
}(jQuery);