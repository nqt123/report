const refreshBtn = document.querySelector('#refreshBtn')
const itemList = document.querySelectorAll('#item')
const buttonSearch = document.querySelector('#btn-search')
//Refresh Button Event
refreshBtn.addEventListener('click', (e) => {
  console.log(itemList.length)
  e.preventDefault()
  _.LoadPage(window.location.hash);
})
//New Report Route and Scroll Top
for (let i = 0; i < itemList.length; i++) {
  itemList[i].querySelector('#detail').addEventListener('click', function (e) {
    const id = itemList[i].querySelector('td#id').textContent.trim()
    location.hash = 'reports' + '/' + id
    window.scrollTo({ top: 25, behavior: 'smooth' })
  })
}

const $searchButtons = document.querySelectorAll('.searchColumn')
for (let i = 0; i < $searchButtons.length; i++) {
  $searchButtons[i].addEventListener('click', (e) => {
    e.preventDefault()
    console.log('Clicked')
  })
}
//Binding Search Button
buttonSearch.addEventListener('click', (e) => {
  const searchTerm = {}
  const searchColumns = document.querySelectorAll('.searchColumn')
  for (let i = 0; i < searchColumns.length; i++) {
    searchTerm[searchColumns[i].attributes.name.value] = searchColumns[i].value
  }
  console.log(searchTerm)
})

document.querySelector('body').addEventListener('keyup', (e) => {
  if (event.keyCode === 13) {
    e.preventDefault()
    buttonSearch.click()
  }
})

/**
 * Created by LINHNV
 */

var DFT = function ($) {
  return {
    init: function () {
    }
  }
}(jQuery);