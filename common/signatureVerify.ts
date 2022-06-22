/**
 * function for verifing signature header (x-signature) in webhooks requests
 */
import { createHash } from "crypto";

export const isSignatureCorrect =
  (req: any, webhookSecurityToken: string) => {
    const signature = req.headers["x-signature"];
    const calculatedSignature = sha256(req.rawBody + webhookSecurityToken);
    console.log('calculated ' + calculatedSignature)
    console.log('received ' + signature)
    return calculatedSignature == signature;
  };

function sha256(data: any) {
  return createHash("sha256").update(data).digest("hex");
}
