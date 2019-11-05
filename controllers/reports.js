const Report = require('../modals/report')
const nodeMailer = require('nodemailer')
const SupportManager = require('../modals/support-manager')
const SlaMenu = require('../modals/sla-menu')
const SlaList = require('../modals/sla-list')
const SupportEmail = require('../modals/support-email')
const User = require('../modals/users')
const mongoose = require('mongoose')
const ProjectAdmin = require('../modals/projectsAdmin')
exports.index = {
  json: function (req, res) {
    Report.find({}, function (err, reports) {
      if (err)
        return res.send(err)
      return res.send(reports)
    })
  },
  html: function (req, res) {
    const page = req.query.page ? req.query.page : 1
    const limit = req.query.row ? req.query.row : 10
    ///generate search field
    let matchField = {}
    let createdBy = {}
    let supporter = {}
    var agg = Report.aggregate();
    ///find CreatedBy

    const userId = req.session['user']._id

    const user = User.findById(userId).then(user => {
      const groupEmail = (user.groupEmail)
      const emailQuery = []
      //find report for each group email
      const emailInsert = groupEmail.forEach(email => {
        emailQuery.push({ "for": mongoose.mongo.ObjectId(email) })
      });
      //find for each user Id
      emailQuery.push({ "for": mongoose.mongo.ObjectId(userId) })
      //find for projects
      if (user.projectManage.length > 0) {
        for (let i = 0; i < user.projectManage.length; i++) {
          emailQuery.push({ "name": mongoose.mongo.ObjectId(user.projectManage[i].projects) })
          if (user.projectManage[i].authority == "SUPERVISOR" ||
            user.projectManage[i].authority == "ADMINISTRATOR" ||
            user.projectManage[i].authority == "DEVELOPER"
          ) {
            emailQuery.push({})
          }
        }
      }
      agg._pipeline.push({
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator"
        }
      }, {
        $unwind: "$creator"
      })
      agg._pipeline.push({
        $match: {
          $or: emailQuery
        }
      })
      //Sorting
      if (!req.query.sort) {
        agg._pipeline.push({ $sort: { updatedAt: -1 } })
      }
      //Searching
      if (req.query.supporter) {
        matchField["supporter.name"] = req.query.supporter
      }
      if (req.query.name) {
        matchField["name"] = { $regex: new RegExp(req.query.name, 'gi') }
      }
      if (req.query.status) {
        matchField["status"] = { $regex: new RegExp(req.query.status, 'gi') }
      }
      if (req.query.state) {
        matchField["state"] = req.query.state
      }
      // matchField["createdBy"] = { $regex: new RegExp(req.query.createdBy, 'gi') }
      if (req.query.title) {
        matchField["title"] = { $regex: new RegExp(req.query.title, 'gi') }
      }

      if (req.query.createdBy) {
        agg._pipeline.push({ $match: { "creator.displayName": { $regex: new RegExp(req.query.createdBy, 'gi') } } })
      }

      //Apply match with field generated
      agg._pipeline.push({ $match: matchField })
      Report.aggregatePaginate(agg, { page, limit, $unwind: "$createdBy", $match: createdBy, $match: supporter }, function (err, reports, node, count) {
        if (err)
          return res.send(err)
        var paginator = new pagination.SearchPaginator({
          prelink: '/reports',
          current: page,
          rowsPerPage: limit,
          totalResult: count
        })
        return _.render(req, res, 'reports', {
          title: 'Danh sách các Yêu cầu',
          result: reports,
          paging: paginator.getPaginationData(),
          plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
        }, true, err);
      })
    })
  }
};

// POST
exports.create = function (req, res) {
  const report = new Report(req.body)
  report.createdBy = req.session.user._id
  report.for.push(req.session.user._id)
  const maxUniqueId = Report.find({}).sort({ uniqueId: -1 }).limit(1).then(maxResult => {
    if (maxResult.length != 0) {
      report.uniqueId = parseInt(maxResult[0].uniqueId) + 1
    } else {
      report.uniqueId = 0
    }

    if (report.percentOfInfluence <= 0.2) {
      report.prior = 1
    }
    if (report.percentOfInfluence > 0.2 && report.percentOfInfluence <= 0.4) {
      report.prior = 2
    }
    if (report.percentOfInfluence > 0.4 && report.percentOfInfluence <= 0.6) {
      report.prior = 3
    }
    if (report.percentOfInfluence > 0.6 && report.percentOfInfluence <= 0.8) {
      report.prior = 4
    }
    if (report.percentOfInfluence > 0.8) {
      report.prior = 5
    }

    report.save().then(result => {
      var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hoasaorequester@gmail.com',
          pass: 'Nqt123abc123'
        }
      })
      var mailOptions = {
        from: '"Hoa Sao Agent" <noreply@hoasao.vn>',
        to: req.body.emailList,
        subject: 'New Support Request From Agent',
        html: `<div style="display: inline-block;background-color: #fefefe; height: 50px;line-height: 50px;"><span style="color:#ff375f;">Y</span><span style="color:#ff4b4c;">ê</span><span style="color:#ff6039;">u</span><span style="color:#ff7426;"> </span><span style="color:#ff8913;">C</span><span style="color:#ff9d00;">ầ</span><span style="color:#ffa802;">u</span><span style="color:#ffb404;"> </span><span style="color:#ffbf06;">M</span><span style="color:#ffcb08;">ớ</span><span style="color:#ffd60a;">i</span><span style="color:#cbd51e;"> </span><span style="color:#98d431;">T</span><span style="color:#64d245;">ừ</span><span style="color:#30d158;"> </span><span style="color:#26da79;">K</span><span style="color:#1de39b;">h</span><span style="color:#13edbc;">ố</span><span style="color:#0af6de;">i</span><span style="color:#00ffff;"> </span><span style="color:#02e6ff;">D</span><span style="color:#04ceff;">ự</span><span style="color:#06b5ff;"> </span><span style="color:#089dff;">Á</span><span style="color:#0a84ff;">n</span></div>
               <div><span style="font-weight: bold; color: black;">Dự án:</span> ${result.name}</div>
               <div><span style="font-weight: bold; color: black;">Vị trí:</span> ${result.position}</div>
               <div><span style="font-weight: bold; color: black;">Số lượng nhận sự trong ca:</span> ${result.agentNumberInShift}</div>
               <div><span style="font-weight: bold; color: black;">Số lượng nhận sự ảnh hưởng:</span> ${result.agentNumberInfluence}</div>
               <div><span style="font-weight: bold; color: black;">Độ ảnh hưởng:</span> ${result.prior}</div>
               <div><span style="font-weight: bold; color: black;">Loại:</span> ${result.typeDisplay}</div>
               <div><span style="font-weight: bold; color: black;">Tiêu đề:</span> ${result.title}</div>
               <div><span style="font-weight: bold; color: black;">Mô tả:</span> ${result.description}</div>
        `
      }
      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
      })
      res.send(result)
    })
  })

};

