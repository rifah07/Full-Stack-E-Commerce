/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 *         - seller
 *       properties:
 *         _id:
 *           type: string
 *           example: "6639ac5f95d5896d2dfe15be"
 *         name:
 *           type: string
 *           example: "Wireless Bluetooth Headphones"
 *         description:
 *           type: string
 *           example: "High-quality wireless headphones with noise cancellation."
 *         price:
 *           type: number
 *           example: 129.99
 *         category:
 *           type: string
 *           example: "Electronics"
 *         stock:
 *           type: number
 *           example: 50
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://example.com/images/headphone1.jpg"
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         discount:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [percentage, fixed]
 *               example: "percentage"
 *             value:
 *               type: number
 *               example: 10
 *         seller:
 *           type: string
 *           description: "MongoDB ObjectId of the seller"
 *           example: "6639aabc95d5896d2dfe1def"
 *         averageRating:
 *           type: number
 *           example: 4.5
 *         numberOfReviews:
 *           type: number
 *           example: 12
 *         questionsAndAnswers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "6639f12e95d5896d2dfe1a3c"
 *               question:
 *                 type: string
 *                 example: "Does it support fast charging?"
 *               answer:
 *                 type: string
 *                 example: "Yes, it supports up to 18W fast charging."
 *               user:
 *                 type: string
 *                 description: "User who asked the question"
 *                 example: "6639bbcd95d5896d2dfe16aa"
 *               seller:
 *                 type: string
 *                 description: "Seller who answered"
 *                 example: "6639aabc95d5896d2dfe1def"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-25T15:30:00.000Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-26T12:15:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T12:10:00.000Z"
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all available products that are not marked as deleted.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 totalProducts:
 *                   type: integer
 *                   example: 3
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */