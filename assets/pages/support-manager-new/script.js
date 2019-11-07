var DFT = function ($) {

    // Bắt sự kiện submit
    var bindSubmit = function () {
        $('#spt-response').validationEngine('attach', {
            validateNonVisibleFields: true, autoPositionUpdate: true,validationEventTrigger:'keyup',
            onValidationComplete: function (form, status) {
                if (status) {
                    _AjaxData('/support-manager', 'POST', $(form).getData(), function (resp) {
                        console.log(resp);
                        
                        if (_.isEqual(resp.code, 200)) {
                            swal({
                                title:"Thành công",
                                text:"Phản hồi đã được gửi",
                                type:"success"
                            },
                                function () {
                                    window.location.hash = 'support-manager-undone'; 
                                }
                            )
                        } else {
                            swal({title: 'Thông báo !', type:"error", text: resp.message});
                        }
                    });
                }
            }
        });
    };
    $("#btn-back").on("click",function(){
        window.history.back()
    })
    return {
        init: function () {
            bindSubmit();
        }
    };
}(jQuery);