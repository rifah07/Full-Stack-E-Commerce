import Stripe from "stripe";
import axios from "axios";
import { BadRequestError } from "../utils/errors";
import { AuthRequest } from "../middlewares/authMiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export const processStripePayment = async (
  req: AuthRequest,
  amount: number,
  next: Function
) => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return next(new BadRequestError("Payment method ID is required"));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd", // Use currency from request if needed
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status !== "succeeded") {
      return next(new BadRequestError("Stripe payment failed"));
    }

    return paymentIntent;
  } catch (error) {
    return next(
      new BadRequestError(`Stripe payment error: ${(error as Error).message}`)
    );
  }
};

export const processPaypalPayment = async (
  req: AuthRequest,
  amount: number,
  next: Function
) => {
  try {
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
          {
            amount: {
              currency_code: "USD", // Use currency from request if needed
              value: amount.toString(),
            },
          },
        ],
      },
    });

    if (!order.data || order.data.status !== "CREATED") {
      return next(new BadRequestError("PayPal order creation failed"));
    }

    return order.data;
  } catch (error) {
    return next(
      new BadRequestError(`PayPal payment error: ${(error as Error).message}`)
    );
  }
};