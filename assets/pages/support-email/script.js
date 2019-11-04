var DFT = function ($) {
    console.log('load');
    
    let bindClick = function () {
        const btnremove = document.querySelector("#btn-remove");
        btnremove.addEventListener('click',(e)=>{
            let targetId = $(this).data["id"];
            console.log(targetId);
            
        })
    }

    return {
        init: function () {
            bindClick();
        }
    }
}(jQuery);