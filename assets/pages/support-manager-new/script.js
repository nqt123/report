var DFT = function ($) {

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