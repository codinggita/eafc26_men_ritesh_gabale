const asyncHandler = require('../middlewares/async');
const statsService = require('../services/statsService');

exports.overview = asyncHandler(async (req, res, next) => {
  const data = await statsService.getOverview();
  res.status(200).json({ success: true, data });
});

exports.count = asyncHandler(async (req, res, next) => {
  const data = await statsService.getTotalCount();
  res.status(200).json({ success: true, data });
});

exports.active = asyncHandler(async (req, res, next) => {
  const data = await statsService.getActiveCount();
  res.status(200).json({ success: true, data });
});

exports.repealed = asyncHandler(async (req, res, next) => {
  const data = await statsService.getRepealedCount();
  res.status(200).json({ success: true, data });
});

exports.byAct = asyncHandler(async (req, res, next) => {
  const data = await statsService.getCountByField('act');
  res.status(200).json({ success: true, data });
});

exports.byCategory = asyncHandler(async (req, res, next) => {
  const data = await statsService.getCountByField('category');
  res.status(200).json({ success: true, data });
});

exports.byState = asyncHandler(async (req, res, next) => {
  const data = await statsService.getCountByField('state');
  res.status(200).json({ success: true, data });
});

exports.byCourt = asyncHandler(async (req, res, next) => {
  const data = await statsService.getCountByField('court');
  res.status(200).json({ success: true, data });
});

exports.recent = asyncHandler(async (req, res, next) => {
  const data = await statsService.getRecentCount();
  res.status(200).json({ success: true, data });
});

exports.trending = asyncHandler(async (req, res, next) => {
  const data = await statsService.getTrendingCount();
  res.status(200).json({ success: true, data });
});

exports.bookmarks = asyncHandler(async (req, res, next) => {
  const data = await statsService.getBookmarkStats();
  res.status(200).json({ success: true, data });
});
