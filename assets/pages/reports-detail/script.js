console.log('loaded')

const $reject = document.querySelector('#reject')
const $resolve = document.querySelector('#resolve')
const reportId = document.querySelector('#id').value

$reject.addEventListener('click', (e) => {
  e.preventDefault()
  const state = {
    updateState: "Undone"
  }
  console.log('/reports/' + reportId)
  fetch('/reports/' + reportId, {
    method: "PUT",
    body: JSON.stringify(state),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.text()).then(response => location.hash = "reports")
})
$resolve.addEventListener('click', (e) => {
  e.preventDefault()
  const state = {
    updateState: "Done"
  }
  console.log('/reports/' + reportId)
  fetch('/reports/' + reportId, {
    method: "PUT",
    body: JSON.stringify(state),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.text()).then(response => location.hash = "reports")
})