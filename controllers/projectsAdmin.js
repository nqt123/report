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
  if (_.has(req.query, 'position')) {
    query.position = { $regex: new RegExp(_.stringRegex(req.query.position), 'gi') };
  }
  if (_.has(req.query, 'usingCRM')) {
    query.usingCRM = { $regex: new RegExp(_.stringRegex(req.query.usingCRM), 'gi') };
  }
  if (_.has(req.query, 'goLineTime')) {
    query.goLineTime = { $regex: new RegExp(_.stringRegex(req.query.goLineTime), 'gi') };
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
exports.show = function (req, res) {
  ProjectAdmin.findById(req.params.projectsadmin).then(result => {
    _.render(req, res, 'projectsAdmin-detail', {
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