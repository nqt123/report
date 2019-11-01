

document.querySelector('#back').addEventListener('click', (e) => {
  location.hash = 'sla'
})

document.querySelector('#update').addEventListener('click', (e) => {
  e.preventDefault()
  const id = document.querySelector('#id').value
  const name = document.querySelector('#name').value
  const processTime = document.querySelector('#processTime').value
  const note = document.querySelector('#note').value

  const body = {
    id, name, processTime, note
  }
  if(isNaN(processTime)){
    return swal("SLA phải là số nguyên (phút)")
  }
  fetch('/sla/' + id, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(res => res.json()).then(respond => location.hash = 'sla')
})
var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);