exports.new = function (req, res) {
  const projectQuery = []
  console.log('123123')
  const user = User.findById(req.session['user']._id).then(user => {
    if (user.projectManage.length == 0) {
      return _.render(req, res, '../500.ejs', {
        message: "Người dùng này chưa được thêm vào dự án"
      }, true)
    }

    for (let i = 0; i < user.projectManage.length; i++) {
      if (user.projectManage[i].authority == "SUPERVISOR" ||
        user.projectManage[i].authority == "DEVELOPER" ||
        user.projectManage[i].authority == "ADMINISTRATOR") {
        projectQuery.push({})
      }
      projectQuery.push({
        "_id": mongoose.mongo.ObjectId(user.projectManage[i].projects)
      })
    }
    const company = ProjectAdmin.find({ $or: projectQuery }).then(result => {
      SlaMenu.find({}).sort({ displayName: 1 }).then(list => {
        if (req.query.email) {
          let supportEmail;
          SupportEmail.find({}).then(result => {
            supportEmail = result
          })
          return User.find({}).then(result => {
            res.send({
              supportEmail,
              userEmail: result
            })
          })
        }
        if (req.query.id) {
          return ProjectAdmin.find({ _id: req.query.id }).then(project => {
            return res.send(project)
          })
        }
        if (req.query.type) {
          const result = SlaList.aggregate([
            {
              $lookup: {
                from: "slamenus",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            {
              $unwind: "$category"
            },
            {
              $match: {
                "category.name": req.query.type
              }
            }
          ], (err, result) => {
            if (err)
              return console.log(err)
            return res.json(result)
          })
        }
        else {
          _.render(req, res, 'reports-new', {
            title: 'Thêm mới Yêu cầu',
            result,
            listSla: list
          }, true)
        }
      })
    })
  })
};

exports.update = function (req, res) {
  const report = Report.findById(req.params.report).then(report => {
    if (req.body.updateState) {
      report.status = req.body.updateState == "Undone" ? 3 : 4
      report.state = req.body.updateState
      report.endAt = report.lastRespondAt
    }
    if (req.body.reason) {
      report.reason = req.body.reason
      report.seen = false
    }
    report.save().then(result => {
      var transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hoasaorequester@gmail.com',
          pass: 'Nqt123abc123'
        }
      })
      var mailOptions = {
        from: '"Hoa Sao Agent" <noreply@hoasao.vn>',
        to: 'hoanghaivo98@gmail.com',
        subject: '',
        html: ``
      }
      if (result.state == "Done") {
        mailOptions.html = `<h2 style="color : green">Khiếu nại giải quyết vấn đề của khách hàng đã được xác nhận hoàn thành</h2>`
        mailOptions.subject = 'Report Issue Has Been Confirmed'
      }
      if (result.state == "Undone") {
        mailOptions.html = `<h2 style="color : red">Khách hàng báo cáo lại rằng chưa giải quyết xong vấn đề</h2>`
        mailOptions.subject = 'Report Issue HASNT Been Confirmed Open Mail to See Detail'
      }
      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          return res.send(err)
      })
      res.send(result)
    })
  })
}
exports.show = function (req, res) {
  const match = {}
  SupportManager.aggregate([
    {
      $lookup:
      {
        from: "reports",
        localField: "name",
        foreignField: "_id",
        as: "projectsAdmin"
      }
    },
    {
      $lookup:
      {
        from: "reports",
        localField: "reportId",
        foreignField: "_id",
        as: "report"
      }
    },
    {
      $unwind: "$report"
    },
    {
      $match: { "report._id": mongoose.Types.ObjectId(req.params.report) }
    },
    {
      $sort: { createdAt: -1 }
    }
  ], function (err, result) {
    if (!result[0]) {
      return Report.findById(req.params.report).then(result => {
        _.render(req, res, 'reports-detail', {
          title: "",
          report: result,
          result: {}
        }, true)
      })
    }
    console.log(result)
    _.render(req, res, 'reports-detail', {
      title: "",
      report: result[0].report,
      result: result[0]
    }, true)
  })
}
exports.destroy = function (req, res) {
  Report.findByIdAndRemove(req.body.id, function (error, Report) {
    if (error)
      return res.json(error)
    res.json(Report)
  })
}