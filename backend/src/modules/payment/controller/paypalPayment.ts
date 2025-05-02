import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const paypalPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, currency = "USD" } = req.body;

    const auth = await axios({
      method: "post",
      url: `${
        process.env.PAYPAL_MODE === "sandbox"
          ? "https://api-m.sandbox.paypal.com"
          : "https://api-m.paypal.com"
      }/v1/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.PAYPAL_CLIENT_ID as string,
        password: process.env.PAYPAL_CLIENT_SECRET as string,
      },
      params: {
        grant_type: "client_credentials",
      },
    });

    const order = await axios({
      method: "post",
      url: `${
        process.env.PAYPAL_MODE === "sandbox"
          ? "https://api-m.sandbox.paypal.com"
          : "https://api-m.paypal.com"
      }/v2/checkout/orders`,
      headers: {
        Authorization: `Bearer ${auth.data.access_token}`,
        "Content-Type": "application/json",
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          { amount: { currency_code: currency, value: amount } },
        ],
      },
    });

    res.status(200).json({
      status: "success",
      message: "PayPal order created",
      order: order.data,
    });
  } catch (error) {
    next(error);
  }
};
export default paypalPayment;