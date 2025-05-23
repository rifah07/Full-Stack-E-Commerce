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
