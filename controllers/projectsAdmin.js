const ProjectAdmin = require('../modals/projectsAdmin')

exports.index = function (req, res) {
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  var agg = ProjectAdmin.aggregate();

  ProjectAdmin.aggregatePaginate(agg, { page, limit }, function (err, result, node, count) {

    var paginator = new pagination.SearchPaginator({
      prelink: '/projectsAdmin',
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
    position: req.body.position,
    usingCRM: req.body.usingCRM,
    goLineTime : req.body.goLineTime,
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
  ProjectAdmin.findById(req.params.projectsadmin).then(result => {
    _.render(req, res, 'projectsAdmin-edit', {
      title: 'Chỉnh sửa Dự Án',
      project: result
    }, true)
  })
}
// //name, processTime, note
exports.update = function (req, res) {
  ProjectAdmin.findById(req.body.id).then(project => {
    //reset check list
    project.connection = false
    project.hardware = false
    project.SMS = false
    project.smartIVR = false
    project.Email = false
    project.Chat = false
    project.Voice = false
    project.CRM = false
    //update property
    console.log(req.body)
    project.name = req.body.name
    project.position = req.body.position
    project.usingCRM = req.body.usingCRM
    project.goLineTime = req.body.goLineTime
    project.offTime = req.body.offTime
    project.IP = req.body.IP
    project.agentNumber = req.body.agentNumber
    //change check list status
    req.body.checkList.forEach(item => {
      project[item] = true
    })
    project.save().then(result => {
      res.send(result)
    })
  })
}