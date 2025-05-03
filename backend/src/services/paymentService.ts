import Stripe from "stripe";
import axios from "axios";
import { BadRequestError } from "../utils/errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export const processStripePayment = async (
  amount: number,
  currency: string,
  paymentMethodId: string
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status !== "succeeded") {
    throw new BadRequestError("Stripe payment failed");
  }

  return paymentIntent;
};



export const processPaypalPayment = async (
  amount: string,
  currency: string
) => {
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
      purchase_units: [{ amount: { currency_code: currency, value: amount } }],
    },
  });

  if (!order.data || order.data.status !== "CREATED") {
    throw new BadRequestError("PayPal order creation failed");
  }

  return order.data;
};
