
exports.index = {
  json: function (req, res) {
    _SupportEmail.find({}, function (err, support) {
      if (err)
        return res.send(err)
      return res.send(support);
    })
  },
  html: function (req, res) {
    const page = req.query.page ? req.query.page : 1
    const limit = req.query.row ? req.query.row : 10

    let agg = _SupportEmail.aggregate();

    _SupportEmail.aggregatePaginate(agg, { page, limit }, function (err, results, node, count) {
      if (err)
        return res.send(err)
      var paginator = new pagination.SearchPaginator({
        prelink: '/support-email',
        current: page,
        rowsPerPage: limit,
        totalResult: count
      })
      return _.render(req, res, 'support-email', {
        title: 'Danh sách các Yêu cầu',
        results: results,
        paging: paginator.getPaginationData(),
        plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
      }, true, err);
    })
  }
}
exports.new = function (req, res) {
  _.render(req, res, 'support-email-new', {
    title: "Tạo mới",
    plugins: [['chosen'], ['bootstrap-select'], ['ckeditor'], 'fileinput']
  }, true)
};
exports.create = function (req, res) {
  _SupportEmail.create(req.body, function (err, result) {
    res.json({ code: (err ? 500 : 200), message: err ? err : "" })
  })
}
exports.edit = function (req, res) {
  _SupportEmail.findById(req.params.supportemail,function(err,result){
    _.render(req, res, 'support-email-edit', {
      title: "Sửa đổi danh mục",
      result:result,
      plugins: [['bootstrap-select']],
    }, true)
  })
}
exports.update = function(req,res){
  console.log('hello');
  
  console.log(req.body);
  console.log(req.body.tagetId);
  
  _SupportEmail.findByIdAndUpdate(req.body.tagetId,req.body,function(err,result){
    res.json({ code: (err ? 500 : 200), message: err ? err : "" })
  })
  
}


