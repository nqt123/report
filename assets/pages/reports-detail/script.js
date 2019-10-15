console.log('loaded')

const $reject = document.querySelector('#reject')
const $resolve = document.querySelector('#resolve')
const reportId = document.querySelector('#id').value

$reject.addEventListener('click', (e) => {
  e.preventDefault()
  swal({
    title: "Nội dung",
    text: "Hãy nhập lí do của vấn đề",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    inputPlaceholder: "Write something"
  }, function (inputValue) {
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("Hãy nhập lý do", "", "success");
      return false
    }
    const state = {
      updateState: "Undone",
      reason : inputValue
    }
 
    fetch('/reports/' + reportId, {
      method: "PUT",
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.text()).then(response => location.hash = "reports")
    swal("Phản hồi thành công","","success");
  });

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