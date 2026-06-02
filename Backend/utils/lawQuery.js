const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toBoolean = value => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  return ['true', '1', 'yes'].includes(value.toLowerCase());
};

const exactText = value => new RegExp(`^${escapeRegExp(value)}$`, 'i');

const addCondition = (filter, condition) => {
  if (!condition || Object.keys(condition).length === 0) {
    return filter;
  }

  if (condition.$or || condition.$and) {
    filter.$and = filter.$and || [];
    filter.$and.push(condition);
    return filter;
  }

  Object.assign(filter, condition);
  return filter;
};

const searchCondition = term => {
  const value = String(term || '').trim();
  if (!value) {
    return {};
  }

  const regex = new RegExp(escapeRegExp(value), 'i');
  return {
    $or: [
      { act: regex },
      { section: regex },
      { title: regex },
      { description: regex },
      { category: regex },
      { offenseCategory: regex },
      { state: regex },
      { court: regex },
      { punishmentType: regex },
      { 'punishment.type': regex },
      { 'punishment.description': regex }
    ]
  };
};

const fieldCondition = (field, value) => {
  if (value === undefined || value === null || value === '') {
    return {};
  }

  switch (field) {
    case 'act':
      return { act: exactText(value) };
    case 'chapter': {
      const conditions = [
        { chapter: String(value) },
        { chapter_title: new RegExp(escapeRegExp(value), 'i') }
      ];
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue)) {
        conditions.unshift({ chapter: numericValue });
      }
      return { $or: conditions };
    }
    case 'section':
      return { section: exactText(value) };
    case 'state':
      return { state: exactText(value) };
    case 'court':
      return { court: exactText(value) };
    case 'status':
      return { status: exactText(value) };
    case 'category':
      return {
        $or: [
          { category: exactText(value) },
          { offenseCategory: exactText(value) }
        ]
      };
    case 'punishment':
      return {
        $or: [
          { punishmentType: exactText(value) },
          { 'punishment.type': exactText(value) },
          { 'punishment.description': new RegExp(escapeRegExp(value), 'i') }
        ]
      };
    case 'bailable':
    case 'cognizable':
    case 'repealed':
    case 'archived':
      return { [field]: toBoolean(value) };
    default:
      return { [field]: value };
  }
};

const buildLawFilter = source => {
  const filter = {};
  const ignored = new Set(['select', 'sort', 'page', 'limit', 'search', 'q']);

  Object.entries(source || {}).forEach(([key, value]) => {
    if (ignored.has(key)) {
      return;
    }
    addCondition(filter, fieldCondition(key, value));
  });

  addCondition(filter, searchCondition(source.search || source.q));
  return filter;
};

const getPagination = query => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getSort = (query, fallback = 'act section') => {
  if (!query.sort) {
    return fallback;
  }
  return String(query.sort).split(',').join(' ');
};

const applyQueryOptions = (mongooseQuery, req, fallbackSort) => {
  let query = mongooseQuery.sort(getSort(req.query, fallbackSort));
  const { skip, limit } = getPagination(req.query);
  query = query.skip(skip).limit(limit);

  if (req.query.select) {
    query = query.select(String(req.query.select).split(',').join(' '));
  }

  return query;
};

const paginatedResponse = async (res, req, mongooseQuery, countFilter, fallbackSort) => {
  const { page, limit, skip } = getPagination(req.query);
  const data = await applyQueryOptions(mongooseQuery, req, fallbackSort);
  const total = await mongooseQuery.model.countDocuments(countFilter);
  const pagination = {};

  if (skip + limit < total) {
    pagination.next = { page: page + 1, limit };
  }

  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: data.length,
    total,
    pagination,
    data
  });
};

module.exports = {
  addCondition,
  buildLawFilter,
  exactText,
  fieldCondition,
  getPagination,
  paginatedResponse,
  searchCondition,
  toBoolean
};
