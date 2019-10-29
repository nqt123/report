console.log('Loa123ded')

const rows = document.querySelectorAll('tr#item')

for (let i = 0; i < rows.length; i++) {
  const updateBtn = rows[i].querySelector('#update')
  const id = rows[i].querySelector('#id').innerHTML.trim()
  updateBtn.addEventListener('click', (e) => {
    location.hash = 'sla/' + id +'/edit'
  })
}

for (let i = 0; i < rows.length; i++) {
  const deleteIcon = rows[i].querySelector('#delete')
  deleteIcon.addEventListener('click', function (e) {
    swal({
      title: `Xác nhận xoá?`,
      text: "Sau khi xoá yêu cầu sẽ không thể phục hồi",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      closeOnConfirm: true,
      closeOnCancel: true,
    },
      function (isConfirm) {
        if (isConfirm) {
          const id = rows[i].querySelector('#id').innerHTML.trim()
          fetch('/sla/' + id, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
              'Content-type': 'application/json'
            }
            // }).then(res => res.json()).then(response => _.LoadPage(window.location.hash))
          }).then(res => res.json()).then(response => {
            _.LoadPage(location.hash)
          })
        }
      }
    );
  })
}
