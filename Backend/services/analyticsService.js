const Law = require('../models/Law');
const User = require('../models/User');

const groupBy = field =>
  Law.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

exports.getOverview = async () => {
  const [totalLaws, mostViewed, mostBookmarked, lawsByCategory] = await Promise.all([
    Law.countDocuments(),
    Law.find().sort('-views').limit(5),
    Law.find().sort('-bookmarkCount').limit(5),
    groupBy('category')
  ]);

  return {
    totalLaws,
    mostViewed,
    mostBookmarked,
    lawsByCategory
  };
};

exports.createListQuery = filter => Law.find(filter);

exports.getGroupedData = field => groupBy(field);

exports.getSearchTrends = () =>
  Law.aggregate([
    { $group: { _id: '$act', searchesProxy: { $sum: '$views' }, count: { $sum: 1 } } },
    { $sort: { searchesProxy: -1 } }
  ]);

exports.getUserActivity = async () => {
  const [users, laws, archived] = await Promise.all([
    User.countDocuments(),
    Law.countDocuments(),
    Law.countDocuments({ archived: true })
  ]);

  return { users, laws, archived };
};

exports.getComplexityBreakdown = () =>
  Law.aggregate([
    {
      $project: {
        complexity: {
          $ifNull: [
            '$complexity',
            {
              $switch: {
                branches: [
                  { case: { $gt: [{ $strLenCP: { $ifNull: ['$description', ''] } }, 1200] }, then: 'high' },
                  { case: { $gt: [{ $strLenCP: { $ifNull: ['$description', ''] } }, 500] }, then: 'medium' }
                ],
                default: 'low'
              }
            }
          ]
        }
      }
    },
    { $group: { _id: '$complexity', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
