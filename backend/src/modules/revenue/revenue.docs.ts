/**
 * @swagger
 * /revenue/:
 *   get:
 *     summary: Get seller's total revenue
 *     description: Calculate and retrieve the total revenue for the authenticated seller from all paid orders. Only includes revenue from the seller's own products.
 *     tags:
 *       - Revenue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved seller revenue
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
 *                     sellerRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total revenue from all paid orders for this seller's products
 *                       example: 2487.50
 *             examples:
 *               withRevenue:
 *                 summary: Seller with revenue
 *                 value:
 *                   status: "success"
 *                   data:
 *                     sellerRevenue: 2487.50
 *               noRevenue:
 *                 summary: Seller with no revenue
 *                 value:
 *                   status: "success"
 *                   data:
 *                     sellerRevenue: 0
 *       401:
 *         description: Unauthorized - Authentication required
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
 *                   example: "Unauthorized"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *       403:
 *         description: Forbidden - User must have seller role
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
 *                   example: "Forbidden"
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
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
 *                   example: "Internal Server Error"
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 */