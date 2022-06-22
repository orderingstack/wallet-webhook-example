import axios, { AxiosRequestConfig } from "axios";
import dayjs = require("dayjs");

export async function addPointsToUsersWallet(
  points: number,
  expiresTo: Date,
  walletId: string,
  accessToken: string
): Promise<boolean> {
  const expiresToDayjs = dayjs(expiresTo).toISOString();
  const request = {
    url: `${process.env.BASE_URL}/wallet-api/api/wallet/${walletId}/batch`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: { amount: points, expires: expiresToDayjs },
  };
  const result = await axios(request);
  return true;
}

export async function getWalletDetails(
  walletId: string,
  accessToken: string
): Promise<any> {
  const request = {
    url: `${process.env.BASE_URL}/wallet-api/api/wallet/${walletId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await axios(request);
  return result;
}

export async function createWallet(
  tenant: string,
  walletId: string,
  accessToken: string
): Promise<any> {
  const request = {
    url: `${process.env.BASE_URL}/wallet-api/api/wallet/${walletId}`,
    method: "POST",
    headers: {
      'x-tenant': tenant,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await axios(request);
  return result;
}
