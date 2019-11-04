
exports.index = {
    json: function (req, res) {
      _SlaMenu.find({}, function (err, support) {
        if (err)
          return res.send(err)
        return res.send(support);
      })
    },
    html: function (req, res) {
      const page = req.query.page ? req.query.page : 1
      const limit = req.query.row ? req.query.row : 10
  
      let agg = _SlaMenu.aggregate();
  
      _SlaMenu.aggregatePaginate(agg, { page, limit }, function (err, results, node, count) {
        if (err)
          return res.send(err)
        var paginator = new pagination.SearchPaginator({
          prelink: '/sla-menu',
          current: page,
          rowsPerPage: limit,
          totalResult: count
        })
        return _.render(req, res, 'sla-menu', {
          title: 'Danh sách các Yêu cầu',
          results: results,
          paging: paginator.getPaginationData(),
          plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
        }, true, err);
      })
    }
  }
  exports.new = function (req, res) {
    _.render(req, res, 'sla-menu-new', {
      title: "Tạo mới",
      plugins: [['chosen'], ['bootstrap-select'], ['ckeditor'], 'fileinput']
    }, true)
  };
  exports.create = function (req, res) {
    _SlaMenu.create(req.body, function (err, result) {
      res.json({ code: (err ? 500 : 200), message: err ? err : "" })
    })
  }
  exports.edit = function (req, res) {
    _SlaMenu.findById(req.params.slamenu, function (err, result) {
      _.render(req, res, 'sla-menu-edit', {
        title: "Sửa đổi danh mục",
        result: result,
        plugins: [['bootstrap-select']],
      }, true)
    })
  }
  exports.update = function (req, res) {
    _SlaMenu.findByIdAndUpdate(req.body.tagetId, req.body, function (err, result) {
      res.json({ code: (err ? 500 : 200), message: err ? err : "" })
    })
  
  }
  exports.destroy = function (req, res) {
    _SlaMenu.findByIdAndRemove(req.params.slamenu, function (error,result) {
      res.json({ code: (error ? 500 : 200), message: error ? error : "" });
    }
    )
  }
  
  
  