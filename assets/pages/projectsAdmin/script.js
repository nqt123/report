
const rows = document.querySelectorAll('tr#item')
const searchButton = document.querySelector("#btn-search")
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
          fetch('/projectsAdmin/' + id, {
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
<<<<<<< HEAD

let queryFilter = function () {
  let _data = _.pick($('#project').serializeJSON(), _.identity);
  let listFilter = _.chain(_.keys(_data))
    .reduce(function (memo, item) {
      memo[item.replace("filter_", "")] = _data[item];
      return memo;
    }, {})
    .value();
    console.log(listFilter);
    
  paging = _.has(window.location.obj, 'page') ? '&page=' + window.location.obj.page : '';
  var listSort = _.chain($('.listHead th').not('[data-sort="none"]'))
    .map(function (el) {
      return $(el).attr('data-field') ? $(el).attr('data-field') + ':' + $(el).attr('data-sort') : '';
    })
    .compact()
    .value();
  listSort = _.isEmpty(listSort) ? '' : '&sort=' + listSort[0];
  window.location.hash = newUrl(window.location.hash.replace('#', ''), listFilter) + listSort + paging;
}

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  queryFilter();
})

$(document).on('click', '.listHead th', function () {
  var $this = $(this);
  if (_.isUndefined($this.attr('data-field'))) return false;
  switch ($this.attr('data-sort')) {
    case 'none':
      $this.toggleAttr('data-sort', 'asc');
      break;
    case 'asc':
      $this.toggleAttr('data-sort', 'desc');
      break;
    case 'desc':
      $this.toggleAttr('data-sort', 'none');
      break;
  }
  $this.siblings().toggleAttr('data-sort', 'none');
  queryFilter();
});
=======
for (let i = 0; i < rows.length; i++) {
  const updateBtn = rows[i].querySelector('#update')
  const id = rows[i].querySelector('#id').innerHTML.trim()
  updateBtn.addEventListener('click', function (e) {
    location.hash = 'projectsAdmin/' + id+'/edit'
  })
}
>>>>>>> e8d99e7b78e5574b69fb43e6de656143c7264c63

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);