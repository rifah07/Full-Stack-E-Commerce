import { Response, NextFunction } from "express";
import Stripe from "stripe";
import axios from "axios";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { UnauthorizedError } from "../../../utils/errors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export const stripePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));
    const { amount, currency = "usd", paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.status(200).json({
      status: "success",
      message: "Stripe payment successful",
      paymentIntent,
    });
  } catch (error) {
    next(error);
  }
};
