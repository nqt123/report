console.log('Loa123ded')

const rows = document.querySelectorAll('tr#item')
const btnSearch = document.querySelector('#btn-search')
const liList = document.querySelectorAll('div ul.pagination li')

for (let i = 0; i < rows.length; i++) {
  const updateBtn = rows[i].querySelector('#update')
  const id = rows[i].querySelector('#id').innerHTML.trim()
  updateBtn.addEventListener('click', (e) => {
    location.hash = 'sla/' + id + '/edit'
  })
}

for (let i = 0; i < rows.length; i++) {
  const deleteIcon = rows[i].querySelector('#delete')
  deleteIcon.addEventListener('click', function (e) {
    swal({
      title: `Xác nhận xoá?`,
      text: "Sau khi xoá yêu cầu sẽ không thể phục hồi",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      closeOnConfirm: true,
      closeOnCancel: true,
    },
      function (isConfirm) {
        if (isConfirm) {
          const id = rows[i].querySelector('#id').innerHTML.trim()
          fetch('/sla/' + id, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
              'Content-type': 'application/json'
            }
            // }).then(res => res.json()).then(response => _.LoadPage(window.location.hash))
          }).then(res => res.json()).then(response => {
            _.LoadPage(location.hash)
          })
        }
      }
    );
  })
}
btnSearch.addEventListener('click', (e) => {
  let searchTerm = {}
  const page = window.location.obj['page'] || 1
  const searchColumn = document.querySelectorAll('.searchColumn')
  searchColumn.forEach(col => {
    searchTerm[col.attributes.name.value] = col.value || ""
  })

  var searchString = "&"
  Object.keys(searchTerm).forEach((key, i) => {
    if (searchTerm[key] == "") {
      return delete searchTerm[key]
    }
    searchString += key + "=" + searchTerm[key] + "&"
  })
  if (searchString != "&") {
    window.searchString = searchString
    location.hash = 'sla' + "?page=" + page + searchString
  }
  else {
    window.searchString = ''
    location.hash = 'sla'
  }
})
for (let i = 0; i < liList.length; i++) {
  liList[i].addEventListener('click', (e) => {
    if (window.searchString) {
      liList[i].querySelector('a').href = liList[i].querySelector('a').href + window.searchString
    }
  })
}

document.querySelector('body').addEventListener('keyup',(e)=>{
  if(e.keyCode == 13){
    e.preventDefault()
    btnSearch.click()
  }
})


var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);