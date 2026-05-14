import { Router } from "express";

import {
  banUser,
  changeUserRole,
  clearCache,
  dashboard,
  getUser,
  listUsers,
  maintenance,
  reports,
  resolveReport,
  securityEvents,
  systemHealth,
  systemLogs,
  unbanUser
} from "../controllers/adminController.js";
import {
  changePassword,
  forgotPassword,
  generateJwt,
  login,
  logout,
  profile,
  refreshJwt,
  register,
  resetPassword,
  revokeJwt,
  sendOtp,
  sessions,
  updateProfile,
  verifyEmail,
  verifyJwt,
  verifyOtp
} from "../controllers/authController.js";
import {
  archiveLaw,
  archivedLaws,
  createLaw,
  deleteLaw,
  existsLaw,
  filterLaws,
  getLaw,
  groupStats,
  lawHistory,
  lawSummary,
  listLaws,
  namedFilter,
  randomLaw,
  recentLaws,
  replaceLaw,
  restoreLaw,
  searchLaws,
  simpleMetric,
  stats,
  trendingLaws,
  updateLaw
} from "../controllers/lawController.js";
import { health, middlewareInfo } from "../controllers/systemController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router
  .route("/laws")
  .get(asyncHandler(listLaws))
  .post(asyncHandler(createLaw))
  .head((_req, res) => res.status(200).end())
  .options((_req, res) => res.set("Allow", "GET,POST,HEAD,OPTIONS").status(204).end());

router.get("/laws/recent", asyncHandler(recentLaws));
router.get("/laws/archived", asyncHandler(archivedLaws));
router.get("/laws/random", asyncHandler(randomLaw));
router.get("/laws/trending", asyncHandler(trendingLaws));
router.get("/laws/exists/:id", asyncHandler(existsLaw));
router.get("/laws/filter/recent", asyncHandler(namedFilter));
router.get("/laws/filter/trending", asyncHandler(namedFilter));
router.get("/laws/filter/high-importance", asyncHandler(namedFilter));
router.get("/laws/filter/repealed", asyncHandler(namedFilter));
router.get("/laws/filter/constitutional", asyncHandler(namedFilter));
router.get("/laws/filter/:type/:value", asyncHandler(filterLaws));

router
  .route("/laws/:id")
  .get(asyncHandler(getLaw))
  .put(asyncHandler(replaceLaw))
  .patch(asyncHandler(updateLaw))
  .delete(asyncHandler(deleteLaw))
  .head((_req, res) => res.status(200).end())
  .options((_req, res) => res.set("Allow", "GET,PUT,PATCH,DELETE,HEAD,OPTIONS").status(204).end());

router.patch("/laws/:id/archive", asyncHandler(archiveLaw));
router.patch("/laws/:id/restore", asyncHandler(restoreLaw));
router.get("/laws/:id/history", asyncHandler(lawHistory));
router.get("/laws/:id/summary", asyncHandler(lawSummary));

router.get("/search/laws", asyncHandler(searchLaws));

router.get("/analytics/laws/by-category", asyncHandler(groupStats));
router.get("/analytics/laws/by-state", asyncHandler(groupStats));
router.get("/analytics/laws/by-court", asyncHandler(groupStats));
router.get("/analytics/laws/:metric", asyncHandler(simpleMetric));
router.get("/analytics/laws", asyncHandler(simpleMetric));

router.get("/stats/laws/count", asyncHandler(stats));
router.get("/stats/laws/by-act", asyncHandler(groupStats));
router.get("/stats/laws/by-category", asyncHandler(groupStats));
router.get("/stats/laws/by-state", asyncHandler(groupStats));
router.get("/stats/laws/by-court", asyncHandler(groupStats));
router.get("/stats/laws/active", asyncHandler(simpleMetric));
router.get("/stats/laws/repealed", asyncHandler(simpleMetric));
router.get("/stats/laws/recent", asyncHandler(simpleMetric));
router.get("/stats/laws/trending", asyncHandler(simpleMetric));
router.get("/stats/laws/bookmarks", asyncHandler(simpleMetric));
router.get("/stats/laws", asyncHandler(stats));

