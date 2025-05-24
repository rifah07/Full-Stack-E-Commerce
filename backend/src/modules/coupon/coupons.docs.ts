/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6651f1789b5f47001d99cc9d"
 *         code:
 *           type: string
 *           example: "WELCOME10"
 *         description:
 *           type: string
 *           example: "10% off for new users"
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           example: "percentage"
 *         value:
 *           type: number
 *           example: 10
 *         minOrderValue:
 *           type: number
 *           example: 100
 *         usageLimit:
 *           type: number
 *           example: 50
 *         usageCount:
 *           type: number
 *           example: 15
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T23:59:59.000Z"
 *         status:
 *           type: string
 *           enum: [active, inactive, expired]
 *           example: "active"
 *         seller:
 *           type: string
 *           example: "6651f0110b5b37001d2bc998"
 *         productSpecific:
 *           type: boolean
 *           example: true
 *         products:
 *           type: array
 *           items:
 *             type: string
 *             example: "6651f17b9b5f47001d99cc99"
 *         categorySpecific:
 *           type: boolean
 *           example: false
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *             example: "electronics"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get coupons (admin gets all, seller gets own)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     data:
 *                       type: object
 *                       properties:
 *                         coupons:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Coupon'
 *                         totalCoupons:
 *                           type: number
 *                           example: 5
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     data:
 *                       type: object
 *                       properties:
 *                         adminCoupons:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Coupon'
 *                         totalAdminCoupons:
 *                           type: number
 *                           example: 2
 *                         sellerCoupons:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Coupon'
 *                         totalSellerCoupons:
 *                           type: number
 *                           example: 3
 *                         totalCoupons:
 *                           type: number
 *                           example: 5
 *       401:
 *         description: Unauthorized - Authentication required or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Authentication required."
 */

/**
 * @swagger
 * /coupons/seller/create:
 *   post:
 *     summary: Seller creates a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - value
 *               - expiresAt
 *             properties:
 *               code:
 *                 type: string
 *                 example: "NEWYEAR2025"
 *               type:
 *                 type: string
 *                 enum: [fixed, percentage]
 *                 example: "percentage"
 *               value:
 *                 type: number
 *                 example: 20
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *               minOrderValue:
 *                 type: number
 *                 example: 100
 *               usageCount:
 *                 type: number
 *                 example: 50
 *               productSpecific:
 *                 type: boolean
 *                 example: true
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60f8a36e865fdc1a88f31723"
 *               categorySpecific:
 *                 type: boolean
 *                 example: false
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "electronics"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Coupon created successfully
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
 *                   example: Coupon created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Bad request – validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized – seller access only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Admin creates a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - value
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 example: "WELCOMEADMIN"
 *               name:
 *                 type: string
 *                 example: "Admin Welcome Offer"
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "fixed"
 *               value:
 *                 type: number
 *                 example: 100
 *               usageCount:
 *                 type: number
 *                 example: 200
 *               seller:
 *                 type: string
 *                 example: "66501212e74b1ab71a5c6d7c"
 *               minOrderValue:
 *                 type: number
 *                 example: 500
 *               productSpecific:
 *                 type: boolean
 *                 example: false
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "66501212e74b1ab71a5c6d7d"
 *               categorySpecific:
 *                 type: boolean
 *                 example: false
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "electronics"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Coupon created successfully
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
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized – admin access only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */

/**
 * @swagger
 * /coupons/{code}:
 *   get:
 *     summary: Get a coupon by its code (admin and seller only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon code to fetch
 *         example: "WELCOME10"
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized – admin or seller access only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Coupon not found"
 */

/**
 * @swagger
 * /coupons/{code}:
 *   patch:
 *     summary: Update a coupon by code (admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the coupon to update
 *         example: "WELCOME10"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "percentage"
 *               value:
 *                 type: number
 *                 example: 15
 *               usageCount:
 *                 type: integer
 *                 example: 100
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               name:
 *                 type: string
 *                 example: "Updated Coupon Name"
 *               minOrderValue:
 *                 type: number
 *                 example: 200
 *               productSpecific:
 *                 type: boolean
 *                 example: true
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "6651f17b9b5f47001d99cc99"
 *               categorySpecific:
 *                 type: boolean
 *                 example: false
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "6651f17b9b5f47001d99cc99"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized – admin access only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Coupon not found"
 */
