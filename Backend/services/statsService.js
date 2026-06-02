const Law = require('../models/Law');

const countBy = field =>
  Law.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

exports.getOverview = async () => {
  const [total, active, repealed, byAct] = await Promise.all([
    Law.countDocuments(),
    Law.countDocuments({ archived: { $ne: true }, status: { $ne: 'repealed' } }),
    Law.countDocuments({ $or: [{ repealed: true }, { status: /^repealed$/i }] }),
    countBy('act')
  ]);

  return { total, active, repealed, byAct };
};

exports.getTotalCount = async () => ({ total: await Law.countDocuments() });

exports.getActiveCount = async () => ({
  total: await Law.countDocuments({ archived: { $ne: true }, status: { $ne: 'repealed' } })
});

exports.getRepealedCount = async () => ({
  total: await Law.countDocuments({ $or: [{ repealed: true }, { status: /^repealed$/i }] })
});

exports.getCountByField = field => countBy(field);

exports.getRecentCount = async () => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const total = await Law.countDocuments({ createdAt: { $gte: since } });

  return { total, since };
};

exports.getTrendingCount = async () => ({
  total: await Law.countDocuments({ $or: [{ views: { $gt: 0 } }, { popularity: { $gt: 0 } }] })
});

exports.getBookmarkStats = async () => {
  const [data] = await Law.aggregate([
    {
      $group: {
        _id: null,
        totalBookmarks: { $sum: '$bookmarkCount' },
        lawsWithBookmarks: { $sum: { $cond: [{ $gt: ['$bookmarkCount', 0] }, 1, 0] } }
      }
    }
  ]);

  return data || { totalBookmarks: 0, lawsWithBookmarks: 0 };
};
