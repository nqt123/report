var DFT = function ($) {

    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    var bindClick = function () {

    };

    var bindSubmit = function () {
        $('#frm-login').validationEngine('attach', {
            validateNonVisibleFields: true, autoPositionUpdate: true,
            onValidationComplete: function (form, status) {
                if (status) {
                    _AjaxObject('/login', 'POST', form.getData(), function (resp) {
                        if (_.isEqual(resp.code, 200)) {
                            // if ($('#frm-login input[type="checkbox"]').is(':checked')) {
                                //setCookie('username', $('#frm-login #name').val(), 7);
                                //setCookie('password', $('#frm-login #password').val(), 7);
                            // } else {
                                // setCookie('username', '', 0);
                                // setCookie('password', '', 0);
								// setCookie('deviceId', '', 0);
                            // }
							setCookie('deviceId', $('#frm-login #deviceId').val(), 7);
                            if (window.location.pathname != '/login') {
                                window.location.reload();
                                //window.location.href = '/user/'+ u._id;
                            } else {
                                window.location.href = '/';
                            }
                        } else {
                            $('.alert').remove();
                            $('#l-login').prepend(_.Tags([
                                {
                                    tag: 'div', attr: {class: 'alert alert-danger alert-dismissible', role: 'alert'}, content: resp.message,
                                    childs: [
                                        {tag: 'button', attr: {class: 'close', type: 'button', "data-dismiss": "alert", " aria-label": "Close"}, childs: [{tag: 'span', attr: {"aria-hidden": true}, content: 'x'}]}
                                    ]
                                }
                            ]));
                        }
                    });
                }
            }
        });
        //$(document).on('submit', '#frm-login', function (e) {
        //    var self = $(this);
        //    e.preventDefault();
        //
        //});
    };

    var bindSocket = function (client) {
        client.on('loginRespone', function (data) {
            console.log('loginRespone', data);
        });
    }

    return {
        init: function () {
            if (!$('.login-content')[0]) {
                scrollbar('html', 'rgba(0,0,0,0.3)', '5px');
            }

            //var socket = io.connect(window.location.origin);
            //
            //socket.on('connect', function(socket){
            //    socket.emit('client-connect', {_id: user, sid: this.socket.sessionid});
            //    bindSocket(socket);
            //});

            $('#frm-login #name').val(getCookie('username'));
            $('#frm-login #password').val(getCookie('password'));

            bindClick();
            bindSubmit();
        }
    };
}(jQuery);