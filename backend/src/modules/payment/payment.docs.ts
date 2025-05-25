/**
 * @swagger
 * /payment/stripe:
 *   post:
 *     summary: Create and confirm a Stripe payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - paymentMethodId
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *                 description: Payment amount in smallest currency unit (e.g., cents for USD)
 *               currency:
 *                 type: string
 *                 example: usd
 *                 description: 3-letter ISO currency code
 *               paymentMethodId:
 *                 type: string
 *                 example: pm_card_visa
 *                 description: Stripe payment method ID
 *     responses:
 *       200:
 *         description: Stripe payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Stripe payment successful
 *                 paymentIntent:
 *                   type: object
 *                   description: The full Stripe payment intent object
 *       401:
 *         description: Unauthorized or invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */
/**
 * @swagger
 * /payment/paypal:
 *   post:
 *     summary: Create a PayPal payment order
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 49.99
 *                 description: Payment amount in the main currency unit
 *               currency:
 *                 type: string
 *                 example: USD
 *                 description: 3-letter ISO currency code (e.g., USD, EUR)
 *     responses:
 *       200:
 *         description: PayPal order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: PayPal order created
 *                 order:
 *                   type: object
 *                   description: The full PayPal order response
 *       401:
 *         description: Unauthorized or invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */
