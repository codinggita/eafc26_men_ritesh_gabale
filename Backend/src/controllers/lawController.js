import mongoose from "mongoose";

import { getLegalModel, legalModelList } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const sortableFields = new Set([
  "section",
  "title",
  "createdAt",
  "created_at",
  "updatedAt",
  "updated_at",
  "views",
  "bookmarkCount",
  "importance",
  "popularity"
]);

function normalizeSort(sort = "-created_at") {
  const direction = sort.startsWith("-") ? -1 : 1;
  const rawField = sort.replace("-", "");
  const fieldMap = {
    title: "section_title",
    createdAt: "created_at",
    updatedAt: "updated_at"
  };
  const field = fieldMap[rawField] || rawField;

  if (!sortableFields.has(rawField) && !sortableFields.has(field)) {
    return { created_at: -1 };
  }

  return { [field]: direction };
}

function buildPagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function buildBaseFilter(query = {}) {
  const filter = {};

  for (const key of ["state", "court", "status", "category"]) {
    if (query[key]) filter[key] = new RegExp(`^${query[key]}$`, "i");
  }

  if (query.act) filter.act_short_name = new RegExp(`^${query.act}$`, "i");
  if (query.bailable) filter.bailable = query.bailable === "true";
  if (query.cognizable) filter.cognizable = query.cognizable === "true";
  if (query.repealed) filter.repealed = query.repealed === "true";
  if (query.search) filter.$text = { $search: query.search };

  return filter;
}

function modelForRequest(req) {
  return getLegalModel(req.body.collection || req.body.act_short_name || req.query.collection || req.query.act);
}

async function findLawById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  for (const Model of legalModelList) {
    const law = await Model.findById(id);
    if (law) return { law, Model };
  }

  return null;
}

async function findAcrossCollections(filter, query) {
  const { page, limit, skip } = buildPagination(query);
  const sort = normalizeSort(query.sort);
  const records = await Promise.all(
    legalModelList.map((Model) => Model.find(filter).sort(sort).lean())
  );
  const data = records.flat();
  const total = data.length;

  return {
    data: data.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

async function countAcrossCollections(filter) {
  const counts = await Promise.all(legalModelList.map((Model) => Model.countDocuments(filter)));
  return counts.reduce((sum, count) => sum + count, 0);
}

export async function listLaws(req, res) {
  const filter = buildBaseFilter(req.query);
  const result = await findAcrossCollections(filter, req.query);
  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function getLaw(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  result.law.views += 1;
  await result.law.save();

  return sendSuccess(res, { data: result.law });
}

export async function createLaw(req, res) {
  if (!req.body.section_title || !req.body.section || !req.body.section_desc) {
    return sendError(res, {
      statusCode: 400,
      message: "section, section_title, and section_desc are required",
      error: "ValidationError"
    });
  }

  const Model = modelForRequest(req);
  const law = await Model.create(req.body);

  return sendSuccess(res, { statusCode: 201, message: "Law created successfully", data: law });
}

export async function replaceLaw(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  const law = await result.Model.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    { returnDocument: "after", overwrite: true, runValidators: true }
  );

  return sendSuccess(res, { message: "Law replaced successfully", data: law });
}

export async function updateLaw(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  const law = await result.Model.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
        updated_at: new Date()
      },
      $push: {
        history: {
          action: "updated",
          changes: req.body
        }
      }
    },
    { returnDocument: "after", runValidators: true }
  );

  return sendSuccess(res, { message: "Law updated successfully", data: law });
}

export async function deleteLaw(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  await result.Model.findByIdAndDelete(req.params.id);
  res.status(204).send();
}

export async function existsLaw(req, res) {
  const result = await findLawById(req.params.id);
  return sendSuccess(res, { data: { exists: Boolean(result) } });
}

