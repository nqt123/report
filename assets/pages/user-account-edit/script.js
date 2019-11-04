
document.querySelector('#back').addEventListener('click', (e) => {
  location.hash = 'users'
})

document.querySelector('#update').addEventListener('click', (e) => {
  e.preventDefault()
  const positionName = document.querySelector('#positionName').value
  const id = document.querySelector('#id').value.trim()
  const projects = document.querySelector('#projects').value
  const authority = document.querySelector('#authority').value
  const checkList = []

  console.log({ authority, projects })
  let checkListItem = document.querySelectorAll('.form-check-input:checked')
  checkListItem.forEach(check => {
    checkList.push(check.value)
  })

  const body = {
    positionName,
    checkList,
    id,
    projectManage: {
      projects,
      authority
    }
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