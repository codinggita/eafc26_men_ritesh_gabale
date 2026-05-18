import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const MvaPinealCode = mongoose.model("MvaPinealCode", LegalSectionSchema, "mva_pineal_code");
