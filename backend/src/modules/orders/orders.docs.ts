/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         seller:
 *           type: string
 *           format: objectId
 *           description: ID of the seller (User)
 *         product:
 *           type: string
 *           format: objectId
 *           description: ID of the product
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         buyer:
 *           type: string
 *           format: objectId
 *           description: ID of the buyer (User)
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           type: string
 *           example: "123 Main St, Dhaka, Bangladesh"
 *         totalPrice:
 *           type: number
 *           example: 150.5
 *         paymentMethod:
 *           type: string
 *           enum: [cod, sslcommerz, stripe, paypal]
 *           example: "cod"
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, paid, refunded]
 *           example: "unpaid"
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           example: "pending"
 *         refundStatus:
 *           type: string
 *           enum: [none, pending, approved, rejected, refunded]
 *           example: "none"
 *         couponCode:
 *           type: string
 *           example: "DISCOUNT10"
 *         discountAmount:
 *           type: number
 *           example: 10.0
 *         finalPrice:
 *           type: number
 *           example: 140.5
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totalOrders:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized – only admins can access
 *       403:
 *         description: Forbidden – not allowed to access this resource
 */
