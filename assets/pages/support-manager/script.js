const buttonSearch = document.querySelector("#btn-search");

$(".btn-received").bind('click', function () {
    let targetIds = $(this).data("id");
    let support = {
        id: targetIds
    }
    $(".table-responsive").find(`a.btn-received[data-id=${targetIds}]`).css("display", "none");
    fetch('/support-manager/' + targetIds, {
        method: 'PUT',
        body: JSON.stringify({ support }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => _.LoadPage(window.location.hash))

})
// Load lại trang
$('.zmdi-refresh').bind('click', function () {
    _.LoadPage(location.hash = "support-manager");
});

// Xóa 1 phần tử
$('.btn-remove').bind('click', function () {
    let _id = $(this).attr('data-id');
    swal({
        title: "Bạn muốn xoá mục này ?",
        text: "Tất cả các bài viết có trong mục này sẽ được cập nhật",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Có, chắc chắn !",
        closeOnConfirm: false
    },
        function () {
            _AjaxObject('/support-manager/' + _id, 'DELETE', {}, function (resp) {
                if (_.isEqual(resp.code, 200)) {
                    swal({ title: 'Thành công', text: 'Yêu cầu đã được xoá', type: "success" });
                    _.LoadPage(window.location.hash);
                } else {
                    swal({ title: 'Thất bại!', text: resp.message });
                }
            });
        });
});

const $searchButtons = document.querySelectorAll('.searchCol')
for (let i = 0; i < $searchButtons.length; i++) {
    $searchButtons[i].addEventListener('click', (e) => {
        e.preventDefault()
    })
}
//Binding search button
buttonSearch.addEventListener('click', (e) => {
    let searchTerm = {}
    const page = window.location.obj['page'] || 1
    const searchColumns = document.querySelectorAll('.searchCol')
    for (let i = 0; i < searchColumns.length; i++) {
        searchTerm[searchColumns[i].attributes.name.value] = searchColumns[i].value != "" ? searchColumns[i].value : ""
    }

    let searchString = '&'
    Object.keys(searchTerm).forEach((key, i) => {
        if (searchTerm[key] == "") {
            return delete searchTerm[key];
        }
        searchString += key + "=" + searchTerm[key] + "&"
    })
    if (searchString != "&") {
        window.searchString = searchString;
        location.hash = "support-manager" + "?page=" + page + searchString
    }
    else {
        location.hash = "support-manager"
    }

})

//sort
$(document).on('click', '.sort', function(e){
    let $this = $(this)
    let sort = 'none'
    if (_.isUndefined($this.attr('data-field'))) return false
    switch ($this.attr('data-sort')) {
        case 'none':
            sort = 'asc'
            $this.attr('data-sort', 'asc')
            break;
        case 'asc':
            sort = 'desc'
            $this.attr('data-sort', 'desc')
            break;
        case 'desc':
            $this.attr('data-sort','none')
            break;
    }
    
    $this.siblings().attr('data-sort','none')
    $this.children('span').removeClass('zmdi-sort-asc')
    $this.children('span').removeClass('zmdi-sort-desc')
    $this.children('span').addClass(_.isEqual(sort, 'none') ? '' : ('zmdi-sort-' + sort));
    let name = $this.attr('data-field');
    
   location.hash = "support-manager" + "?sort=" + name +":" + sort
})

var DFT = function ($) {
    return {
        init: function () {
        }
    }
}(jQuery);

