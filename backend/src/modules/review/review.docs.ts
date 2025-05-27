/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the review.
 *           example: 64fdc3b1e4d2c1a0b7c5f3e8
 *         product:
 *           type: string
 *           format: uuid
 *           description: ID of the product being reviewed.
 *           example: 64fdc3b1e4d2c1a0b7c5f3e7
 *         user:
 *           type: string
 *           format: uuid
 *           description: ID of the user who wrote the review.
 *           example: 64fdc3b1e4d2c1a0b7c5f3e1
 *         rating:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given to the product.
 *           example: 4
 *         comment:
 *           type: string
 *           description: Optional comment provided by the user.
 *           example: "Great product! Highly recommended."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was created.
 *           example: 2025-05-21T15:45:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was last updated.
 *           example: 2025-05-22T12:00:00.000Z
 */

/**
 * @swagger
 * /reviews/{productId}/reviews:
 *   get:
 *     summary: Get reviews for a specific product
 *     tags:
 *       - Reviews
 *     description: |
 *       Retrieves all reviews for the given product. Supports pagination and returns metadata including total pages, current page, and average rating.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to get reviews for
 *         schema:
 *           type: string
 *           example: 6649e1095f11313fbd7cce40
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of reviews per page (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of reviews for the specified product
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     totalReviews:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       example: 4.2
 *                     numberOfReviews:
 *                       type: integer
 *                       example: 20
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */

/**
 * @swagger
 * /reviews/{productId}/reviews:
 *   post:
 *     summary: Submit a review for a product
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Allows a logged-in buyer to submit a review for a specific product.
 *       Each user can review a product only once. The review includes a rating and comment.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product being reviewed
 *         schema:
 *           type: string
 *           example: 6649e1095f11313fbd7cce40
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Excellent quality and fast delivery!"
 *     responses:
 *       201:
 *         description: Review submitted successfully
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
 *                   example: Review submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input, duplicate review, or product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized (e.g., not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden (e.g., not a buyer)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 */

/**
 * @swagger
 * /reviews/{productId}/reviews/{reviewId}:
 *   patch:
 *     summary: Update a review for a product
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Allows a logged-in buyer to update their own review for a specific product.
 *       Only the author of the review can update it. Supports partial updates.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product the review is associated with
 *         schema:
 *           type: string
 *           example: 6649e1095f11313fbd7cce40
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: ID of the review to be updated
 *         schema:
 *           type: string
 *           example: 6652f1095f11313fbd7ccf12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated comment: Still love the product!"
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                   example: Review updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input (e.g., malformed IDs or rating)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized (not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden (not the author of the review)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
