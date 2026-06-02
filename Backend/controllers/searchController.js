const asyncHandler = require('../middlewares/async');
const { paginatedResponse } = require('../utils/lawQuery');
const searchService = require('../services/searchService');

exports.searchLaws = asyncHandler(async (req, res, next) => {
  const result = searchService.searchLaws(req.query);
  await paginatedResponse(res, req, result.query, result.filter, result.sort);
});
