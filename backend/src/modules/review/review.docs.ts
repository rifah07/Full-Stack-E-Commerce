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
