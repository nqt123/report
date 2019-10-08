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
        var page = _.has(req.query, 'page') ? parseInt(req.query.page) : 1;
        var rows = _.has(req.query, 'rows') ? parseInt(req.query.rows) : 10;
        let query = {};

        if (_.has(req.query, 'name')) {
            query.name = { $regex: new RegExp(_.stringRegex(req.query.name), 'i') };
        }
        if (_.has(req.query, 'type')) {
            query.type = { $regex: new RegExp(_.stringRegex(req.query.type), 'i') };
        }
        if (_.has(req.query, 'prior')) {
            query.prior = +(req.query.prior);
        }

        _Report
            .find(query)
            .sort({ "status": 1 })
            .paginate(page, rows, function (error, result, pageCount) {
                var paginator = new pagination.SearchPaginator({
                    prelink: '/support-manager',
                    current: page,
                    rowsPerPage: rows,
                    totalResult: pageCount
                });
                _Report.find({}, function (err, r) {
                    _.render(req, res, 'support-manager', {
                        title: 'Danh sách yêu cầu',
                        report: result,
                        paging: paginator.getPaginationData(),
                        plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker']]
                    }, true, error);
                }).sort({ "status": 1 })
            });
    }
}
exports.new = function (req, res) {
    _.render(req, res, 'support-manager-new', {
        title: 'Tạo mới yêu cầu',
        user: req.query,
        plugins: [['chosen'], ['bootstrap-select'], ['ckeditor'], 'fileinput']
    }, true);
};

exports.destroy = function (req, res) {
    console.log(req.params);
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
            status: 2
        }
        _Report.findByIdAndUpdate(req.body.reportId, stt, function (error, ca) {
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
                html: `<p>Hỗ trợ viên ${req.session.user.name} đã phản hồi yêu cầu xử lý của bạn.</p>`
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

    const report = _Report.findById(req.params.supportmanager).then(report => {
        report.supporter.name = req.session.user.displayName
        report.supporter.id = req.session.user._id
        report.status = 1
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
        .findById((req.params.supportmanager), function (err, result) {
            _.render(req, res, 'support-manager-view', {
                title: "Chi tiết yêu cầu",
                body: result
            }, true, err);
        });
};