console.log('loaded');
const $name = document.querySelector("#name");
const $displayName = document.querySelector("#displayName");
const btnSubmit = document.querySelector("#update")
const $tagetId = document.querySelector("#tagetId")
const btnback = document.querySelector("#btn-back");
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const name = $name.value;
    const displayName = $displayName.value;
    const tagetId =$tagetId.value 
    const body = {
        tagetId,
        name,
        displayName
    }
    fetch("sla-menu/" +tagetId.value, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (_.isEqual(res.status, 200)) {
            swal({
                title: "Thành công",
                text: `Cập nhật thành công`,
                type: "success"
            }, function () {
                window.location.hash='sla-menu';
            })
        }
        else {
            swal({ title: "Thông báo", type: "error", text: res.statusText })
        }
    })
})
btnback.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.hash="sla-menu"
})
var DFT = function ($) {
    return {
        init: function () {
        }
    }
}(jQuery);