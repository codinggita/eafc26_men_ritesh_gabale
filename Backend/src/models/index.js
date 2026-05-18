import { CpcPinealCode } from "./cpcPinealCode.js";
import { CrpcPinealCode } from "./crpcPinealCode.js";
import { HmaPinealCode } from "./hmaPinealCode.js";
import { IdaPinealCode } from "./idaPinealCode.js";
import { IeaPinealCode } from "./ieaPinealCode.js";
import { IpcPinealCode } from "./ipcPinealCode.js";
import { MvaPinealCode } from "./mvaPinealCode.js";
import { NiaPinealCode } from "./niaPinealCode.js";

export const legalModels = {
  ida: IdaPinealCode,
  ida_pineal_code: IdaPinealCode,
  nia: NiaPinealCode,
  nia_pineal_code: NiaPinealCode,
  cpc: CpcPinealCode,
  cpc_pineal_code: CpcPinealCode,
  hma: HmaPinealCode,
  hma_pineal_code: HmaPinealCode,
  iea: IeaPinealCode,
  iea_pineal_code: IeaPinealCode,
  mva: MvaPinealCode,
  mva_pineal_code: MvaPinealCode,
  ipc: IpcPinealCode,
  ipc_pineal_code: IpcPinealCode,
  crpc: CrpcPinealCode,
  crpc_pineal_code: CrpcPinealCode
};

export const legalModelList = Object.values(
  Object.fromEntries(Object.entries(legalModels).filter(([key]) => key.includes("_pineal_code")))
);

export function getLegalModel(name = "ipc") {
  return legalModels[String(name).trim().toLowerCase()] || IpcPinealCode;
}
