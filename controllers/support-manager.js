const nodeMailer = require("nodemailer");
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
            menus: function (next) {
                _SlaMenu.find({}, next);
            }
        }, function (error, result) {
            menus = result.menus

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
                agg._pipeline.push({ $sort: { updatedAt: 1 } });
            }
            if (!_.isEmpty(sort)) agg._pipeline.push({ $sort: sort });

            agg._pipeline.push({ $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "fieldName" } })

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
                    menus: menus,
                    paging: paginator.getPaginationData(),
                    plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
                }, true, err);
            })
        }
        )
    }
}
exports.new = function (req, res) {
    _SlaMenu.find({}).then(result => {
        _.render(req, res, 'support-manager-new', {
            title: 'Tạo mới yêu cầu',
            user: req.query,
            result,
            plugins: [['chosen'], ['bootstrap-select'], ['ckeditor'], 'fileinput']
        }, true);
    })

};

exports.destroy = function (req, res) {
    _Report.findById(req.params.supportmanager, function (err, kq) {
        if (!kq.status == 2) {
            res.json({ code: (error ? 500 : 200), message: error ? error : ca });
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
            }
        }

        _Report.findByIdAndUpdate(req.body.reportId, stt, function (error, ca) {
            let time = moment().diff(ca.createdAt, 'minutes');
            if (time > ca.processTime) {
                _Report.findByIdAndUpdate(req.body.reportId, { late: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            else {
                _Report.findByIdAndUpdate(req.body.reportId, { late: false }, function (err, ca) {
                    if (err) {
                        console.log(err);
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
                html: `<div>Hỗ trợ viên <strong> ${req.session.user.name} </strong> đã phản hồi yêu cầu xử lý của bạn.</div>
                        <div>Dạng sự cố: ${result.typeOfCause}</div>
                        <div>Chi tiết sự cố: ${result.detailCause}</div>
                        <div>Nội dung xử lý: ${result.contentHandle}</div>
                        <div>Giải pháp đề xuất: ${result.offerSolution}</div>
                        <div>Trạng thái sau xử lý: ${result.statusAfterHandle}</div>`
            }
            transporter.sendMail(options)
                .then(success => {
                })
                .catch(error => {
                    console.log(error);
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
                html: `<p>Hỗ trợ viên : ${req.session.user.name} đã nhận yêu cầu xử lý của bạn.</p>`
            }
            transporter.sendMail(options, function (err, info) {
                if (err) {
                    return res.send(err);
                }
                res.send(info)
            })
        })
    })
};

exports.show = function (req, res) {
    _Report
        .findByIdAndUpdate((req.params.supportmanager),{seen:true}, function (err, result) {
            _.render(req, res, 'support-manager-view', {
                title: "Chi tiết yêu cầu",
                body: result
            }, true, err);
        });
};