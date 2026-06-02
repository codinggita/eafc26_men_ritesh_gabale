const asyncHandler = require('../middlewares/async');
const { paginatedResponse } = require('../utils/lawQuery');
const lawService = require('../services/lawService');

const sendPaginated = async (res, req, config) => {
  await paginatedResponse(
    res,
    req,
    lawService.createListQuery(config.filter),
    config.filter,
    config.fallbackSort
  );
};

exports.createLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.createLaw({
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  res.status(201).json({ success: true, data: law });
});

exports.getLaws = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getPaginatedListConfig(req.query));
});

exports.getLawById = asyncHandler(async (req, res, next) => {
  const law = await lawService.incrementAndGetById(req.params.id);
  res.status(200).json({ success: true, data: law });
});

exports.replaceLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.replaceLaw(req.params.id, {
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  res.status(200).json({ success: true, data: law });
});

exports.patchLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.patchLaw(req.params.id, {
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  res.status(200).json({ success: true, data: law });
});

exports.updateLaw = exports.patchLaw;

exports.deleteLaw = asyncHandler(async (req, res, next) => {
  await lawService.deleteLaw(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

exports.lawExists = asyncHandler(async (req, res, next) => {
  const exists = await lawService.lawExists(req.params.id);
  res.status(200).json({ success: true, exists });
});

exports.getRecentLaws = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getRecentListConfig(req.query));
});

exports.getArchivedLaws = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getArchivedListConfig(req.query));
});

exports.archiveLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.archiveLaw(req.params.id, {
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  res.status(200).json({ success: true, data: law });
});

exports.restoreLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.restoreLaw(req.params.id, {
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  res.status(200).json({ success: true, data: law });
});

exports.getLawHistory = asyncHandler(async (req, res, next) => {
  const history = await lawService.getLawHistory(req.params.id);
  res.status(200).json({ success: true, count: history.length, data: history });
});

exports.getLawSummary = asyncHandler(async (req, res, next) => {
  const summary = await lawService.getLawSummary(req.params.id);
  res.status(200).json({ success: true, data: summary });
});

exports.getRandomLaw = asyncHandler(async (req, res, next) => {
  const law = await lawService.getRandomLaw();
  res.status(200).json({ success: true, data: law });
});

exports.getTrendingLaws = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getTrendingListConfig(req.query));
});

exports.getDistinctActs = asyncHandler(async (req, res, next) => {
  const acts = await lawService.getDistinctActs();
  res.status(200).json({ success: true, data: acts });
});

exports.getChaptersByAct = asyncHandler(async (req, res, next) => {
  const chapters = await lawService.getChaptersByAct(req.params.actName);
  res.status(200).json({ success: true, count: chapters.length, data: chapters });
});

exports.getLawsByAct = asyncHandler(async (req, res, next) => {
  await sendPaginated(
    res,
    req,
    lawService.getListByFieldConfig({
      query: req.query,
      field: 'act',
      value: req.params.actName
    })
  );
});

exports.getLawAnalytics = asyncHandler(async (req, res, next) => {
  const data = await lawService.getLawAnalytics();
  res.status(200).json({ success: true, data });
});

const filterBy = (field, param, fallbackSort = 'act section') =>
  asyncHandler(async (req, res, next) => {
    await sendPaginated(
      res,
      req,
      lawService.getListByFieldConfig({
        query: req.query,
        field,
        value: req.params[param],
        fallbackSort
      })
    );
  });

exports.filterByAct = filterBy('act', 'actName');
exports.filterByChapter = filterBy('chapter', 'chapterId');
exports.filterBySection = filterBy('section', 'sectionNumber');
exports.filterByState = filterBy('state', 'state');
exports.filterByCourt = filterBy('court', 'courtName');
exports.filterByStatus = filterBy('status', 'status');
exports.filterByCategory = filterBy('category', 'category');
exports.filterByPunishment = filterBy('punishment', 'type');
exports.filterByBailable = filterBy('bailable', 'value');
exports.filterByCognizable = filterBy('cognizable', 'value');

exports.filterRecent = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getRecentListConfig(req.query));
});

exports.filterTrending = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getTrendingListConfig(req.query));
});

exports.filterHighImportance = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getHighImportanceConfig(req.query));
});

exports.filterRepealed = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getRepealedConfig(req.query));
});

exports.filterConstitutional = asyncHandler(async (req, res, next) => {
  await sendPaginated(res, req, lawService.getConstitutionalConfig(req.query));
});
