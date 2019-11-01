const ProjectAdmin = require('../modals/projectsAdmin')

exports.index = function (req, res) {
  const page = req.query.page || 1
  const limit = req.query.limit || 10

  var agg = ProjectAdmin.aggregate();
  let query = {};
  let sort = _.cleanSort(req.query, '');
  
  if (_.has(req.query, 'name')) {
    query.name = { $regex: new RegExp(_.stringRegex(req.query.name), 'gi') };
  }
  if (_.has(req.query, 'offTime')) {
    query.offTime = { $regex: new RegExp(_.stringRegex(req.query.offTime), 'gi') };
  }
  if (_.has(req.query, 'CRM')) {
    query.CRM = Boolean(req.query.CRM)
  }
  if (_.has(req.query, 'Voice')) {
    query.Voice = Boolean(req.query.Voice);
  }
  if (_.has(req.query, 'Chat')) {
    query.Chat = Boolean(req.query.Chat);
  }
  if (_.has(req.query, 'Email')) {
    query.Email = Boolean(req.query.Email);
  }
  if (_.has(req.query, 'smartIVR')) {
    query.smartIVR = Boolean(req.query.smartIVR);
  }
  if (_.has(req.query, 'SMS')) {
    query.SMS = Boolean(req.query.SMS);
  }
  if (_.has(req.query, 'hardware')) {
    query.hardware = Boolean(req.query.hardware);
  }
  if (_.has(req.query, 'connection')) {
    query.connection = req.query.connection;
  }
  if (_.has(req.query, 'IP')) {
    query.IP = req.query.IP;
  }
  if (_.has(req.query, 'agentNumber')) {
    query.agentNumber = +(req.query.agentNumber);
  }
  if (!_.isEmpty(query)) agg._pipeline.push({ $match: { $and: [query] } });

  if (!_.isEmpty(sort)) agg._pipeline.push({ $sort: sort });

  ProjectAdmin.aggregatePaginate(agg, { page, limit }, function (err, result, node, count) {

    var paginator = new pagination.SearchPaginator({
      prelink: '/projectAdmin',
      current: page,
      rowsPerPage: limit,
      totalResult: count
    })

    return _.render(req, res, 'projectsAdmin', {
      title: 'Danh sách các Yêu cầu',
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
// exports.edit = function (req, res) {
//   SlaList.findById(req.params.sla).then(result => {
//     _.render(req, res, 'slas-edit', {
//       title: 'Cập nhật SLA',
//       sla: result
//     }, true)
//   })
// }
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