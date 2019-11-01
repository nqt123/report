
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
const $submitBtn = document.querySelector('#submitBtn')
const $selectModal = document.querySelector('#selectEmail')
const $createReport = document.querySelector('#createReport')
const $SupportEmail = document.querySelector('#SupportEmail')
const $UserEmail = document.querySelector('#UserEmail')
const $backBtn = document.querySelector('#backBtn')
const $emails = document.getElementsByName('email')

var userList = []
var supportList = []
$submitBtn.addEventListener('click', (e) => {
  $SupportEmail.innerHTML = ""
  $UserEmail.innerHTML = ""
  e.preventDefault()
  const name = $name.value
  const type = $type.value
  const title = $title.value
  const description = $description.value
  const agentNumberInShift = $agentNumberInShift.value
  const agentNumberInfluence = $agentNumberInfluence.value
  if (parseInt(agentNumberInShift) < parseInt(agentNumberInfluence)) {
    $selectModal.id = "None"
    window.scrollTo({ top: 25, behavior: 'smooth' })
    return textMessage.textContent = "Số lượng nhân sự trong ca phải lớn hơn số lượng nhận sự ảnh hưởng"
  }
  if (name == "" || agentNumberInShift == "" || type == -1 || agentNumberInfluence == "" || title == "" || description == "") {
    $selectModal.id = "None"
    window.scrollTo({ top: 25, behavior: 'smooth' })
    return textMessage.textContent = "Vui lòng nhập các trường bắt buộc"
  }
  else {
    $selectModal.id = "selectEmail"
  }
  fetch('/reports/new?email=' + true,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(res => res.json()).then(respond => {
    userList = respond.userEmail
    supportList = respond.supportEmail.email

    respond.supportEmail.forEach(email => {
      $SupportEmail.insertAdjacentHTML('beforeend',
        `
        <div class="form-check">
        <input class="form-check-input" name="email" type="checkbox" value="${email.email}">
        <label class="form-check-label" for="defaultCheck2">
          ${email.email}<br> (${email.name})
       </label>
      </div>
      `)
    })
    respond.userEmail.forEach(email => {
      $UserEmail.insertAdjacentHTML('beforeend',
        `
      <div class="form-check">
        <input class="form-check-input" name="email" type="checkbox" value="${email.email}">
        <label class="form-check-label" for="defaultCheck2">
          ${email.email}<br> (${email.displayName})
       </label>
      </div>
      `)
    })
  })
})
createReport.addEventListener('click', (e) => {
  e.preventDefault()
  const emailList = []
  const checkedValue = document.querySelectorAll('.form-check-input:checked')
  for (let i = 0; i < checkedValue.length; i++) {
    emailList.push(checkedValue[i].value)
  }
  const name = $name.value
  const position = $position.value
  const CRM = $CRM.value
  const displayName = $name.options[$name.selectedIndex].text
  const type = $type.value
  const title = $title.value
  const description = $description.value
  const agentNumberInShift = $agentNumberInShift.value
  const agentNumberInfluence = $agentNumberInfluence.value
  const processTime = parseInt(reportList.value)
  const typeDisplay = reportList.options[document.querySelector('#report-description').selectedIndex].text
  let percentOfInfluence = (parseInt(agentNumberInfluence) / parseInt(agentNumberInShift)).toFixed(2)
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
    percentOfInfluence,
    emailList,
    displayName
  }

  fetch('/reports',
    {
      method: "POST",
      body: JSON.stringify(report),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    // ).then(res => res.json()).then(respond => location.hash = 'reports')
  ).then(res => res.json()).then(respond => {
    swal("Gửi yêu cầu thành công", "", "success");
    setTimeout(() => {
      $backBtn.click()
    }, 200);
  })
})

$type.addEventListener('change', (e) => {
  const select = document.querySelector('#report-description')
  select.disabled = true
  fetch('/reports/new?type=' + $type.value,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
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
$name.addEventListener('change', (e) => {
  const id = $name.value

  fetch('reports/new?id=' + id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(respond => {
    const project = respond[0]
    $position.value = project.position
    $CRM.value = project.usingCRM
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
function updateResult(query) {
  let resultList = document.querySelector("#UserEmail");
  resultList.innerHTML = "";
  userList.map((user) => user.email).map(function (email, index) {
    query.split(" ").map(function (word) {
      if (email.toLowerCase().indexOf(word.toLowerCase()) != -1) {
        resultList.innerHTML += `      <div class="form-check">
        <input class="form-check-input" name="email" type="checkbox" value="${email}">
        <label class="form-check-label" for="defaultCheck2">
        ${userList[index].email}<br> (${userList[index].displayName})
       </label>
      </div>`;
      }
    })
  })
}
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
    slaTime = (value / 60).toFixed() + " giờ " + value % 60 + " phút"
  }
  else {
    slaTime = (value / (60 * 24)).toFixed() + " ngày " + (value % 1440) / 60 + " giờ " + value % 60 + " phút"
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
