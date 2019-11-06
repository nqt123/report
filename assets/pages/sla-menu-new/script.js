
const submitButton = document.querySelector('#submit');
const $name= document.querySelector("#name");
const $displayName= document.querySelector("#displayName");
const textMessage = document.querySelector("#warning-message");
const btnback = document.querySelector("#btn-back");
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('hello');
  const name = $name.value;
  const displayName = $displayName.value;
  const body ={
    name,
    displayName
  }
  if(name == ""){
    window.scrollTo({top:25,behavior:'smooth'})
    return textMessage.textContent = "Không được để trống tên"
  }
  if(displayName == ""){
    window.scrollTo({top:"25",behavior:"smooth"})
    return textMessage.textContent = "Không được để trống Tên hiển thị"
  }

  
  fetch('sla-menu', {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if(res.status == 200){
      swal({
        title:"Thành công",
        text:"Tạo thành công",
        type:"success"
      },function(){
        window.location.hash = 'sla-menu'
      })
    }
    else{
      swal({
        title:"Thông báo",
        text:res.statusText,
        type:"error"
      })
    }
  })
})
btnback.addEventListener('click',(e)=>{
  e.preventDefault();
  window.location.hash = "sla-menu"
})

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);