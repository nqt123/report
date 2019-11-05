const nodeMailer = require("nodemailer");
const User = require('../modals/users')
exports.index = {
  json: function (req, res) {
    _SupportManager.find({}, function (err, support) {
      if (err)
        return res.send(err)
      return res.send(support);
    })
  },
  html: function (req, res) {
    const page = req.query.page ? req.query.page : 1
    const limit = req.query.row ? req.query.row : 10
    let query = {};
    let sort = _.cleanSort(req.query, '');
    _async.parallel({
      lists: function (next) {
        _SlaList.find({}, next);
      }
    }, function (error, result) {

      User.findById(req.session['user']._id).then(user => {
        const groupEmail = (user.groupEmail)
        const emailQuery = []
        const emailInsert = groupEmail.forEach(email => {
          emailQuery.push({ "for": mongoose.mongo.ObjectId(email) })
        });


        emailQuery.push({ "for": mongoose.mongo.ObjectId(user._id) })

        if (user.projectManage.length == 0) {
          return _.render(req, res, '../500.ejs', {
            message: "Người dùng này chưa được thêm vào dự án"
          }, true)
        }
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



        lists = result.lists

        let agg = _Report.aggregate();

        if (_.has(req.query, 'name')) {
          query.name = { $regex: new RegExp(_.stringRegex(req.query.name), 'gi') };
        }
        if (_.has(req.query, 'typeDisplay')) {
          query.typeDisplay = { $regex: new RegExp(_.stringRegex(req.query.typeDisplay), 'gi') };
        }
        if (_.has(req.query, 'title')) {
          query.title = { $regex: new RegExp(_.stringRegex(req.query.title), 'gi') };
        }
        if (_.has(req.query, 'prior')) {
          query.prior = +(req.query.prior);
        }
        if (_.has(req.query, 'status')) {
          query.status = { $regex: new RegExp(_.stringRegex(req.query.status), 'gi') };
        }
        //sort
        if (!req.query.sort) {
          agg._pipeline.push({ $sort: { updatedAt: -1 } });
        }

        if (!_.isEmpty(sort)) agg._pipeline.push({ $sort: sort });

        agg._pipeline.push({ $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "fieldName" } })
        agg._pipeline.push({
          $match: {
            $or: emailQuery
          }
        })
        if (!_.isEmpty(query)) agg._pipeline.push({ $match: { $and: [query] } });
        _Report.aggregatePaginate(agg, { page, limit }, function (err, results, node, count) {
          if (err)
            return res.send(err)
          var paginator = new pagination.SearchPaginator({
            prelink: '/support-manager',
            current: page,
            rowsPerPage: limit,
            totalResult: count
          })
          return _.render(req, res, 'support-manager', {
            title: 'Danh sách các Yêu cầu',
            reports: results,
            lists: lists,
            sortData: sort,
            paging: paginator.getPaginationData(),
            plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
          }, true, err);
        })
      })
    }
    )
  }
}
exports.new = function (req, res) {
  _.render(req, res, 'support-manager-new', {
    title: 'Phản hồi yêu cầu',
    user: req.query,
    plugins: [['chosen'], ['bootstrap-select'], ['ckeditor'], 'fileinput']
  }, true);
};

exports.destroy = function (req, res) {
  _Report.findById(req.params.supportmanager, function (err, kq) {
    if (!kq.status == 4) {
      res.json({ code: 500, message: "Không thể xóa" });
    }
    else {
      _Report.findByIdAndRemove(req.params.supportmanager, function (error) {
        res.json({ code: (error ? 500 : 200), message: error ? error : "" });
      }
      )
    }
  })
}
exports.create = function (req, res) {
  _SupportManager.create(req.body, function (error, result) {
    let stt = {
      status: 2,
      supporter: {
        name: req.session.user.displayName,
        id: req.session.user._id
      },
      seen: false,
      lastRespondAt: Date.now()
    }

    _Report.findByIdAndUpdate(req.body.reportId, stt, function (error, ca) {
      let time = moment().diff(ca.updatedAt, 'minutes');
      if (time > ca.processTime && ca.processTime != 0) {
        _Report.findByIdAndUpdate(req.body.reportId, { late: true }, function (err) {
          if (err) {
            res.send(err);
          }
        })
      }
      else {
        _Report.findByIdAndUpdate(req.body.reportId, { late: false }, function (err, ca) {
          if (err) {
            res.send(err);
          }
        })
      }
      var transporter = nodeMailer.createTransport({
        service: " Gmail",
        auth: {
          user: "hoasaorequester@gmail.com",
          pass: "Nqt123abc123"
        }
      })
      var options = {
        from: '"Hoa Sao Supporter" <noreply@hoasao.vn>',
        to: 'hoanghaivo98@gmail.com',
        subject: 'Supporter Has Response Your Request',
        html: `<div>Hỗ trợ viên <span style="font-weight:bold;color:green"> ${req.session.user.name} </span> đã phản hồi yêu cầu xử lý của bạn.</div>
                            <div>Dạng sự cố:<span style="font-weight: bold; color: black;"> ${result.typeOfCause} </span ></div>
                            <div>Chi tiết sự cố:<span style="font-weight: bold; color: black;" > ${result.detailCause} </span > </div>
                            <div>Nội dung xử lý: <span style="font-weight: bold; color: black;"> ${result.contentHandle} </span > </div>
                            <div>Giải pháp đề xuất:<span style="font-weight: bold; color: black;" > ${result.offerSolution}</span ></div>
                            <div>Trạng thái sau xử lý:<span style="font-weight: bold; color: black;" > ${result.statusAfterHandle} </span ></div>`
      }
      transporter.sendMail(options)
        .then(success => {
        })
        .catch(error => {
          res.send(err);
        })
      res.json({ code: (error ? 500 : 200), message: error ? error : ca });
    })
  });

};

exports.update = function (req, res) {
  _Report.findById(req.body.support.id).then(report => {
    report.status = 1
    report.supporter.name = req.session.user['displayName']
    report.supporter.id = req.session.user['_id']
    report.save().then(result => {

      var transporter = nodeMailer.createTransport({
        service: " Gmail",
        auth: {
          user: "hoasaorequester@gmail.com",
          pass: "Nqt123abc123"
        }
      })
      var options = {
        from: '"Hoa Sao Supporter" <noreply@hoasao.vn>',
        to: 'hoanghaivo98@gmail.com',
        subject: 'Your Request Has Been Received',
        html: `<p>Hỗ trợ viên :<span style="font-weight: bold; color: green;"> ${req.session.user.name} </span > đã nhận yêu cầu xử lý của bạn.</p>
                        <p>Tên dự án:<span style="font-weight: bold; color: black;">${result.name}</span ></p>
                        <p>Loại sự cố:<span style="font-weight: bold; color: black;">${result.typeDisplay}</span ></p>
                        <p>Tiêu đề sự cố:<span style="font-weight: bold; color: black;">${result.title}</span ></p>
                        <p>Chi tiết sự cố:<span style="font-weight: bold; color: black;">${result.description}</span ></p>`
      }
      transporter.sendMail(options, function (err, info) {
        return res.json({ code: (err ? 500 : 200), message: err ? err : info })
      })
    })
  })
};

exports.show = function (req, res) {
  let supportseen = {
    id: req.session.user._id,
    name: req.session.user.displayName
  }
  _Report
    .findByIdAndUpdate((req.params.supportmanager), { seen: true, $addToSet: { supportseen: supportseen } }, function (err, result) {
      _.render(req, res, 'support-manager-view', {
        title: "Chi tiết yêu cầu",
        body: result
      }, true, err);
    });

};