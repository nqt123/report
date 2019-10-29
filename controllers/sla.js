const SlaMenu = require('../modals/sla-menu')
const SlaList = require('../modals/sla-list')


exports.index = function (req, res) {
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  var agg = SlaList.aggregate();

  agg._pipeline.push({
    $lookup: {
      from: "slamenus",
      localField: "category",
      foreignField: "_id",
      as: "category"
    }
  })
  agg._pipeline.push({
    $unwind: "$category"
  })
  agg._pipeline.push({
    $sort: { createdAt: -1 }
  })
  SlaList.aggregatePaginate(agg, { page, limit }, function (err, result, node, count) {
    var paginator = new pagination.SearchPaginator({
      prelink: '/sla',
      current: page,
      rowsPerPage: limit,
      totalResult: count
    })
    return _.render(req, res, 'slas', {
      title: 'Danh sách các Yêu cầu',
      result: result,
      paging: paginator.getPaginationData(),
      plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
    }, true, err);
  })
}


exports.new = function (req, res) {
  SlaMenu.find({}).then(result => {
    _.render(req, res, 'slas-new', {
      title: 'Danh Sách SLA',
      slaMenu: result,
    }, true)
  })
}
exports.create = function (req, res) {
  try {
    const newSla = new SlaList(req.body)
    newSla.save().then(result =>
      res.json(result)
    )
  } catch (error) {
    res.send(error)
  }
}
exports.destroy = function (req, res) {
  SlaList.findByIdAndRemove(req.body.id, function (error, SLA) {
    if (error)
      return res.json(error)
    res.json(SLA)
  })
}
exports.edit = function (req, res) {
  SlaList.findById(req.params.sla).then(result => {
    _.render(req, res, 'slas-edit', {
      title: 'Cập nhật SLA',
      sla: result
    }, true)
  })
}
//name, processTime, note
exports.update = function (req, res) {
  SlaList.findById(req.body.id).then(sla => {
    sla.name = req.body.name
    sla.processTime = req.body.processTime
    sla.note = req.body.note
    sla.save().then(result => {
      res.send(result)
    })
  })
}