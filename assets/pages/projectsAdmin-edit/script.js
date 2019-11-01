console.log('loaded');

const submitButton = document.querySelector('#submit')
const id = document.querySelector('#id').value
console.log(id)
submitButton.addEventListener('click', (e) => {
  const name = document.querySelector('#name').value
  const offTime = document.querySelector('#offTime').value
  const IP = document.querySelector('#IP').value
  const position = document.querySelector('#position').value
  const usingCRM = document.querySelector('#usingCRM').value
  const goLineTime = document.querySelector('#goLineTime').value
  const agentNumber = document.querySelector('#agentNumber').value
  const checkList = []
  if (!name || name == "") {
    return swal("Bạn phải nhập Tên dự án")
  }
  document.querySelectorAll('.form-check-input:checked').forEach((c, i) => {
    checkList.push(c.name)
  })

  const body = {
    name, offTime, IP, agentNumber, checkList, id, position, usingCRM, goLineTime
  }
  
  fetch('/projectsAdmin/' + id, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(respond => location.hash = 'projectsAdmin')
})




var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);