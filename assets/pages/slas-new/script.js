console.log('Loaded')
const $form = document.querySelector('#create-form')
$form.addEventListener('submit', (e) => {
  e.preventDefault()

  const category = document.querySelector('#category').value
  const name = document.querySelector('#name').value
  const processTime = document.querySelector('#processTime').value
  const note = document.querySelector('#note').value

  const body = {
    category,
    name,
    processTime,
    note
  }

  fetch('/sla',
    {
      method: "POST",
      body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  ).then(res => res.text()).then(respond => location.hash= "#sla")
})
document.querySelector('#back').addEventListener('click', (e)=>{
  location.hash = 'sla'
})