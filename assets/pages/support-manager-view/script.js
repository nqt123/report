var DFT = function ($) {
    $("#btn-received").bind('click',function(){
        let targetIds = $(this).data("id");
        console.log(targetIds);
        
        let support ={
            id:targetIds,
            status:1
        }
        
         $(".card").find(`a#btn-received[data-id=${targetIds}]`).text("Đã nhận");
        fetch('/support-manager/' + targetIds, {
            method: 'PUT',
            body: JSON.stringify({ support }),
            headers: {
                'Content-Type': 'application/json'
            }
            //  }).then(response => console.log(response));
            
        }).then(res => res.json())
        // .then(response => window.location.href = '/#support-manager')
        
    })
    // Bắt sự kiện submit
    var bindSubmit = function () {
        $('#spt-response').validationEngine('attach', {
            validateNonVisibleFields: true, autoPositionUpdate: true,validationEventTrigger:'keyup',
            onValidationComplete: function (form, status) {
                if (status) {
                    _AjaxData('/support-manager', 'POST', $(form).getData(), function (resp) {
                        if (_.isEqual(resp.code, 200)) {
                            window.location.hash = 'support-manager';
                        } else {
                            swal({title: 'Thông báo !', text: resp.message});
                        }
                    });
                }
            }
        });
    };
    return {
        init: function () {
            bindSubmit();
        }
    };
}(jQuery);
