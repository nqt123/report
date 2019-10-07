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

$form.addEventListener('submit', (e) => {
  e.preventDefault()
  button.disabled = true
  const name = $name.value
  const position = $position.value
  const CRM = $CRM.value
  const type = $type.value
  const title = $title.value
  const description = $description.value
  const agentNumberInShift = $agentNumberInShift.value
  const agentNumberInfluence = $agentNumberInfluence.value
  let percentOfInfluence = 0
  if (parseInt(agentNumberInShift) < parseInt(agentNumberInfluence)) {
    return textMessage.textContent = "Số lượng nhân sự trong ca phải lớn hơn số lượng nhận sự ảnh hưởng"
  }
  else {
    percentOfInfluence = agentNumberInShift == 0 || agentNumberInShift == "" ? 1 : (agentNumberInfluence / agentNumberInShift).toFixed(3)
  }
  if (name == "" || title == "" || description == "" || agentNumberInShift == "" || agentNumberInfluence == "") {
    return textMessage.textContent = "Vui lòng nhập các trường bắt buộc"
  }
  else {
    textMessage.textContent = ""
    const report = {
      name,
      position,
      CRM,
      type,
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
