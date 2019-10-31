const refreshBtn = document.querySelector('#refreshBtn')
const itemList = document.querySelectorAll('#item')
const buttonSearch = document.querySelector('#btn-search')
const liList = document.querySelectorAll('div ul.pagination li')
//Refresh Button Event
refreshBtn.addEventListener('click', (e) => {
  console.log(itemList.length)
  e.preventDefault()
  _.LoadPage(window.location.hash);
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

const $searchButtons = document.querySelectorAll('.searchColumn')
for (let i = 0; i < $searchButtons.length; i++) {
  $searchButtons[i].addEventListener('click', (e) => {
    e.preventDefault()
  })
}
//Binding Search Button
buttonSearch.addEventListener('click', (e) => {
  let searchTerm = {}
  const page = window.location.obj['page'] || 1
  const searchColumns = document.querySelectorAll('.searchColumn')
  for (let i = 0; i < searchColumns.length; i++) {
    searchTerm[searchColumns[i].attributes.name.value] = searchColumns[i].value != "" ? searchColumns[i].value : ""
  }

  var searchString = "&"
  Object.keys(searchTerm).forEach((key, i) => {
    if (searchTerm[key] == "") {
      return delete searchTerm[key]
    }
    searchString += key + "=" + searchTerm[key] + "&"
  })
  if (searchString != "&") {
    window.searchString = searchString
    location.hash = 'reports' + "?page=" + page + searchString
  }
  else {
    window.searchString = ""
    location.hash = 'reports'
  }
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
/**
 * Created by LINHNV
 */

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);