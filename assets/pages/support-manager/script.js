 //Lưu giá trị search cũ
 let _searchpath = {};
 let saveSearchData = function(obj){
    if(_.has(obj,'name')){
        _searchpath.name=obj.name;
    }
     if(_.has(obj,'type')){
         _searchpath.type=obj.type;
     }
    if(_.has(obj,'title')){
        console.log('hello1');
        _searchpath.title=obj.title;
    }
    if(_.has(obj,'prior')){
        _searchpath.prior=obj.prior;
    }
    if(_.has(obj,'status')){
        console.log('hello2');
        _searchpath.status=obj.status;
    } 
 }
 
 $(".btn-received").bind('click',function(){
        let targetIds = $(this).data("id");
        let support ={
            id:targetIds
        }
         $(".table-responsive").find(`a.btn-received[data-id=${targetIds}]`).css("display","none");
        fetch('/support-manager/' + targetIds, {
            method: 'PUT',
            body: JSON.stringify({ support }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => _.LoadPage(window.location.hash))
        
    })
        // Load lại trang
$('.zmdi-refresh').bind('click', function(){
    _.LoadPage(window.location.hash);
});
// Click nút lọc
$('#btn-search').on('click',function(){
    queryFilter();
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
                            swal({title: 'Thành công', text: 'Yêu cầu đã được xoá', type: "success"});
                            _.LoadPage(window.location.hash);
                        } else {
                            swal({title: 'Thất bại!', text: resp.message});
                        }
                    });
                });
        });

// Lấy dữ liệu search và gửi lên server

let queryFilter =function(){
    _searchpath={};
    if($("#name").val().length > 0){
        window.location.obj['name'] = $('#name').val();
    }
    else{
        delete window.location.obj.name;
    }
    if($('#type').val().length > 0){
        window.location.obj['type'] = $('#type').val();
    }
    else{
        delete window.location.obj.type;
    }
    if($('#prior').val().length > 0){
        window.location.obj.prior = $('#prior').val();
    }
    else{
        delete window.location.obj.prior;
    }
    if($("#title").val().length > 0){
        window.location.obj['title'] = $('#title').val();
    }
    else{
        delete window.location.obj.title;
    }
    if($('#status').val().length > 0){
        window.location.obj.status = $('#status').val();
    }
    else{
        delete window.location.obj.status;
    }
    saveSearchData(window.location.obj);
    window.location.hash = newUrl('support-manager',window.location.obj)
}
if ($('#table-categorys tbody tr').length == 1) {
    delete window.location.obj['sort'];
    if (!_.isEmpty(window.location.obj)) {
        swal({
                title: "Thông báo",
                text: "Không tìm thấy bản ghi phù hợp",
                type: "warning", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "Quay lại!"
            },
            function () {
                window.history.back();
            });
    }
}
if (_.has(_searchPath, 'name')){
    if (!_.isEqual(_searchPath['name'], 'asc') && !_.isEqual(_searchPath['name'], 'desc')){
        $('#name').val(_searchPath['name']);
    }
    else{
        _keyword = _searchPath['name'];
    }
}
if (_.has(_searchPath, 'type')){
    if (!_.isEqual(_searchPath['type'], 'asc') && !_.isEqual(_searchPath['type'], 'desc')){
        $('#type').val(_searchPath['type']);
    }
    else{
        _keyword = _searchPath['type'];
    }
}
if (_.has(_searchPath, 'title')){
    if (!_.isEqual(_searchPath['title'], 'asc') && !_.isEqual(_searchPath['title'], 'desc')){
        $('#title').val(_searchPath['title']);
    }
    else{
        _keyword = _searchPath['title'];
    }
}

if (_.has(_searchPath, 'prior') && !_.isEqual(_searchPath['prior'], 'asc') && !_.isEqual(_searchPath['prior'], 'desc')){
    $('#prior').val(_searchPath['prior']);
}

if (_.has(_searchPath, 'status')){
    if (!_.isEqual(_searchPath['status'], 'asc') && !_.isEqual(_searchPath['status'], 'desc')){
        $('#status').val(_searchPath['status']);
    }
    else{
        _keyword = _searchPath['status'];
    }
}

$('.selectpicker').selectpicker('refresh');

