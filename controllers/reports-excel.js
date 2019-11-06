const Report = require('../modals/report')
const nodeMailer = require('nodemailer')
const SupportManager = require('../modals/support-manager')
const SlaMenu = require('../modals/sla-menu')
const SlaList = require('../modals/sla-list')
const SupportEmail = require('../modals/support-email')
const User = require('../modals/users')
const mongoose = require('mongoose')
const ProjectAdmin = require('../modals/projects-admin')
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
    let query = {};
    var agg = Report.aggregate();
    ///find CreatedBy
    console.log(req.query);

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
      if (_.has(req.query, 'createdAt')) {
        query.createdAt = moment(req.query.createdAt, "DD/MM/YYYY h:mm a")._d;
      }
      if (_.has(req.query, 'lastRespondAt')) {
        query.lastRespondAt = moment(req.query.lastRespondAt, "DD/MM/YYYY h:mm a")._d;
      }
      console.log(query);
      if (!_.isEmpty(query)) agg._pipeline.push({
        $match: {
          $or: [
            { createdAt: { "$gt": query.createdAt } },
            { lastRespondAt: { "$lt": query.lastRespondAt } }
          ]
        }
      });
      //Apply match with field generated
      agg._pipeline.push({ $match: matchField })
      Report.aggregatePaginate(agg, { page, limit, $unwind: "$createdBy", $match: createdBy, $match: supporter }, function (err, reports, node, count) {
        if (err)
          return res.send(err)
        var paginator = new pagination.SearchPaginator({
          prelink: '/reports-excel',
          current: page,
          rowsPerPage: limit,
          totalResult: count
        })
        return _.render(req, res, 'reports-excel', {
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

};

exports.new = function (req, res) {
  _.render(req, res, 'reports-new', {
    title: 'Thêm mới Yêu cầu',
    result,
    listSla: list
  }, true)
}

exports.update = function (req, res) {
}
exports.show = function (req, res) {
  _.render(req, res, 'reports-detail', {
    title: "",
    report: result[0].report,
    result: result[0]
  }, true)
}

exports.destroy = function (req, res) {
  Report.findByIdAndRemove(req.body.id, function (error, Report) {
    if (error)
      return res.json(error)
    res.json(Report)
  })
}