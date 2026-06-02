const asyncHandler = require('../middlewares/async');
const { paginatedResponse } = require('../utils/lawQuery');
const analyticsService = require('../services/analyticsService');

const sendPaginated = async (res, req, sort) => {
  await paginatedResponse(res, req, analyticsService.createListQuery({}), {}, sort);
};

exports.overview = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getOverview();
  res.status(200).json({ success: true, data });
});

exports.mostViewed = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, '-views');
});

exports.mostBookmarked = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, '-bookmarkCount');
});

exports.byCategory = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getGroupedData('category');
  res.status(200).json({ success: true, data });
});

exports.byState = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getGroupedData('state');
  res.status(200).json({ success: true, data });
});

exports.byCourt = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getGroupedData('court');
  res.status(200).json({ success: true, data });
});

exports.recentUpdates = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, '-updatedAt');
});

exports.popularity = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, '-popularity -views -bookmarkCount');
});

exports.searchTrends = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getSearchTrends();
  res.status(200).json({ success: true, data });
});

exports.userActivity = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getUserActivity();
  res.status(200).json({ success: true, data });
});

exports.complexity = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getComplexityBreakdown();
  res.status(200).json({ success: true, data });
});
