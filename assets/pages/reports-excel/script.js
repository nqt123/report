var DFT = function ($) {
  console.log('load');

  const refreshBtn = document.querySelector('#refreshBtn')
  const itemList = document.querySelectorAll('#item')
  const buttonSearch = document.querySelector('#btn-search')
  const liList = document.querySelectorAll('div ul.pagination li')
  const $createdAt = document.querySelector("#createdAt");
  const $lastRespondAt = document.querySelector("#lastRespondAt");
  const selectInfo = document.querySelector("#selectInfo")
  const exceldata = document.querySelector("#exceldata")
  $(document).on('change', "#selectInfo", function () {
    let select = $(this).val();
    let content = $(this)
    console.log(content);
    
    if (select != null) {
      $("#exceldata tr#titleExcel").append(`<td class="bgm-orange c-white text-center"><span>${select[select.length - 1]}</span></td>`)
      // $("#exceldata tr#contentExcel").append(`<td class="text-center"><%- el.name%></td>`)
    }
  })

  //New Report Route and Scroll Top
  for (let i = 0; i < itemList.length; i++) {
    itemList[i].querySelector('#detail').addEventListener('click', function (e) {
      const id = itemList[i].querySelector('td#id').textContent.trim()
      location.hash = 'reports' + '/' + id
      window.scrollTo({ top: 25, behavior: 'smooth' })
    })
  }
  //Bind Item
  for (let i = 0; i < itemList.length; i++) {
    itemList[i].addEventListener('click', (e) => {
      const id = itemList[i].querySelector('td#id').textContent.trim()
      location.hash = 'reports' + '/' + id
      window.scrollTo({ top: 25, behavior: 'smooth' })
    })
  }




  // //Delete foreach row
  // for (let i = 0; i < itemList.length; i++) {
  //   itemList[i].querySelector('#delete').addEventListener('click', function (e) {
  //     const reportName = document.querySelector('#report-name').textContent
  //     swal({
  //       title: `Xác nhận xoá yêu cầu tiêu đề ${reportName}`,
  //       text: "Sau khi xoá yêu cầu sẽ không thể phục hồi",
  //       type: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#DD6B55",
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //       closeOnConfirm: true,
  //       closeOnCancel: true,
  //     },
  //       function (isConfirm) {
  //         if (isConfirm) {
  //           const id = itemList[i].querySelector('td#id').textContent.trim()
  //           fetch('/reports/' + id, {
  //             method: 'DELETE',
  //             body: JSON.stringify({ id }),
  //             headers: {
  //               'Content-type': 'application/json'
  //             }
  //             // }).then(res => res.json()).then(response => _.LoadPage(window.location.hash))
  //           }).then(res => res.json()).then(response => {
  //             _.LoadPage(location.hash)
  //           })
  //         }
  //       }
  //     );
  //   })
  // }
  // //

  let queryFilter = function () {
    let _data = _.pick($('#report-excel').serializeJSON(), _.identity);
    let listFilter = _.chain(_.keys(_data))
      .reduce(function (memo, item) {
        memo[item.replace("filter_", "")] = _data[item];
        return memo;
      }, {})
      .value();
    paging = _.has(window.location.obj, 'page') ? '&page=' + window.location.obj.page : '';
    window.location.hash = newUrl(window.location.hash.replace('#', ''), listFilter) + paging;
  }

  buttonSearch.addEventListener("click", function (e) {
    e.preventDefault();
    queryFilter();
  })
  //Bind LiList
  for (let i = 0; i < liList.length; i++) {
    liList[i].addEventListener('click', (e) => {
      if (window.searchString) {
        liList[i].querySelector('a').href = liList[i].querySelector('a').href + window.searchString
      }
    })
  }

  document.querySelector('body').addEventListener('keyup', (e) => {
    if (event.keyCode === 13) {
      e.preventDefault()
      buttonSearch.click()
    }
  })


  return {
    init: function () {

    },
    uncut: function () {
      $(document).off('change', '#selectInfo')
    }
  }
}(jQuery);