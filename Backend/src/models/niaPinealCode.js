import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const NiaPinealCode = mongoose.model("NiaPinealCode", LegalSectionSchema, "nia_pineal_code");
