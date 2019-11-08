const Report = require('../modals/report')
exports.index = {
  json: function (req, res) {
    Report.find({}, function (err, reports) {
      if (err)
        return res.send(err)
      return res.send(reports)
    })
  },
  html: function (req, res) {
    const page = req.query.page ? req.query.page : 1
    const limit = req.query.row ? req.query.row : 10
    ///generate search field
    let matchField = {}
    let createdBy = {}
    let supporter = {}
    let query = {};
    var agg = Report.aggregate();
    ///find CreatedBy
    
      //Sorting
    //   if (!req.query.sort) {
    //     agg._pipeline.push({ $sort: { updatedAt: -1 } })
    //   }
      //Searching
    //   if (_.has(req.query, 'createdAt')) {
    //     query.createdAt = moment(req.query.createdAt, "DD/MM/YYYY h:mm a")._d;
    //   }
    //   if (_.has(req.query, 'lastRespondAt')) {
    //     query.lastRespondAt = moment(req.query.lastRespondAt, "DD/MM/YYYY h:mm a")._d;
    //   }
    //   if (!_.isEmpty(query)) agg._pipeline.push({
    //     $match: {
    //       $or: [
    //         { createdAt: { "$gt": query.createdAt } },
    //         { lastRespondAt: { "$lt": query.lastRespondAt } },
    //         {
    //           $and: [
    //             { createdAt: { "$gt": query.createdAt } },
    //             { lastRespondAt: { "$lt": query.lastRespondAt } }
    //           ]
    //         }
    //       ]
    //     }
    //   });
      //Apply match with field generated
      agg._pipeline.push({ $match: matchField })
      Report.aggregatePaginate(agg, { page, limit}, function (err, reports, node, count) {
        if (err)
          return res.send(err)
        var paginator = new pagination.SearchPaginator({
          prelink: '/reports-excel',
          current: page,
          rowsPerPage: limit,
          totalResult: count
        })
        return _.render(req, res, 'reports-excel', {
          title: 'Danh sách các Yêu cầu',
          result: reports,
          paging: paginator.getPaginationData(),
          plugins: ['moment', ['bootstrap-select'], ['bootstrap-datetimepicker'], ['bootstrap-daterangepicker'],'export-excel', ['chosen']]
        }, true, err);
      })
  }
};


exports.new = function (req, res) {
  console.log('helo');
  if (req.query.type) {
    const agg = Report.aggregate([
      {
        $lookup:
        {
          from: "projectadmins",
          localField: "displayName",
          foreignField: "name",
          as: "fieldProjectReport"
        }
      },
      { $unwind: "$fieldProjectReport" },
      {
        $lookup:
        {
          from: "slamenus",
          localField: "type",
          foreignField: "name",
          as: "fieldMenuReport"
        }
      },
      { $unwind: "$fieldMenuReport" },
      {
        $lookup:
        {
          from: "slalists",
          localField: "typeDisplay",
          foreignField: "name",
          as: "fieldListReport"
        }
      },
      { $unwind: "$fieldListReport" },
      // {
      //   $lookup:
      //   {
      //     from: "supportmanagers",
      //     localField: "_id",
      //     foreignField: "reportId",
      //     as: "fieldSupportReport"
      //   }
      // },
      // { $unwind: "$fieldSupportReport" }
    ], (err, result) => {
      if (err) {
        return console.log(err)
      }
      console.log(result);
      return res.json(result)
    });
  }
  else {
    _.render(req, res, 'reports-excel', {
      title: 'Thêm mới Yêu cầu',
    }, true)
  }

}
