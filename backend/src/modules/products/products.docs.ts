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

/**
 * @openapi
 * /products/filteredProducts:
 *   get:
 *     summary: Get filtered products
 *     description: Returns a list of products based on filters like search, category, and price range. Admin users can also see deleted products.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name (case-insensitive).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter products by.
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price to filter.
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price to filter.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page.
 *     responses:
 *       200:
 *         description: Filtered list of products retrieved successfully
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
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/addProduct:
 *   post:
 *     summary: Create a new product
 *     description: Allows sellers or admins to create a new product.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Wireless Bluetooth Headphones"
 *               description:
 *                 type: string
 *                 example: "High-quality wireless headphones with noise cancellation."
 *               price:
 *                 type: number
 *                 example: 129.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               stock:
 *                 type: number
 *                 example: 50
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/images/headphone1.jpg"
 *               discount:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [percentage, fixed]
 *                     example: "percentage"
 *                   value:
 *                     type: number
 *                     example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Product created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not seller or admin)
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/deleted:
 *   get:
 *     summary: Get soft-deleted products
 *     description: Returns soft-deleted products. Admins can see all, sellers see only their own.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Soft-deleted products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Soft-deleted products fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not a seller or admin)
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Returns the details of a specific product by its MongoDB ObjectId.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/{productId}/questionsandanswers:
 *   get:
 *     summary: Get Questions and Answers for a Product
 *     description: Retrieves the list of questions and answers associated with a product.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: List of product questions and answers
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
 *                     qa:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                           question:
 *                             type: string
 *                           answer:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/{productId}/questions:
 *   post:
 *     summary: Ask a Question about a Product
 *     description: Allows an authenticated buyer to ask a question about a specific product.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 example: Is this product available in blue?
 *     responses:
 *       201:
 *         description: Question submitted successfully
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
 *                   example: Question submitted successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: object
 *                       properties:
 *                         question:
 *                           type: string
 *                           example: Is this product available in blue?
 *                         user:
 *                           type: string
 *                           example: 60c72b2f9b1d8b001c8e4df0
 *                         seller:
 *                           type: string
 *                           example: 60c72b2f9b1d8b001c8e4dee
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid input (e.g., missing or empty question)
 *       401:
 *         description: Unauthorized (login required)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/{productId}/discount:
 *   patch:
 *     summary: Update Product Discount
 *     description: Admin can update or remove discount from a product.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               value:
 *                 type: number
 *                 example: 20
 *             example:
 *               type: fixed
 *               value: 100
 *     responses:
 *       200:
 *         description: Product discount updated successfully
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
 *                   example: Product discount updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input (e.g., invalid discount type or value)
 *       401:
 *         description: Unauthorized (login required)
 *       403:
 *         description: Forbidden (not admin or not owner)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/myProducts:
 *   get:
 *     summary: Get Seller's Products
 *     description: Retrieve a paginated list of products created by the currently authenticated seller.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of seller's products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totalProducts:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (login required)
 *       403:
 *         description: Forbidden (only sellers can access)
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /products/seller/{productId}/discount:
 *   patch:
 *     summary: Update product discount
 *     description: Allows a seller to update or remove the discount of a product they own. Admins can also update any product's discount.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: The type of discount.
 *               value:
 *                 type: number
 *                 description: The discount value. Must be a non-negative number. Use `null` to remove discount.
 *             example:
 *               type: percentage
 *               value: 15
 *     responses:
 *       200:
 *         description: Product discount updated successfully.
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
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Product discount updated successfully
 *       400:
 *         description: Invalid input or product ID.
 *       401:
 *         description: Unauthorized or not logged in.
 *       403:
 *         description: Forbidden. User does not have permission to update this product.
 *       404:
 *         description: Product not found.
 */

/**
 * @openapi
 * /products/{productId}/questions/{questionId}/answer:
 *   patch:
 *     summary: Answer a question for a product
 *     description: Allows the seller of the product or an admin to answer a specific customer question.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product.
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to answer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *                 description: The answer to the question.
 *             example:
 *               answer: This product comes with a 1-year warranty.
 *     responses:
 *       200:
 *         description: Question answered successfully.
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
 *                   example: Question answered successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6632d4f7ab3e8f001ec74b17
 *                         question:
 *                           type: string
 *                           example: Does this support 4K resolution?
 *                         answer:
 *                           type: string
 *                           example: Yes, it supports 4K at 60Hz.
 *                         askedBy:
 *                           type: string
 *                           example: 6621a4ef8b0f1e23d0a81c5e
 *       400:
 *         description: Invalid product ID, question ID, or empty answer.
 *       401:
 *         description: Unauthorized or not logged in.
 *       403:
 *         description: Forbidden. User is not allowed to answer this question.
 *       404:
 *         description: Product or question not found.
 */

/**
 * @openapi
 * /products/{productId}:
 *   patch:
 *     summary: Update a product
 *     description: Allows the seller who owns the product or an admin to update product details like name, description, price, etc.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Samsung Galaxy S24
 *               description:
 *                 type: string
 *                 example: Latest flagship phone with AI camera.
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               category:
 *                 type: string
 *                 example: Smartphones
 *               stock:
 *                 type: number
 *                 example: 50
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Product updated successfully.
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized. User must be logged in.
 *       403:
 *         description: Forbidden. Only the seller who owns the product or an admin can update it.
 *       404:
 *         description: Product not found.
 */

/**
 * @openapi
 * /products/moveToTrash/{productId}:
 *   delete:
 *     summary: Soft delete a product (move to trash)
 *     description: Marks a product as deleted without removing it from the database. Only accessible by the seller who owns the product or an admin.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to soft delete
 *         example: "6639ac5f95d5896d2dfe15be"
 *     responses:
 *       200:
 *         description: Product successfully marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Product deleted (soft delete) successfully."
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden - User is not the seller of this product or an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */

/**
 * @openapi
 * /products/restoreProduct/{productId}:
 *   patch:
 *     summary: Restore a soft-deleted product from trash
 *     description: Restores a product that was previously marked as deleted. Only accessible by the seller who owns the product or an admin.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to restore
 *         example: "6639ac5f95d5896d2dfe15be"
 *     responses:
 *       200:
 *         description: Product successfully restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product restored successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Forbidden - User is not the seller of this product or an admin, or product is not in trash
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
