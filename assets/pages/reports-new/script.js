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
const $sla = document.querySelector('#sla')
const $priorValue = document.querySelector('#priorValue')
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
  const typeDisplay = reportList.options[document.querySelector('#report-description').selectedIndex].text

  let percentOfInfluence = 0
  if (parseInt(agentNumberInShift) < parseInt(agentNumberInfluence)) {
    return textMessage.textContent = "Số lượng nhân sự trong ca phải lớn hơn số lượng nhận sự ảnh hưởng"
  }
  else {
    percentOfInfluence = agentNumberInShift == 0 || agentNumberInShift == "" ? 1 : (agentNumberInfluence / agentNumberInShift).toFixed(3)
  }
  if (name == "" || agentNumberInShift == "" || type == -1 || agentNumberInfluence == "" || title == "" || description == "") {
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
    $sla.value = convertMinutes(respond[0].processTime)
  })
})

reportList.addEventListener('change', (e) => {
  $sla.value = convertMinutes(reportList.value)
})
$agentNumberInfluence.addEventListener('change', (e) => {
  $priorValue.value = priorCalculator()
})
$agentNumberInShift.addEventListener('change', (e) => {
  $priorValue.value = priorCalculator()
})
const priorCalculator = () => {
  let result;
  if ($agentNumberInShift.value == 0 || $agentNumberInShift.value == "") {
    return result = "N/A"
  }
  else {
    result = $agentNumberInfluence.value / $agentNumberInShift.value
  }
  if (result <= 0.2) {
    result = "Mức 1 - Hỗ trợ"
  }
  if (result > 0.2 && result <= 0.4) {
    result = "Mức 2 - Trung bình"
  }
  if (result > 0.4 && result <= 0.6) {
    result = "Mức 3 - Cao"
  }
  if (result > 0.6 && result <= 0.8) {
    result = "Mức 4 - Nghiêm trọng"
  }
  if (result > 0.8) {
    result = "Mức 5 - Cực kì nghiêm trọng"
  }
  return result
}
const convertMinutes = (value) => {
  let slaTime = 0;
  if (!value || value == "0") {
    slaTime = "N/A"
  }
  else if (value <= 60) {
    slaTime = value + " phút"
  }
  else if (value > 60 && value <= 24 * 60) {
    slaTime = value / 60 + " giờ" + value % 60 + " phút"
  }
  else {
    slaTime = value / (60 * 24) + " ngày " + (value % 1440) / 60 + " giờ " + value % 60 + " phút"
  }
  return slaTime
}
const changeSLA = (sla) => {
  console.log(sla)
}
var DFT = function ($) {
  return {
    init: function () {

    }
  }
}(jQuery);
