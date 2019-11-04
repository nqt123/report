
const submitButton = document.querySelector('#submit');
const $name= document.querySelector("#name");
const $location = document.querySelector("#location");
const $email = document.querySelector("#email");
const $displayName= document.querySelector("#displayName");
const textMessage = document.querySelector("#warning-message");
const regexEmail =new RegExp(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)
const btnback = document.querySelector("#btn-back");
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  const name = $name.value;
  const location = $location.value;
  const email = $email.value;
  const displayName = $displayName.value;
  const body ={
    name,
    location,
    email,
    displayName
  }
  if(name == ""){
    window.scrollTo({top:25,behavior:'smooth'})
    return textMessage.textContent = "Không được để trống tên"
  }
  if(location == ""){
    window.scrollTo({top:25,behavior:'smooth'})
    return textMessage.textContent = "Không được để trống vị trí"
  }
  if(email == ""){
    window.scrollTo({top:25,behavior:'smooth'})
    return textMessage.textContent = "Không được để trống email"
  }
  if(!regexEmail.test(email)){
    window.scrollTo({top:25,behavior:'smooth'})
    return textMessage.textContent = "Email không hợp lệ"
  }
  if(displayName == ""){
    window.scrollTo({top:"25",behavior:"smooth"})
    return textMessage.textContent = "Không được để trống Tên hiển thị"
  }

  
  fetch('support-email', {
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
        window.location.hash = 'support-email'
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
  window.location.hash="support-email"
})

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);