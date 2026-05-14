import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const IdaPinealCode = mongoose.model("IdaPinealCode", LegalSectionSchema, "ida_pineal_code");
