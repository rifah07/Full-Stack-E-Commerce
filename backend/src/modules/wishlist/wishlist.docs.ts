/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID of the product
 *           example: "6638e85e7fcfe5115a63b981"
 *         addedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-21T10:15:30.000Z"
 *
 *     Wishlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6638ea227fcfe5115a63c012"
 *         user:
 *           type: string
 *           example: "6638e85e7fcfe5115a63b123"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WishlistItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get the current user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 totalItems:
 *                   type: integer
 *                   description: The total number of items in the wishlist
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6638ec327fcfe5115a63c234"
 *                           product:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "6638e85e7fcfe5115a63b981"
 *                               name:
 *                                 type: string
 *                                 example: "Smartphone X1"
 *                               price:
 *                                 type: number
 *                                 example: 499.99
 *                               images:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                   example: "https://example.com/image1.jpg"
 *                           addedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-21T10:15:30.000Z"
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User not authorized (not a buyer)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wishlist/remove/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from wishlist
 *         example: "6638e85e7fcfe5115a63b981"
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product removed from wishlist"
 *                 data:
 *                   type: object
 *                   properties:
 *                     wishlist:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Bad request - Invalid product ID format
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User not authorized (not a buyer)
 *       404:
 *         description: Not found - Wishlist not found for this user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to wishlist
 *                 example: "6638e85e7fcfe5115a63b981"
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product added to wishlist"
 *                 data:
 *                   type: object
 *                   properties:
 *                     wishlist:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Bad request - Invalid product ID or missing required fields
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User not authorized (not a buyer)
 *       500:
 *         description: Internal server error
 */