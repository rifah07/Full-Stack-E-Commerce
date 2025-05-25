/**
 * @swagger
 * components:
 *   schemas:
 *     Refund:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: "6631c10e0d3d8a37f9df2321"
 *         order:
 *           type: string
 *           format: ObjectId
 *           description: ID of the associated order
 *           example: "6631c0ab0d3d8a37f9df231a"
 *         user:
 *           type: string
 *           format: ObjectId
 *           description: ID of the user who requested the refund
 *           example: "6631bfa70d3d8a37f9df2309"
 *         reason:
 *           type: string
 *           example: "Product was damaged on arrival"
 *         requestedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T12:34:56.000Z"
 *         refundStatus:
 *           type: string
 *           enum: [none, pending, approved, rejected, refunded]
 *           example: "pending"
 *         processedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-05-23T09:00:00.000Z"
 *         processedBy:
 *           type: string
 *           format: ObjectId
 *           nullable: true
 *           description: Admin user ID who processed the refund
 *           example: "6631c11f0d3d8a37f9df2334"
 *         refundAmount:
 *           type: number
 *           format: float
 *           example: 25.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T12:34:56.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T12:35:10.000Z"
 */
