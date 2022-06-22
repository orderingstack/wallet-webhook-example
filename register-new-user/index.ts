import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import dayjs = require("dayjs");
import { getToken } from "../common/auth";
import { calculatePointsFromOrder } from "../common/orderTools";
import { isSignatureCorrect } from "../common/signatureVerify";
import {
  addPointsToUsersWallet,
  createWallet,
  getWalletDetails,
} from "../common/walletTools";

const httpTriggerRegisterNewUser: AzureFunction = async function (
  context: Context,

  req: HttpRequest
): Promise<void> {
  context.log("Reqest: register-new-user");
  const webhookSecurityToken = process.env.SECURITY_TOKEN;
  if (!isSignatureCorrect(req, webhookSecurityToken)) {
    console.error("wrong signature");
    context.res = {
      status: 403,
      body: "wrong signature",
    };
    return;
  }
  try {
    const walletId = req.body.id;
    const points: number = parseInt(req.query.points) || 30;
    context.log.info(`(register-new-user) add ${points} to wallet: ${walletId}`);
    const accessToken = await getToken();    
    //const currentWallet = await getWalletDetails(walletId, accessToken);
    await createWallet(process.env.TENANT, walletId, accessToken);
    const pointsExpireDate: Date = dayjs().add(365, "day").toDate();
    const result = await addPointsToUsersWallet(
      points,
      pointsExpireDate,
      walletId,
      accessToken
    );
    if (result) {
      context.log.info("(register-new-user) success");
    }
    context.res = {
      status: 200,
      body: {},
    };
  } catch (err) {
    context.res = { status: 400 };
    if (err.response) {
      context.log.error(
        `ERROR: ${err.response.status} ${err.response.statusText}`
      );
    } else {
      context.log.error(err);
    }
  }
};

export default httpTriggerRegisterNewUser;

/*
tenant properties
userWebhookUrl
userWebhookSecurityToken

POST z danymi:
UserWebhookRequest {
    private UUID id;
    private String login;
    private String firstName;
    private String lastName;
    private Map<String, LocalDateTime> consents;
}
*/
