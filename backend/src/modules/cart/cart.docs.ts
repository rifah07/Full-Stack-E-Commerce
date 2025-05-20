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
 */