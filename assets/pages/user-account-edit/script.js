
document.querySelector('#back').addEventListener('click', (e) => {
  location.hash = 'users'
})

document.querySelector('#update').addEventListener('click', (e) => {
  e.preventDefault()
  const positionName = document.querySelector('#positionName').value
  let checkListItem = document.querySelectorAll('.form-check-input:checked')
  const id = document.querySelector('#id').value.trim()
  const checkList = []
  checkListItem.forEach(check => {
    checkList.push(check.value)
  })


  const body = {
    positionName,
    checkList,
    id
  }
  fetch('/user-account/' + id, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(res => res.json()).then(respond => location.hash = "users")
})
var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);