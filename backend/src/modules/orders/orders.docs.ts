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
 *       required:
 *         - seller
 *         - product
 *         - quantity
 *       properties:
 *         seller:
 *           type: string
 *           description: ID of the seller
 *           example: "6638e85e7fcfe5115a63b123"
 *         product:
 *           type: string
 *           description: ID of the product
 *           example: "6638e85e7fcfe5115a63b981"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the product
 *           example: 2
 *     
 *     RefundStatus:
 *       type: string
 *       enum: [none, pending, approved, rejected, refunded]
 *       description: Status of refund request
 *       example: "none"
 *     
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6638f4357fcfe5115a63d123"
 *         buyer:
 *           type: string
 *           description: ID of the buyer
 *           example: "6638e85e7fcfe5115a63b456"
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           type: string
 *           description: Shipping address for delivery
 *           example: "123 Main St, Anytown, ST 12345"
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *           description: Total price before discount
 *           example: 299.98
 *         paymentMethod:
 *           type: string
 *           enum: [cod, sslcommerz, stripe, paypal]
 *           description: Method of payment
 *           example: "stripe"
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, paid, refunded]
 *           description: Status of payment
 *           example: "paid"
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: Status of order
 *           example: "processing"
 *         refundStatus:
 *           $ref: '#/components/schemas/RefundStatus'
 *         couponCode:
 *           type: string
 *           description: Coupon code applied to the order
 *           example: "SUMMER25"
 *         discountAmount:
 *           type: number
 *           minimum: 0
 *           description: Discount amount applied
 *           example: 50
 *         finalPrice:
 *           type: number
 *           minimum: 0
 *           description: Final price after discount
 *           example: 249.98
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when order was cancelled
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when order was created
 *           example: "2025-05-21T12:30:45.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when order was last updated
 *           example: "2025-05-21T14:20:15.000Z"
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - orderItems
 *         - shippingAddress
 *       properties:
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID of the product
 *                 example: "6638e85e7fcfe5115a63b981"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity of the product
 *                 example: 2
 *         shippingAddress:
 *           type: string
 *           description: Shipping address for delivery
 *           example: "123 Main St, Anytown, ST 12345"
 *         paymentMethod:
 *           type: string
 *           enum: [cod, sslcommerz, stripe, paypal]
 *           description: Method of payment
 *           example: "stripe"
 *         couponCode:
 *           type: string
 *           description: Coupon code to apply to the order
 *           example: "SUMMER25"
 *
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: New status for the order
 *           example: "shipped"
 */