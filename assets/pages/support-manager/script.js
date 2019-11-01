var DFT = function ($) {

    const buttonSearch = document.querySelector("#btn-search");
    const bt = document.querySelector("#empty-container div")
        //nhận yêu cầu
        $(".btn-received").bind('click', function () {
            let targetIds = $(this).data("id");
            console.log($(this));
            
            let title = $(this).context.dataset.name;

            
            
            let support = {
                id: targetIds
            }
            $(".table-responsive").find(`div.btn-received[data-id=${targetIds}] i.zmdi-wrench`).css("display", "none");
            $(".table-responsive").find(`div.btn-received[data-id=${targetIds}] i.zmdi-rotate-right`).css("display", "block");

            fetch('/support-manager/' + targetIds, {
                method: 'PUT',
                body: JSON.stringify({ support }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log(res);

                if (_.isEqual(res.status, 200)) {
                    swal({
                        title: "Thành công",
                        text: `Nhận yêu cầu ${title} thành công`,
                        type: "success"
                    }, function () {
                        _.LoadPage(window.location.hash)
                    })
                }
                else {
                    swal({ title: "Thông báo", type: "error", text: res.statusText })
                }
            })

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
        //processing after search
        // if ($("#table-categorys tbody tr").length == 1) {
        //     console.log(!!(searchString!=""));
        //     console.log(searchString);
            
        //     if(searchString != "")
        //     swal({
        //         title: "Thông báo",
        //         text: "Không tìm thấy bản ghi phù hợp",
        //         type: "warning", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "Quay lại!"
        //     },
        //         function () {
        //             window.history.back();
        //         })
        // }

        //sort
        $(document).on('click', '.table-fix th', function (e) {
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
                    $this.attr('data-sort', 'none')
                    break;
            }
            $this.siblings().attr('data-sort', 'none')
            $this.children('i').removeClass('zmdi-sort-asc');
            $this.children('i').removeClass('zmdi-sort-desc');
            $this.children('i').addClass(_.isEqual(sort, 'none') ? '' : ('zmdi-sort-' + sort));
            let name = $this.attr('data-field');
            location.hash = "support-manager" + "?sort=" + name + ":" + sort
        })
    
    return {
        init: function () {
            
            
        }
    }
}(jQuery);