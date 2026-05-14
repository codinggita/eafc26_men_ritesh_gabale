import { Router } from "express";

import routes01 from "./01Routes.js";

const router = Router();

router.use("/v1", routes01);

export default router;
