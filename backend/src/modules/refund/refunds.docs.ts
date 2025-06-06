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
/**
 * @swagger
 * /refunds:
 *   get:
 *     summary: Get all refund requests
 *     tags:
 *       - Refunds
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves a list of refund requests.
 *       - **Admin** users get all refund requests.
 *       - **Sellers** only get their own refund requests.
 *     responses:
 *       200:
 *         description: List of refund requests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totalRefundRequests:
 *                   type: integer
 *                   example: 5
 *                 statusCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example:
 *                     pending: 2
 *                     approved: 1
 *                     rejected: 1
 *                     refunded: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     refunds:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Refund'
 *       401:
 *         description: Unauthorized or invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden. User does not have permission.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 */

/**
 * @swagger
 * /refunds/me:
 *   get:
 *     summary: Get refund requests for the logged-in buyer
 *     tags:
 *       - Refunds
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves refund requests made by the currently logged-in **buyer**.
 *     responses:
 *       200:
 *         description: Refund requests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totalRefundRequests:
 *                   type: integer
 *                   example: 3
 *                 statusCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example:
 *                     pending: 1
 *                     approved: 1
 *                     refunded: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     refunds:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Refund'
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden. Only buyers can access this route.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 */

/**
 * @swagger
 * /refunds/request/{orderId}:
 *   post:
 *     summary: Submit a refund request for an order
 *     tags:
 *       - Refunds
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The MongoDB ID of the order to refund.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Received a damaged product
 *     description: |
 *       Allows a **buyer** to request a refund for one of their orders.
 *       - Prevents duplicate requests with status `pending`.
 *       - Automatically sets refund status on the order.
 *     responses:
 *       201:
 *         description: Refund request submitted successfully.
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
 *                   example: Refund request submitted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     refund:
 *                       $ref: '#/components/schemas/Refund'
 *       400:
 *         description: Invalid input, duplicate request, or bad order ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized. Login required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden. Only buyers can access this route.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Order not found or does not belong to the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
/**
 * @swagger
 * /refunds/{refundId}:
 *   get:
 *     summary: Get details of a specific refund request
 *     tags:
 *       - Refunds
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: refundId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The MongoDB ID of the refund request to retrieve.
 *     description: |
 *       Retrieves detailed information about a specific refund request.
 *       - **Admin** users can access any refund request.
 *       - **Sellers** can access refund requests relevant to their products.
 *     responses:
 *       200:
 *         description: Refund request retrieved successfully.
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
 *                     refund:
 *                       $ref: '#/components/schemas/Refund'
 *       400:
 *         description: Invalid refund ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized. Login required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden. Only admin or seller can access.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Refund request not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
/**
 * @swagger
 * /refunds/{refundId}:
 *   patch:
 *     summary: Update the status of a refund request
 *     tags:
 *       - Refunds
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: refundId
 *         in: path
 *         required: true
 *         description: The ID of the refund request to update
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refundStatus
 *             properties:
 *               refundStatus:
 *                 type: string
 *                 enum: [pending, approved, rejected, refunded]
 *                 example: approved
 *     description: |
 *       Allows **admin** or **seller** to update the status of a refund request.
 *       - If status is set to `approved`, a refund can be initiated via the payment gateway.
 *       - Automatically updates the associated order’s refund status as well.
 *     responses:
 *       200:
 *         description: Refund status updated successfully.
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
 *                   example: Refund request updated to approved
 *                 data:
 *                   type: object
 *                   properties:
 *                     refund:
 *                       $ref: '#/components/schemas/Refund'
 *       400:
 *         description: Invalid refund ID or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Unauthorized. Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden. Only admin or seller can perform this action.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Refund request not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */