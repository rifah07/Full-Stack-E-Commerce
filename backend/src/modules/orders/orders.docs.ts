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
 * /orders/all:
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

/**
 * @swagger
 * /orders/placeOrder:
 *   post:
 *     summary: Place an order (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               useCart:
 *                 type: boolean
 *                 example: true
 *               product:
 *                 type: string
 *                 description: Product ID for single cart item order
 *                 example: "60d0fe4f5311236168a109ca"
 *               quantity:
 *                 type: integer
 *                 description: Quantity for single cart item order
 *                 example: 2
 *               products:
 *                 type: array
 *                 description: Required if useCart is false
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *               paymentMethod:
 *                 type: string
 *                 enum: [paypal, stripe, cod]
 *                 example: "stripe"
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1Hh1YZ2eZvKYlo2CQ2Q0e2vL"
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               couponCode:
 *                 type: string
 *                 example: "DISCOUNT10"
 *     responses:
 *       201:
 *         description: Order placed successfully
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
 *                   example: Order created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request – validation error or missing data
 *       401:
 *         description: Unauthorized – only buyers can access
 *       403:
 *         description: Forbidden – not allowed to access this resource
 */

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get all orders placed by the logged-in buyer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved buyer's orders and summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       example: 3
 *                     activeOrders:
 *                       type: integer
 *                       example: 2
 *                     cancelledOrders:
 *                       type: integer
 *                       example: 1
 *                     totalPrice:
 *                       type: number
 *                       example: 150.00
 *                     paidAmount:
 *                       type: number
 *                       example: 100.00
 *                     refundedAmount:
 *                       type: number
 *                       example: 0.00
 *                     unpaidPendingAmount:
 *                       type: number
 *                       example: 50.00
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60df6c4f5d3c2f001c9ef123
 *                       buyer:
 *                         type: string
 *                         example: 60df6c2a5d3c2f001c9ef101
 *                       orderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: "Laptop"
 *                                 price:
 *                                   type: number
 *                                   example: 500.00
 *                             quantity:
 *                               type: number
 *                               example: 1
 *                       status:
 *                         type: string
 *                         example: pending
 *                       paymentStatus:
 *                         type: string
 *                         example: paid
 *       401:
 *         description: Unauthorized (user is not logged in or not a buyer)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /orders/seller/orders:
 *   get:
 *     summary: Get all orders that include products from the logged-in seller
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved seller's orders
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60df6c4f5d3c2f001c9ef123
 *                       buyer:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                       orderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: Phone Case
 *                                 price:
 *                                   type: number
 *                                   example: 19.99
 *                             quantity:
 *                               type: number
 *                               example: 2
 *                             seller:
 *                               type: object
 *                               properties:
 *                                 firstName:
 *                                   type: string
 *                                   example: Alice
 *                                 lastName:
 *                                   type: string
 *                                   example: Smith
 *                       status:
 *                         type: string
 *                         example: delivered
 *                       paymentStatus:
 *                         type: string
 *                         example: paid
 *       401:
 *         description: Unauthorized – only authenticated sellers can access this route
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/seller/{orderId}:
 *   get:
 *     summary: Get a specific order by ID for the logged-in seller
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order
 *         example: 60df6c4f5d3c2f001c9ef123
 *     responses:
 *       200:
 *         description: Successfully retrieved the seller's order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60df6c4f5d3c2f001c9ef123
 *                     buyer:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: Phone Case
 *                               price:
 *                                 type: number
 *                                 example: 19.99
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           seller:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                                 example: Alice
 *                               lastName:
 *                                 type: string
 *                                 example: Smith
 *                     status:
 *                       type: string
 *                       example: delivered
 *                     paymentStatus:
 *                       type: string
 *                       example: paid
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Unauthorized – only authenticated sellers can access this route
 *       404:
 *         description: Order not found or does not belong to this seller
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   patch:
 *     summary: Update the status of an order (admin or seller only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *         example: 60df6c4f5d3c2f001c9ef123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Successfully updated the order status
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
 *                   example: Order status updated to shipped
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60df6c4f5d3c2f001c9ef123
 *                     status:
 *                       type: string
 *                       example: shipped
 *       400:
 *         description: Invalid order ID or invalid status
 *       401:
 *         description: Unauthorized – only admin or seller can update the status
 *       403:
 *         description: Forbidden – seller tried to update status of unrelated order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
