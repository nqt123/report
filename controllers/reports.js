const Report = require('../modals/report')
const nodeMailer = require('nodemailer')
const Company = require('../modals/company')
const SupportManager = require('../modals/support-manager')
const mongoose = require('mongoose')
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
    //Sorting
    if (!req.query.sort) {
      agg._pipeline.push({ $sort: { createdAt: -1 } })
    }
    //Searching
    if (req.query.name) {
      matchField["name"] = { $regex: new RegExp(req.query.name, 'gi') }
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
    // aggUser._pipeline.push({ $match: supporter })
    Report.aggregatePaginate(agg, { page, limit, $unwind: "$createdBy", $match: createdBy, $match: supporter }, function (err, reports, node, count) {
      if (err)
        return res.send(err)
      console.log(reports)
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
  }
};

// POST
exports.create = function (req, res) {
  const report = new Report(req.body)
  report.createdBy = req.session.user._id

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
      to: 'quythang1997@gmail.com',
      subject: 'New Support Request From Agent',
      html: `<p style="font-size:30px;">YÊU CẦU CẦN XỬ LÝ MỚI</p>
             <table>
              <tr>
                <td style="font-size : 15px; font-weight: bold; color: blue;">Tên dự án :</td>
                <td>${result.name}</td>
              </tr>
              <tr>
               <td style="font-size : 15px; font-weight: bold; color: blue;">Vị trí :</td>
                <td>${result.position}</td>
              </tr>
              <tr>
               <td style="font-size : 15px; font-weight: bold; color: blue;">Tiêu đề :</td>
                <td>${result.title}</td>
              </tr>
              <tr>
               <td style="font-size : 15px; font-weight: bold; color: blue;">Mô tả :</td>
                <td>${result.description}</td>
              </tr>
              <tr>
               <td style="font-size : 15px; font-weight: bold; color: blue;">Độ ưu tiên :</td>
                <td>${result.prior}</td>
              </tr>
             </table>
      `
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        return res.send(err)
    })
    res.send(result)
  })
};

exports.new = function (req, res) {
  const company = Company.find({}).then(result =>
    _.render(req, res, 'reports-new', {
      title: 'Thêm mới Yêu cầu',
      result
    }, true)
  )
};

exports.update = function (req, res) {
  const report = Report.findById(req.params.report).then(report => {
    console.log(req.body)
    if (req.body.updateState) {
      report.state = req.body.updateState
      if (req.body.updateState == "Undone") {
        report.status = 0
      }
    }
    if(req.body.reason){
      report.reason = req.body.reason
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
        to: 'quythang1997@gmail.com',
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
  console.log(req.params.report)
  SupportManager.aggregate([
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