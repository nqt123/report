const content = document.querySelector('#role-group').innerHTML
document.querySelector('#back').addEventListener('click', (e) => {
  location.hash = 'users'
})

document.querySelector('#update').addEventListener('click', (e) => {
  e.preventDefault()
  const positionName = document.querySelector('#positionName').value
  const id = document.querySelector('#id').value.trim()
  const projects = document.querySelectorAll('#projects')
  const authorities = document.querySelectorAll('#authority')
  const checkList = []
  const projectManage = []

  projects.forEach((project, i) => {
    projectManage.push({
      projects: project.value,
      authority: authorities[i].value
    })
  })

  let checkListItem = document.querySelectorAll('.form-check-input:checked')
  checkListItem.forEach(check => {
    checkList.push(check.value)
  })

  const body = {
    positionName,
    checkList,
    id,
    projectManage
  }
  fetch('/user-account/' + id, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(res => res.json()).then(respond => location.hash = "users")
})
document.querySelector('#addProjects').addEventListener('click', (e) => {
  console.log('clicked')
})

function addProject() {
  document.querySelector('#role-group').insertAdjacentHTML('beforeend', content)
}

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);