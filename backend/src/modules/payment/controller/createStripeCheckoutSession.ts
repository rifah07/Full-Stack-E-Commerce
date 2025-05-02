import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
/*
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });

export const createStripeCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, amount, currency } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Order ${orderId}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: { orderId },
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

*/