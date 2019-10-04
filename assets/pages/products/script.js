//Delete
const clickBtn = document.querySelectorAll('#delete')
for (let i = 0; i < clickBtn.length; i++) {
    clickBtn[i].addEventListener('click', function (e) {
        e.preventDefault()
        const id = $(this).data('value')
        fetch('/products/' + id, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => res.json()).then(response => window.location.href = '/#products')
    })
}

//SearchForm