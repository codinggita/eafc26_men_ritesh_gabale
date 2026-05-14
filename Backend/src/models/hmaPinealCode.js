import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const HmaPinealCode = mongoose.model("HmaPinealCode", LegalSectionSchema, "hma_pineal_code");
