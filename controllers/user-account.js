const User = require('../modals/users')
const SupportEmail = require('../modals/support-email')
const ProjectAdmin = require('../modals/projectsAdmin')
const mongoose = require('mongoose')
exports.edit = function (req, res) {
  User.findById(req.params['useraccount']).then(user => {
    SupportEmail.find({}).then(supportEmails => {
      ProjectAdmin.find({}).then(projects => {
        _.render(req, res, 'user-account-edit', {
          title: 'Cập nhật thông tin User',
          User: user,
          projects,
          supportEmails
        }, true)
      })
    })
  })
}
//name, processTime, note
exports.update = function (req, res) {
  User.findById(req.body.id).then(user => {
    user.positionName = req.body.positionName
    user.groupEmail = []
    user.projectManage = []
    user.projectManage = req.body.projectManage
    req.body.checkList.forEach((pos, i) => {
      user.groupEmail.push(pos)
    })
    user.save(function (err) {
      if (err)
        return console.log(err)
    }).then(result => {
      res.send(result)
    })
  })
}