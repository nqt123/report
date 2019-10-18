console.log("Loaded 123123")
const $form = document.querySelector('#form-create-report')
const $name = document.querySelector('#name')
const $position = document.querySelector('#position')
const $CRM = document.querySelector('#CRM')
const $type = document.querySelector('#type')
const $title = document.querySelector('#title')
const $description = document.querySelector('#description')
const $agentNumberInShift = document.querySelector('#agentNumberInShift')
const $agentNumberInfluence = document.querySelector('#agentNumberInfluence')
const textMessage = document.querySelector('#warning-message')
const button = document.querySelector('#submitBtn')
const processTime = document.querySelector('#processTime')
const $typeDisplay = document.querySelector('#typeDisplay')
const reportList = document.querySelector('#report-description')

$form.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = $name.value
  const position = $position.value
  const CRM = $CRM.value
  const type = $type.value
  const title = $title.value
  const description = $description.value
  const agentNumberInShift = $agentNumberInShift.value
  const agentNumberInfluence = $agentNumberInfluence.value
  const processTime = parseInt(reportList.value)
  const typeDisplay = $type.options[document.querySelector('#type').selectedIndex].text

  let percentOfInfluence = 0
  if (parseInt(agentNumberInShift) < parseInt(agentNumberInfluence)) {
    return textMessage.textContent = "Số lượng nhân sự trong ca phải lớn hơn số lượng nhận sự ảnh hưởng"
  }
  else {
    percentOfInfluence = agentNumberInShift == 0 || agentNumberInShift == "" ? 1 : (agentNumberInfluence / agentNumberInShift).toFixed(3)
  }
  if (name == "" || agentNumberInShift == "" || agentNumberInfluence == "") {
    return textMessage.textContent = "Vui lòng nhập các trường bắt buộc"
  }
  else {
    button.disabled = true
    textMessage.textContent = ""
    const report = {
      name,
      position,
      CRM,
      processTime,
      type,
      typeDisplay,
      title,
      description,
      agentNumberInShift,
      agentNumberInfluence,
      percentOfInfluence
    }
    console.log(report)
    fetch('/reports',
      {
        method: "POST",
        body: JSON.stringify(report),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).then(res => res.json()).then(respond => window.location.hash = 'reports')
  }
})

$type.addEventListener('change', (e) => {
  const select = document.querySelector('#report-description')
  select.disabled = true
  fetch('/reports/new?type=' + $type.value,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  ).then(res => res.json()).then(respond => {
    select.disabled = false
    select.options.length = 0

    for (let i = 0; i < respond.length; i++) {
      var opt = document.createElement('option')
      opt.appendChild(document.createTextNode(respond[i].name))
      opt.value = respond[i].processTime

      select.appendChild(opt)
    }
  })
})

var DFT = function ($) {
  return {
    init: function () {

    }
  }
}(jQuery);
