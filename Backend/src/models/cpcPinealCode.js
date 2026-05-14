import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const CpcPinealCode = mongoose.model("CpcPinealCode", LegalSectionSchema, "cpc_pineal_code");
