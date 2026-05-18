import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const IeaPinealCode = mongoose.model("IeaPinealCode", LegalSectionSchema, "iea_pineal_code");
