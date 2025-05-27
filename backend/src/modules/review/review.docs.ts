/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: "6631c10e0d3d8a37f9df2321"
 *         product:
 *           type: string
 *           format: ObjectId
 *           description: ID of the product being reviewed
 *           example: "6631c0ab0d3d8a37f9df231a"
 *         user:
 *           type: string
 *           format: ObjectId
 *           description: ID of the user who wrote the review
 *           example: "6631bfa70d3d8a37f9df2309"
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5 stars
 *           example: 4
 *         comment:
 *           type: string
 *           nullable: true
 *           description: Optional review comment
 *           example: "Great product, fast delivery!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T12:34:56.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T12:35:10.000Z"
 *       required:
 *         - product
 *         - user
 *         - rating
 */

/**
 * @swagger
 * /review/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific product
 *     description: Retrieve paginated reviews for a product with average rating and total count
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: MongoDB ObjectId of the product
 *         example: "6631c0ab0d3d8a37f9df231a"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of reviews per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved product reviews
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                             example: "6631c10e0d3d8a37f9df2321"
 *                           product:
 *                             type: string
 *                             format: ObjectId
 *                             description: ID of the product being reviewed
 *                             example: "6631c0ab0d3d8a37f9df231a"
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 format: ObjectId
 *                                 example: "6631bfa70d3d8a37f9df2309"
 *                           rating:
 *                             type: number
 *                             minimum: 1
 *                             maximum: 5
 *                             description: Rating from 1 to 5 stars
 *                             example: 4
 *                           comment:
 *                             type: string
 *                             nullable: true
 *                             description: Optional review comment
 *                             example: "Great product, fast delivery!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-22T12:34:56.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-22T12:35:10.000Z"
 *                     totalReviews:
 *                       type: integer
 *                       description: Total number of reviews for this product
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages based on limit
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       description: Average rating of the product
 *                       example: 4.2
 *                     numberOfReviews:
 *                       type: integer
 *                       description: Total number of reviews from product model
 *                       example: 25
 *       400:
 *         description: Bad Request - Invalid product ID
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
 *                   example: "Invalid product ID"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       422:
 *         description: Validation Error - Invalid MongoDB ID format
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
 *                   example: "Product ID must be a valid MongoDB ID."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "productId"
 *                       message:
 *                         type: string
 *                         example: "Product ID must be a valid MongoDB ID."
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