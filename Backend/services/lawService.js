const Law = require('../models/Law');
const ErrorResponse = require('../utils/errorResponse');
const {
  addCondition,
  buildLawFilter,
  exactText,
  fieldCondition,
  searchCondition
} = require('../utils/lawQuery');

const buildHistoryEntry = ({ body, userId }, action) => ({
  action,
  changes: body || {},
  updatedBy: userId || null,
  updatedAt: new Date()
});

const ensureLaw = async id => {
  const law = await Law.findById(id);
  if (!law) {
    throw new ErrorResponse(`Law section not found with id of ${id}`, 404);
  }

  return law;
};

exports.getPaginatedListConfig = query => ({
  filter: buildLawFilter(query),
  fallbackSort: 'act section'
});

exports.createLaw = payload =>
  Law.create({
    ...payload.body,
    updateHistory: [buildHistoryEntry(payload, 'created')]
  });

exports.incrementAndGetById = async id => {
  const law = await Law.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true, runValidators: true }
  );

  if (!law) {
    throw new ErrorResponse(`Law section not found with id of ${id}`, 404);
  }

  return law;
};

exports.replaceLaw = async (id, payload) => {
  const currentLaw = await ensureLaw(id);

  return Law.findOneAndReplace(
    { _id: id },
    {
      ...payload.body,
      updateHistory: [
        ...(currentLaw.updateHistory || []),
        buildHistoryEntry(payload, 'replaced')
      ]
    },
    { new: true, runValidators: true }
  );
};

exports.patchLaw = async (id, payload) => {
  await ensureLaw(id);

  return Law.findByIdAndUpdate(
    id,
    {
      $set: payload.body,
      $push: { updateHistory: buildHistoryEntry(payload, 'patched') }
    },
    { new: true, runValidators: true }
  );
};

exports.deleteLaw = async id => {
  const law = await ensureLaw(id);
  await law.deleteOne();
};

exports.lawExists = async id => Boolean(await Law.exists({ _id: id }));

exports.getRecentListConfig = query => ({
  filter: buildLawFilter(query),
  fallbackSort: '-createdAt'
});

exports.getArchivedListConfig = query => {
  const filter = buildLawFilter(query);
  addCondition(filter, { $or: [{ archived: true }, { status: exactText('archived') }] });

  return { filter, fallbackSort: '-updatedAt' };
};

exports.archiveLaw = async (id, payload) => {
  await ensureLaw(id);

  return Law.findByIdAndUpdate(
    id,
    {
      $set: { archived: true, status: 'archived' },
      $push: { updateHistory: buildHistoryEntry(payload, 'archived') }
    },
    { new: true, runValidators: true }
  );
};

exports.restoreLaw = async (id, payload) => {
  await ensureLaw(id);

  return Law.findByIdAndUpdate(
    id,
    {
      $set: { archived: false, status: 'active' },
      $push: { updateHistory: buildHistoryEntry(payload, 'restored') }
    },
    { new: true, runValidators: true }
  );
};

exports.getLawHistory = async id => {
  const law = await ensureLaw(id);
  return law.updateHistory;
};

exports.getLawSummary = async id => {
  const law = await ensureLaw(id);
  const summary = law.summary || String(law.description || '').slice(0, 450);

  return { id: law._id, title: law.title, summary };
};

exports.getRandomLaw = async () => {
  const [law] = await Law.aggregate([{ $sample: { size: 1 } }]);
  return law || null;
};

exports.getTrendingListConfig = query => ({
  filter: buildLawFilter(query),
  fallbackSort: '-views -bookmarkCount -popularity -importance'
});

exports.getDistinctActs = () => Law.distinct('act');

exports.getChaptersByAct = actName =>
  Law.aggregate([
    { $match: { act: new RegExp(`^${actName}$`, 'i'), chapter: { $ne: null } } },
    { $group: { _id: '$chapter', chapter_title: { $first: '$chapter_title' } } },
    { $sort: { _id: 1 } }
  ]);

exports.getListByFieldConfig = ({ query, field, value, fallbackSort = 'act section' }) => {
  const filter = buildLawFilter(query);
  addCondition(filter, fieldCondition(field, value));

  return { filter, fallbackSort };
};

exports.getLawAnalytics = async () => {
  const totalLaws = await Law.countDocuments();
  const lawsPerAct = await Law.aggregate([
    { $group: { _id: '$act', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const totalChaptersData = await Law.aggregate([
    { $match: { chapter: { $ne: null } } },
    { $group: { _id: { act: '$act', chapter: '$chapter' } } },
    { $count: 'totalChapters' }
  ]);

  return {
    totalLaws,
    totalActs: lawsPerAct.length,
    totalChapters: totalChaptersData.length > 0 ? totalChaptersData[0].totalChapters : 0,
    lawsPerAct
  };
};

exports.getHighImportanceConfig = query => {
  const filter = buildLawFilter(query);
  addCondition(filter, { importance: { $gte: 7 } });

  return { filter, fallbackSort: '-importance -views' };
};

exports.getRepealedConfig = query => {
  const filter = buildLawFilter(query);
  addCondition(filter, fieldCondition('repealed', true));

  return { filter, fallbackSort: '-updatedAt' };
};

exports.getConstitutionalConfig = query => {
  const filter = buildLawFilter(query);
  addCondition(filter, searchCondition('constitutional'));

  return { filter, fallbackSort: 'act section' };
};

exports.createListQuery = filter => Law.find(filter);
