import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const CrpcPinealCode = mongoose.model("CrpcPinealCode", LegalSectionSchema, "crpc_pineal_code");
