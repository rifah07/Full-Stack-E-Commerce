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