router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/logout", asyncHandler(logout));
router.get("/auth/profile", asyncHandler(authenticate), asyncHandler(profile));
router.patch("/auth/profile", asyncHandler(authenticate), asyncHandler(updateProfile));
router.post("/auth/forgot-password", asyncHandler(forgotPassword));
router.post("/auth/reset-password", asyncHandler(resetPassword));
router.post("/auth/change-password", asyncHandler(authenticate), asyncHandler(changePassword));
router.post("/auth/verify-email", asyncHandler(verifyEmail));
router.post("/auth/send-otp", asyncHandler(sendOtp));
router.post("/auth/verify-otp", asyncHandler(verifyOtp));
router.get("/auth/sessions", asyncHandler(authenticate), asyncHandler(sessions));

router.get("/jwt/profile", asyncHandler(authenticate), asyncHandler(profile));
router.get("/jwt/dashboard", asyncHandler(authenticate), (_req, res) => res.status(200).json({ success: true, message: "JWT dashboard", data: { status: "authorized" } }));
router.post("/jwt/generate-token", asyncHandler(generateJwt));
router.post("/jwt/verify-token", asyncHandler(verifyJwt));
router.post("/jwt/refresh-token", asyncHandler(refreshJwt));
router.delete("/jwt/revoke-token", asyncHandler(revokeJwt));
router.get("/jwt/private-laws", asyncHandler(authenticate), asyncHandler(listLaws));
router.get("/jwt/private-analytics", asyncHandler(authenticate), asyncHandler(simpleMetric));

router.get("/middleware/:topic", middlewareInfo);

router.get("/health", health);
router.get("/admin/system/health", asyncHandler(systemHealth));
router.get("/admin/users", asyncHandler(authenticate), authorize("admin"), asyncHandler(listUsers));
router.get("/admin/users/:id", asyncHandler(authenticate), authorize("admin"), asyncHandler(getUser));
router.patch("/admin/users/:id/ban", asyncHandler(authenticate), authorize("admin"), asyncHandler(banUser));
router.patch("/admin/users/:id/unban", asyncHandler(authenticate), authorize("admin"), asyncHandler(unbanUser));
router.patch("/admin/users/:id/role", asyncHandler(authenticate), authorize("admin"), asyncHandler(changeUserRole));
router.get("/admin/reports", asyncHandler(authenticate), authorize("admin"), asyncHandler(reports));
router.patch("/admin/reports/:id/resolve", asyncHandler(authenticate), authorize("admin"), asyncHandler(resolveReport));
router.get("/admin/system/logs", asyncHandler(authenticate), authorize("admin"), asyncHandler(systemLogs));
router.post("/admin/system/maintenance", asyncHandler(authenticate), authorize("admin"), asyncHandler(maintenance));
router.delete("/admin/cache/clear", asyncHandler(authenticate), authorize("admin"), asyncHandler(clearCache));
router.get("/admin/security/events", asyncHandler(authenticate), authorize("admin"), asyncHandler(securityEvents));
router.get("/admin/dashboard", asyncHandler(authenticate), authorize("admin"), asyncHandler(dashboard));

router.head(
  [
    "/laws/recent",
    "/laws/trending",
    "/laws/archived",
    "/search/laws",
    "/analytics/laws/most-viewed",
    "/stats/laws/count",
    "/auth/profile",
    "/jwt/profile",
    "/admin/users",
    "/admin/system/health",
    "/admin/security/events",
    "/middleware/logger",
    "/health",
    "/laws/random",
    "/laws/filter/state/:state",
    "/laws/filter/act/:actName",
    "/laws/filter/category/:category",
    "/laws/filter/court/:courtName"
  ],
  (_req, res) => res.status(200).end()
);

router.options("*path", (_req, res) => {
  res
    .set("Allow", "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS")
    .status(204)
    .end();
});

export default router;
