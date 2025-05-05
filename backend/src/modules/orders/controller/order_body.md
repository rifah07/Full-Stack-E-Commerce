1. Ordering specific product(s) from the cart:

{
    "product": "<productId>",
    "paymentMethod": "cod",
    "quantity":1,
    "shippingAddress": "123 Main Street, New York, NY, USA" 
}


2. Ordering the entire cart:

{
    "paymentMethod": "cod",
    "shippingAddress": "123 Main Street, New York, NY, USA"
}

3. Ordering with a different payment method (Stripe - requires more setup): For specific Product:
{
    "product": "<productId>",
    "paymentMethod": "stripe",
    "quantity":1,
    "shippingAddress": "123 Main Street, New York, NY, USA" ,
    "paymentMethodId": "pm_1RLQgNRIm30GS1GnjDyEwtEw" // Example Stripe PaymentMethod ID
}

4. Ordering with a different payment method (Stripe - requires more setup): For full cart:
{
    "paymentMethod": "stripe",
    "quantity":1,
    "shippingAddress": "123 Main Street, New York, NY, USA" ,
    "paymentMethodId": "pm_1RLQgNRIm30GS1GnjDyEwtEw"
}

5. Ordering with a different payment method (PayPal - requires more setup):

{
    "product": "680fca599e0429f6ee517386",
    "paymentMethod": "paypal",
    "quantity":1,
    "shippingAddress": "123 Main Street, New York, NY, USA" 

    // might need additional PayPal specific data here depending on implementation
}