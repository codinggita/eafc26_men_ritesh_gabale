const ErrorResponse = require('../utils/errorResponse');
const Law = require('../models/Law');
const { buildLawFilter, searchCondition } = require('../utils/lawQuery');

exports.searchLaws = query => {
  const term = query.q || query.search;
  if (!term || !String(term).trim()) {
    throw new ErrorResponse('Search query is required', 400);
  }

  const filter = buildLawFilter({ ...query, q: undefined, search: undefined });
  filter.$and = filter.$and || [];
  filter.$and.push(searchCondition(term));

  return {
    filter,
    sort: '-views -createdAt',
    query: Law.find(filter)
  };
};
