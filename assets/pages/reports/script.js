const refreshBtn = document.querySelector('#refreshBtn')
const itemList = document.querySelectorAll('#item')



console.log('loaded')

refreshBtn.addEventListener('click', (e) => {
  console.log(itemList.length)
  e.preventDefault()
  // location.reload(true)
})
for (let i = 0; i < itemList.length; i++) {
  itemList[i].querySelector('#detail').addEventListener('click', function (e) {
    const id = itemList[i].querySelector('td#id').textContent.trim()
    location.hash = 'reports' + '/' + id
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}