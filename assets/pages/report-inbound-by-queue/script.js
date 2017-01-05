var DFT = function ($) {
    var options = {};
    var options2 = {};
    var options3 = {};
    var options4 = {};
    // Lấy dữ liệu lọc và truy vấn server
    var getFilter = function () {
        var filter = _.chain($('.input'))
            .reduce(function (memo, el) {
                if (!_.isEqual($(el).val(), '')&&!_.isEqual($(el).val(), null)) memo[el.name] = $(el).val();
                return memo;
            }, {}).value();
        window.location.hash = newUrl(window.location.hash, filter);
    };
    var bindClick = function () {
        //$('.datepicker').datetimepicker({
        //    format:"MM/YYYY",
        //    locale:'vi'
        //})
        // Làm mới trang
        $(document).on('click', '.zmdi-refresh', function(){
            window.location.hash = window.location.hash.split("?")[0];
        });
        // Click tìm kiếm
        $('a.btn.bgm-blue.uppercase.c-white').click(function () {
            getFilter();
        });
        // xuất file báo cáo
        $('#exportexcel').on('click', function (event) {
            var todaysDate = moment().format('DD-MM-YYYY');
            var exportexcel = tableToExcel('exceldata', 'My Worksheet');
            $(this).attr('download', todaysDate + '_BaoCaoGoiRaTheoQueue(CongTy).xls')
            $(this).attr('href', exportexcel);
        })
        // xuất file báo cáo
        $('#exportexcel2').on('click', function (event) {
            var todaysDate = moment().format('DD-MM-YYYY');
            var exportexcel = tableToExcel('exceldata2', 'My Worksheet');
            $(this).attr('download', todaysDate + '_BaoCaoGoiRaTheoQueue(ThoiGian).xls')
            $(this).attr('href', exportexcel);
        });
        // Cập nhật lại giao diện khi thay đổi ngày lọc
        $("#startDate").on("dp.change", function (e) {
            $('#endDate').data("DateTimePicker").minDate(e.date);
        });
        $("#endDate").on("dp.change", function (e) {
            $('#startDate').data("DateTimePicker").maxDate(e.date);
        });
    };
    var bindSubmit = function () {
        var items = {};
        items.pie = {};
        items.pie.data = [];
        items.pie.name = "Số lượng kết nối queue";
        items.pie.seriesName = "SL";
        items.pie2 = {};
        items.pie2.data = [];
        items.pie2.name = "Thời lượng đàm thoại trung bình";
        items.pie2.seriesName = "Thời lượng";
        items.pie3 = {};
        items.pie3.data = [];
        items.pie3.name = "Cuộc gọi bị nhỡ";
        items.pie3.seriesName = "Số lượng";
        _.each(result1, function(o){
            items.pie.data.push({name: o.companyName, y:parseFloat((o.totalCall/total.totalCall*100).toFixed(2))})
            items.pie2.data.push({name: o.companyName, y:parseFloat((o.avgCallDuration/result1.length/total.avgCallDuration*100).toFixed(2))})
            items.pie3.data.push({name: o.companyName, y:parseFloat(((o.totalCall- o.connected)/(total.totalCall-total.connected)*100).toFixed(2))})
        })
        var items2 = {};
        items2.date = [];
        items2.total = [];
        items2.connected = [];
        _.each(result2, function(o){
            items2.date.push(o._id.month + '/' + o._id.year);
            items2.total.push(o.totalCall);
            items2.connected.push(o.connected);
        });
        options = getOptions(items.pie);
        options2 = getOptions(items.pie2);
        options3 = getOptions(items.pie3);
        options4 = {
            title: {
                text: 'Báo cáo theo tháng',
                x: -20 //center
            },
            xAxis: {
                categories: items2.date
            },
            yAxis: {
                title: {
                    text: 'Số cuộc gọi'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Số lượng kết nối queue',
                data: items2.total
            }, {
                name: 'Cuộc gọi được phục vụ',
                data: items2.connected
            }]
        }
    };
    // Hiển thị tên cột theo file config
    var bindTextValue = function () {
        _.each(_.allKeys(_config.MESSAGE.REPORT_INBOUND_BY_QUEUE), function (item) {
            $('.' + item).html(_config.MESSAGE.REPORT_INBOUND_BY_QUEUE[item]);
        });
    }
    return {
        init: function () {
            // Thông báo khi không tìm thấy kết quả
            if (isAlertSearch && Object.keys(window.location.obj).length > 0) {
                swal({
                    title: _config.MESSAGE.TICKETREASON_TXT.SEARCH_NOT_FOUND_TITLE,
                    text: _config.MESSAGE.TICKETREASON_TXT.SEARCH_NOT_FOUND_TEXT,
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Quay lại!",
                    closeOnConfirm: true
                }, function () {
                    window.history.back();
                });
            }
            // Cập nhật lại dữ liệu lọc
            if (_.has(window.location.obj, 'idCompany[]')){
                var item = decodeURI(window.location).split("?")[1].split("&");
                var array = [];
                _.each(item, function(o){
                    if(o.split("=")[0]=="idCompany[]"){
                        array.push(o.split("=")[1]);
                    }
                })
                $('select[name="idCompany"]').selectpicker("val", array).selectpicker('refresh');
            };
            // Cập nhật lại dữ liệu lọc
            _.each(window.location.obj, function (v, k) {
                var el = $('#' + k.replace(['[]'], '').replace('.', '\\.'));
                if (el[0]) {
                    switch (el.prop('tagName')) {
                        case 'INPUT':
                            el.val(v);
                            break;
                        case 'SELECT':
                            el.val(v);
                            if (el.is('.selectpicker')){
                                el.val(v).selectpicker('refresh');
                            }
                            break;
                    }
                }
            });
            bindClick();
            bindSubmit();
            bindTextValue();
            $('#mot').highcharts(options);
            $('#hai').highcharts(options2);
            $('#ba').highcharts(options3);
            $('#container').highcharts(options4);
        },
        uncut: function () {
            // disable sự kiện khi đóng trang
            $(document).off('click', 'a.btn.bgm-blue.uppercase.c-white');
            $(document).off('click', '#exportexcel');
            $(document).off('click', '.zmdi-refresh');
        }
    };
}(jQuery);
function getOptions(item){
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: item.name
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    distance: 0
                }
            }
        },
        series: [{
            name: item.seriesName,
            colorByPoint: true,
            data: item.data
        }]
    };
}