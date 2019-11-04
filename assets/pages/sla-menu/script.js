
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
            _AjaxObject('/sla-menu/' + _id, 'DELETE', {}, function (resp) {
                if (_.isEqual(resp.code, 200)) {
                    swal({ title: 'Thành công', text: 'Yêu cầu đã được xoá', type: "success" });
                    _.LoadPage(window.location.hash);
                } else {
                    swal({ title: 'Thất bại!', text: resp.message });
                }
            });
        });
});
$('#refreshBtn').bind('click',(e)=>{
    _.LoadPage(location.hash = "sla-menu");
})

var DFT = function ($) {

    return {
        init: function () {
        }
    }
}(jQuery);