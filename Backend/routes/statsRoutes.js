const express = require('express');
const {
  active,
  bookmarks,
  byAct,
  byCategory,
  byCourt,
  byState,
  count,
  overview,
  recent,
  repealed,
  trending
} = require('../controllers/statsController');

const router = express.Router();

router.get('/', overview);
router.get('/count', count);
router.get('/active', active);
router.get('/repealed', repealed);
router.get('/by-act', byAct);
router.get('/by-category', byCategory);
router.get('/by-state', byState);
router.get('/by-court', byCourt);
router.get('/recent', recent);
router.get('/trending', trending);
router.get('/bookmarks', bookmarks);

module.exports = router;
