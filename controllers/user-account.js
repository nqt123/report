const User = require('../modals/users')
const SupportEmail = require('../modals/support-email')

exports.edit = function (req, res) {
  User.findById(req.params["useraccount"]).then(user => {
    console.log(req.params)
    SupportEmail.find({}).then(supportEmails => {
      _.render(req, res, 'user-account-edit', {
        title: 'Cập nhật thông tin User',
        User: user,
        supportEmails
      }, true)
    })
  })
}
//name, processTime, note
exports.update = function (req, res) {
  User.findById(req.body.id).then(user => {
    user.positionName = req.body.positionName

    user.groupEmail = []
    req.body.checkList.forEach((pos, i) => {
      user.groupEmail.push(pos)
    })

    user.save().then(result => {
      res.send(result)
    })
  })
}