const User = require('../modals/users')
const SupportEmail = require('../modals/support-email')
const ProjectAdmin = require('../modals/projects-admin')
const mongoose = require('mongoose')

exports.index = function (req, res) {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  let maxAuthorize = "REPORTER"
  var agg = User.aggregate();
  User.findById(req.session['user']._id).then(user => {
    const userId = user._id
    const groupEmail = (user.groupEmail)
    const emailQuery = []
    //find for projects
    if (user.projectManage.length > 0) {
      for (let i = 0; i < user.projectManage.length; i++) {
        emailQuery.push({ "projectManage.projects": mongoose.mongo.ObjectId(user.projectManage[i].projects) })
        if (user.projectManage[i].authority == "SUPERVISOR" ||
          user.projectManage[i].authority == "ADMINISTRATOR" ||
          user.projectManage[i].authority == "DEVELOPER"
        ) {
          if (user.projectManage[i].authority != "SUPERVISOR")
            maxAuthorize = "ADMINISTRATOR"
          emailQuery.push({})
        }
      }
    }
    agg._pipeline.push({
      $match: {
        $or: emailQuery
      }
    })

    User.aggregatePaginate(agg, { page, limit }, function (err, result, node, count) {
      var paginator = new pagination.SearchPaginator({
        prelink: '/user-account',
        current: page,
        rowsPerPage: limit,
        totalResult: count
      })
      _.render(req, res, 'user-account', {
        title: 'Danh sách thông tin User',
        paging: paginator.getPaginationData(),
        myUser: result,
        maxAuthorize,
      }, true)
    })
  })

}

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