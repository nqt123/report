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
    inputPlaceholder: "Lí do không hoàn thành"
  }, function (inputValue) {
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("Hãy nhập lý do", "", "success");
      return false
    }
    const state = {
      updateState: "Undone",
      reason: inputValue
    }

    fetch('/reports/' + reportId, {
      method: "PUT",
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.text()).then(response => location.hash = "reports")
    swal("Phản hồi thành công", "", "success");
  });

})
$resolve.addEventListener('click', (e) => {
  e.preventDefault()
  const state = {
    updateState: "Done"
  }
  swal({
    title: "Nội dung phản hồi",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    inputPlaceholder: "Nhập nội dung phản hồi (Không bắt buộc)"
  }, function (inputValue) {
    const state = {
      updateState: "Done",
      reason: inputValue
    }
    if (inputValue === "") {
      delete state.value
    }
    fetch('/reports/' + reportId, {
      method: "PUT",
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.text()).then(response => location.hash = "reports")
    swal("Phản hồi thành công", "", "success");
  });
})