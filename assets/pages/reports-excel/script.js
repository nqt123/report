var DFT = function ($) {
  console.log('load');

  const refreshBtn = document.querySelector('#refreshBtn')
  const itemList = document.querySelectorAll('#item')
  const buttonSearch = document.querySelector('#btn-search')

  // var getFilter = function () {
  //   var filter = _.chain($('.input'))
  //       .reduce(function (memo, el) {
  //           if (!_.isEqual($(el).val(), '')&&!_.isEqual($(el).val(), null)) memo[el.name] = $(el).val();
  //           return memo;
  //       }, {}).value();
  //       console.log(filter);
  //       fetch('/reports-excel/new?' + $.param(filter),
  //       {
  //         method: "GET",
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     ).then(res => res.json()).then((respond) => {
  //       console.log(respond);
  //       initTable(respond);
  //     })
  //   }
  
  $(document).on('change', "#selectInfo", function () {
    let select = $(this).val()
    buttonSearch.addEventListener('click', (e) => {
      e.preventDefault()
      fetch('/reports-excel/new?type=' + $(this).val(),
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(res => res.json()).then(respond => {
        console.log(respond);

        initTable(respond);
      })
    })
  })

  // Hiển thị dữ liệu báo cáo

  // xuất file báo cáo
  $('#exportexcel').on('click', function (event) {
    console.log('hello');

    var todaysDate = moment().format('DD-MM-YYYY');
    var exportexcel = tableToExcel('exceldata', 'My Worksheet');
    $(this).attr('download', todaysDate + '_Báo cáo support.xls')
    $(this).attr('href', exportexcel);
  })

  var initTable = function (respond) {
    $("#tbBody").empty();
    _.each(respond, function (data, i) {
      var tags = _.Tags([
        {
          tag: 'tr', attr: { id: data._id }, childs: [
            { tag: 'td', attr: { class: 'text-left' }, content: data.displayName },
            { tag: 'td', attr: { class: 'text-center 0' }, content: data.CRM },
            { tag: 'td', attr: { class: 'text-center 1' }, content: data.fieldMenuReport.displayName },
            { tag: 'td', attr: { class: 'text-center 2' }, content: data.fieldListReport.name },
            { tag: 'td', attr: { class: 'text-center 2' }, content: data.title },
            { tag: 'td', attr: { class: 'text-center 2' }, content: data.prior },
            { tag: 'td', attr: { class: 'text-center 11' }, content: moment(data.createdAt).format("HH:mm - Do MMM YYYY") },
            { tag: 'td', attr: { class: 'text-center 19' }, content: moment(data.lastRespondAt).format("HH:mm - Do MMM YYYY") },
            { tag: 'td', attr: { class: 'text-center 20' }, content: moment(data.lastRespondAt - data.createdAt).format("HH:mm - Do MMM YYYY") },
            { tag: 'td', attr: { class: 'text-center 21' }, content: data.status }
          ]
        }
      ]);

      $("#tbBody").append(tags);
    })
  };


  // let queryFilter = function () {
  //   let _data = _.pick($('#report-excel').serializeJSON(), _.identity);
  //   let listFilter = _.chain(_.keys(_data))
  //     .reduce(function (memo, item) {
  //       memo[item.replace("filter_", "")] = _data[item];
  //       return memo;
  //     }, {})
  //     .value();
  //   paging = _.has(window.location.obj, 'page') ? '&page=' + window.location.obj.page : '';
  //   window.location.hash = newUrl(window.location.hash.replace('#', ''), listFilter) + paging;
  // }



  return {
    init: function () {
    },
    uncut: function () {
      $(document).off('change', '#selectInfo')
    }
  }
}(jQuery);