export async function recentLaws(req, res) {
  const result = await findAcrossCollections({ archived: false }, { ...req.query, sort: "-created_at" });
  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function archivedLaws(req, res) {
  const result = await findAcrossCollections({ archived: true }, req.query);
  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function randomLaw(_req, res) {
  const Model = legalModelList[Math.floor(Math.random() * legalModelList.length)];
  const [data] = await Model.aggregate([{ $sample: { size: 1 } }]);
  return sendSuccess(res, { data: data || null });
}

export async function trendingLaws(req, res) {
  const result = await findAcrossCollections({}, { ...req.query, sort: "-popularity" });
  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function archiveLaw(req, res) {
  req.body = { archived: true, status: "archived" };
  return updateLaw(req, res);
}

export async function restoreLaw(req, res) {
  req.body = { archived: false, status: "active" };
  return updateLaw(req, res);
}

export async function lawHistory(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  return sendSuccess(res, { data: result.law.history || [] });
}

export async function lawSummary(req, res) {
  const result = await findLawById(req.params.id);

  if (!result) {
    return sendError(res, { statusCode: 404, message: "Law not found", error: "NotFound" });
  }

  return sendSuccess(res, {
    data: {
      id: result.law._id,
      act_name: result.law.act_name,
      section: result.law.section,
      section_title: result.law.section_title,
      summary: String(result.law.section_desc || "").slice(0, 280)
    }
  });
}

export async function searchLaws(req, res) {
  const q = req.query.q || req.query.search;

  if (!q) {
    return sendError(res, { statusCode: 400, message: "Search query is required", error: "ValidationError" });
  }

  const result = await findAcrossCollections({ $text: { $search: q } }, req.query);
  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function filterLaws(req, res) {
  const filterMap = {
    act: { act_short_name: new RegExp(`^${req.params.value}$`, "i") },
    chapter: { chapter: req.params.value },
    section: { section: req.params.value },
    state: { state: new RegExp(`^${req.params.value}$`, "i") },
    court: { court: new RegExp(`^${req.params.value}$`, "i") },
    status: { status: new RegExp(`^${req.params.value}$`, "i") },
    category: { category: new RegExp(`^${req.params.value}$`, "i") },
    punishment: { punishment_type: new RegExp(`^${req.params.value}$`, "i") },
    bailable: { bailable: req.params.value === "true" },
    cognizable: { cognizable: req.params.value === "true" }
  };
  const result = await findAcrossCollections(filterMap[req.params.type] || {}, req.query);

  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function namedFilter(req, res) {
  const name = req.params.name || req.path.split("/").pop();
  const filters = {
    recent: {},
    trending: {},
    "high-importance": { importance: { $gte: 8 } },
    repealed: { repealed: true },
    constitutional: { tags: /constitutional/i }
  };
  const sort = name === "trending" ? "-popularity" : "-created_at";
  const result = await findAcrossCollections(filters[name] || {}, { ...req.query, sort });

  return sendSuccess(res, { data: result.data, meta: { pagination: result.pagination } });
}

export async function stats(req, res) {
  return sendSuccess(res, { data: { count: await countAcrossCollections({}) } });
}

export async function groupStats(req, res) {
  const kind = req.params.kind || req.path.split("/").pop();
  const fieldMap = {
    "by-act": "$act_short_name",
    "by-category": "$category",
    "by-state": "$state",
    "by-court": "$court"
  };
  const groupField = fieldMap[kind] || "$act_short_name";
  const grouped = await Promise.all(
    legalModelList.map((Model) =>
      Model.aggregate([{ $group: { _id: groupField, count: { $sum: 1 } } }])
    )
  );

  return sendSuccess(res, { data: grouped.flat() });
}

export async function simpleMetric(req, res) {
  const metric = req.params.metric || req.path.split("/").pop();
  const filterMap = {
    active: { archived: false, repealed: false },
    repealed: { repealed: true }
  };
  const sort = metric.includes("bookmarked") || metric.includes("bookmarks") ? "-bookmarkCount" : "-views";
  const result = await findAcrossCollections(filterMap[metric] || {}, { ...req.query, sort });
  const count = metric === "active" || metric === "repealed" ? await countAcrossCollections(filterMap[metric]) : result.pagination.total;

  return sendSuccess(res, {
    data: result.data,
    meta: {
      metric,
      count,
      pagination: result.pagination
    }
  });
}
