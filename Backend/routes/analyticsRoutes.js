const express = require('express');
const {
  byCategory,
  byCourt,
  byState,
  complexity,
  mostBookmarked,
  mostViewed,
  overview,
  popularity,
  recentUpdates,
  searchTrends,
  userActivity
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', overview);
router.get('/most-viewed', mostViewed);
router.get('/most-bookmarked', mostBookmarked);
router.get('/by-category', byCategory);
router.get('/by-state', byState);
router.get('/by-court', byCourt);
router.get('/recent-updates', recentUpdates);
router.get('/popularity', popularity);
router.get('/search-trends', searchTrends);
router.get('/user-activity', userActivity);
router.get('/complexity', complexity);

module.exports = router;
