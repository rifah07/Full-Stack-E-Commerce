/**
 * @openapi
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the product in the cart
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity of the product in the cart
 *       example:
 *         product: "60d21b4667d0d8992e610c85"
 *         quantity: 2
 *     Cart:
 *       type: object
 *       required:
 *         - buyer
 *         - items
 *         - defaultShippingAddress
 *       properties:
 *         _id:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Unique identifier for the cart
 *         buyer:
 *           type: string
 *           format: mongoose.ObjectId
 *           description: Reference to the user who owns the cart
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *           description: List of items in the cart
 *         defaultShippingAddress:
 *           type: string
 *           description: Default shipping address for the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the cart was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         buyer: "60d21b4667d0d8992e610c86"
 *         items: [
 *           {
 *             product: "60d21b4667d0d8992e610c87",
 *             quantity: 1
 *           },
 *           {
 *             product: "60d21b4667d0d8992e610c88",
 *             quantity: 3
 *           }
 *         ]
 *         defaultShippingAddress: "123 Main St, Anytown, USA"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-02T00:00:00.000Z"
 *
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     description: Adds a product to the user's cart. Creates a new cart if one doesn't exist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: mongoose.ObjectId
 *                 description: ID of the product to add to cart
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity of the product to add
 *               shippingAddress:
 *                 type: string
 *                 description: Optional shipping address (used only when creating a new cart)
 *           example:
 *             productId: "60d21b4667d0d8992e610c87"
 *             quantity: 2
 *             shippingAddress: "456 Oak St, Anytown, USA"
 *     responses:
 *       200:
 *         description: Product successfully added to cart
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
 *                   example: Product added to cart
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request - Invalid product ID, quantity, or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Only 5 items in stock
 *       401:
 *         description: Unauthorized - User not authenticated or not a buyer
 *       404:
 *         description: Not found - Product or user not found
 *       500:
 *         description: Server error
 * 
 * /cart/my-cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves the authenticated user's cart with populated product details, quantities, and calculated total amount
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
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
 *                   example: Cart retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: string
 *                       format: mongoose.ObjectId
 *                       description: The unique identifier of the cart
 *                     items:
 *                       type: array
 *                       description: Array of cart items with product details
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             format: mongoose.ObjectId
 *                             description: ID of the product
 *                           name:
 *                             type: string
 *                             description: Name of the product
 *                           price:
 *                             type: number
 *                             description: Price of the product
 *                           stock:
 *                             type: number
 *                             description: Available stock of the product
 *                           imageUrl:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Images of the product
 *                           quantity:
 *                             type: number
 *                             description: Quantity of the product in the cart
 *                           subtotal:
 *                             type: number
 *                             description: Price × quantity for this item
 *                     totalAmount:
 *                       type: number
 *                       description: Total cost of all items in the cart
 *                     shippingAddress:
 *                       type: string
 *                       description: Default shipping address for this cart
 *               example:
 *                 status: "success"
 *                 message: "Cart retrieved successfully"
 *                 data:
 *                   cartId: "60d21b4667d0d8992e610c85"
 *                   items:
 *                     - productId: "60d21b4667d0d8992e610c87"
 *                       name: "Smartphone X"
 *                       price: 999.99
 *                       stock: 15
 *                       imageUrl: ["https://example.com/smartphone-x-1.jpg", "https://example.com/smartphone-x-2.jpg"]
 *                       quantity: 1
 *                       subtotal: 999.99
 *                     - productId: "60d21b4667d0d8992e610c88"
 *                       name: "Wireless Earbuds"
 *                       price: 129.99
 *                       stock: 42
 *                       imageUrl: ["https://example.com/earbuds-1.jpg"]
 *                       quantity: 2
 *                       subtotal: 259.98
 *                   totalAmount: 1259.97
 *                   shippingAddress: "123 Main St, Anytown, USA"
 *       401:
 *         description: Unauthorized - User not authenticated or not a buyer
 *       404:
 *         description: Not found - Cart is empty or doesn't exist
 *       500:
 *         description: Server error
 */