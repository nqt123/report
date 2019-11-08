const content = document.querySelector('#new').innerHTML
document.querySelector('#new').remove()
document.querySelector('#back').addEventListener('click', (e) => {
  location.hash = 'users'
})

let items = document.querySelectorAll("#item")

items.forEach((item, i) => {
  item.querySelector('#remove').addEventListener('click', (e) => {
    item.remove()
  })
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
  console.log(body)
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
  items = document.querySelectorAll("#item")
  items.forEach((item, i) => {
    item.querySelector('#remove').addEventListener('click', (e) => {
      item.remove()
    })
  })
}

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);