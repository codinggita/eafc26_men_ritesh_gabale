import mongoose from "mongoose";

import { LegalSectionSchema } from "./legalSectionSchema.js";

export const IpcPinealCode = mongoose.model("IpcPinealCode", LegalSectionSchema, "ipc_pineal_code");
