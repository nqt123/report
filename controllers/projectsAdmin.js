const ProjectAdmin = require('../modals/projectsAdmin')

exports.index = function (req, res) {
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  var agg = ProjectAdmin.aggregate();

  ProjectAdmin.aggregatePaginate(agg, { page, limit }, function (err, result, node, count) {

    var paginator = new pagination.SearchPaginator({
      prelink: '/projectAdmin',
      current: page,
      rowsPerPage: limit,
      totalResult: count
    })

    return _.render(req, res, 'projectsAdmin', {
      title: 'Dánh sách Dự Án',
      result: result,
      paging: paginator.getPaginationData(),
      plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'], ['chosen']]
    }, true, err);
  })
}


exports.new = function (req, res) {
  ProjectAdmin.find({}).then(result => {
    _.render(req, res, 'projectsAdmin-new', {
      title: 'Tạo mới Dự Án',
    }, true)
  })
}
exports.create = function (req, res) {
  const newProject = new ProjectAdmin({
    name: req.body.name,
    offTime: req.body.offTime,
    IP: req.body.IP,
    agentNumber: req.body.agentNumber,
  })
  req.body.checkList.forEach(item => {
    newProject[item] = true
  })
  newProject.save().then(result => {
    res.send(result)
  })
}
exports.destroy = function (req, res) {
  ProjectAdmin.findByIdAndRemove(req.body.id, function (error, project) {
    if (error)
      return res.json(error)
    res.json(project)
  })
}
exports.edit = function (req, res) {
  console.log(req.params)
  ProjectAdmin.findById(req.params.projectsadmin).then(result => {
    _.render(req, res, 'projectsAdmin-edit', {
      title: 'Chỉnh sửa Dự Án',
      project: result
    }, true)
  })
}
// //name, processTime, note
// exports.update = function (req, res) {
//   SlaList.findById(req.body.id).then(sla => {
//     sla.name = req.body.name
//     sla.processTime = req.body.processTime
//     sla.note = req.body.note
//     sla.save().then(result => {
//       res.send(result)
//     })
//   })
// }