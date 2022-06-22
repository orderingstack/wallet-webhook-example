require("source-map-support").install();
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import dayjs = require("dayjs");
import { getToken } from "../common/auth";
import { calculatePointsFromOrder } from "../common/orderTools";
import { isSignatureCorrect } from "../common/signatureVerify";
import { addPointsToUsersWallet, getWalletDetails } from "../common/walletTools";

const httpTriggerProcessOrder: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Request: process order");
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
    const { points, walletId } = calculatePointsFromOrder(
      req.body?.order,
      req.query
    );
    context.log.info(`add ${points} to wallet: ${walletId}`);
    if (points > 0) {
      const accessToken = await getToken();
      const currentWallet = await getWalletDetails(walletId, accessToken);
      const pointsExpireDate: Date = dayjs().add(365, "day").toDate();
      const result = await addPointsToUsersWallet(
        points,
        pointsExpireDate,
        walletId,
        accessToken
      );
      if (result) {
        context.log.info("success");
      }
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

export default httpTriggerProcessOrder;
