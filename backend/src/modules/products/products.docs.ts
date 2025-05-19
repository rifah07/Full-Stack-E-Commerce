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
