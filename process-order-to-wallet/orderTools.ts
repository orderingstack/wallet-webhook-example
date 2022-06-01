export interface IPointsAndWallet {
  points: number;
  walletId: string;
}
export function calculatePointsFromOrder(
  order: any,
  reqParams: any
): IPointsAndWallet {
  //some logic based on order content to return points
  const ratio = reqParams.ratio || 0.01;
  return {
    points: Math.round(order.total * ratio),
    walletId: order.users[0]?.userId,
  };
}
