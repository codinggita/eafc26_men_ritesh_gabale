const express = require('express');
const {
  archiveLaw,
  createLaw,
  deleteLaw,
  filterByAct,
  filterByBailable,
  filterByCategory,
  filterByChapter,
  filterByCognizable,
  filterByCourt,
  filterByPunishment,
  filterBySection,
  filterByState,
  filterByStatus,
  filterConstitutional,
  filterHighImportance,
  filterRecent,
  filterRepealed,
  filterTrending,
  getArchivedLaws,
  getChaptersByAct,
  getDistinctActs,
  getLawAnalytics,
  getLawById,
  getLawHistory,
  getLawSummary,
  getLaws,
  getLawsByAct,
  getRandomLaw,
  getRecentLaws,
  getTrendingLaws,
  lawExists,
  patchLaw,
  replaceLaw,
  restoreLaw
} = require('../controllers/lawController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();
const adminOnly = [protect, authorize('admin')];

router.route('/analytics').get(getLawAnalytics);
router.route('/acts').get(getDistinctActs);
router.route('/acts/:actName/chapters').get(getChaptersByAct);
router.route('/acts/:actName').get(getLawsByAct);

router.route('/exists/:id').get(lawExists);
router.route('/recent').get(getRecentLaws);
router.route('/archived').get(getArchivedLaws);
router.route('/random').get(getRandomLaw);
router.route('/trending').get(getTrendingLaws);

router.route('/filter/act/:actName').get(filterByAct);
router.route('/filter/chapter/:chapterId').get(filterByChapter);
router.route('/filter/section/:sectionNumber').get(filterBySection);
router.route('/filter/state/:state').get(filterByState);
router.route('/filter/court/:courtName').get(filterByCourt);
router.route('/filter/status/:status').get(filterByStatus);
router.route('/filter/category/:category').get(filterByCategory);
router.route('/filter/punishment/:type').get(filterByPunishment);
router.route('/filter/bailable/:value').get(filterByBailable);
router.route('/filter/cognizable/:value').get(filterByCognizable);
router.route('/filter/recent').get(filterRecent);
router.route('/filter/trending').get(filterTrending);
router.route('/filter/high-importance').get(filterHighImportance);
router.route('/filter/repealed').get(filterRepealed);
router.route('/filter/constitutional').get(filterConstitutional);

router.route('/:id/archive').patch(...adminOnly, archiveLaw);
router.route('/:id/restore').patch(...adminOnly, restoreLaw);
router.route('/:id/history').get(getLawHistory);
router.route('/:id/summary').get(getLawSummary);

router
  .route('/')
  .get(getLaws)
  .post(...adminOnly, createLaw);

router
  .route('/:id')
  .get(getLawById)
  .put(...adminOnly, replaceLaw)
  .patch(...adminOnly, patchLaw)
  .delete(...adminOnly, deleteLaw);

module.exports = router;
