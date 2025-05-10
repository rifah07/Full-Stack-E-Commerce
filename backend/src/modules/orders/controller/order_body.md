API: http://localhost:5000/api/orders/placeOrder

1. Testing Direct Orders without address:
    {
    "useCart": false,
    "products": [
        {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 3
        }
    ],
    "paymentMethod": "cod"
    }

2. Direct Order with Address:
    {
    "useCart": false,
    "products": [
        {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 3
        }
    ],
    "paymentMethod": "cod",
    "shippingAddress": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94105",
        "country": "USA"
    }
    }

3. Ordering specific product(s) from the cart:

{
  "product": "60f8b1a2c3d4e5f6a7b8c9d0", // ID of the product in the cart
  "paymentMethod": "stripe" | "paypal" | "cod",
  "paymentMethodId": "stripe_payment_intent_id" | null, // Required for Stripe
  "shippingAddress": "User's provided shipping address string",
  "couponCode": "OPTIONAL_COUPON_CODE",
  "useCart": true // Explicitly indicate that the order is from the cart
}


4. Ordering the entire cart:

  {
  "paymentMethod": "stripe" | "paypal" | "cod",
  "paymentMethodId": "stripe_payment_intent_id" | null, // Required for Stripe
  "shippingAddress": "User's provided shipping address string",
  "couponCode": "OPTIONAL_COUPON_CODE",
  "useCart": true // Explicitly indicate that the order is from the cart
}

5. Ordering with a different payment method (Stripe - requires more setup): For specific Product from cart:
{
  "product": "60f8b1a2c3d4e5f6a7b8c9d0",
  "paymentMethod": "stripe",
  "paymentMethodId": "pi_12345abcdefg",
  "shippingAddress": "123 Main St, Anytown, USA",
  "couponCode": "SUMMER20",
  "useCart": true
}

1. Ordering with a different payment method (Stripe - requires more setup): For full cart:
    {
        "paymentMethod": "stripe",
        "quantity":1,
        "shippingAddress": "123 Main Street, New York, NY, USA" ,
        "paymentMethodId": "pm_1RLQgNRIm30GS1GnjDyEwtEw"
    }

1. Ordering with a different payment method (PayPal - requires more setup):

{
  "paymentMethod": "paypal",
  "paymentMethodId": null,
  "shippingAddress": "456 Oak Ave, Someville, USA",
  "product": "60f8b1a2c3d4e5f6a7b8c9d0", // ID of the product in the cart
  "quantity": 2,
  "useCart": true
}