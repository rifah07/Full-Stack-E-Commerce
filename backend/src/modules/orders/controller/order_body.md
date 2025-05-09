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
        "products": [
        {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 3
        }
    ],
        "paymentMethod": "cod",
        "shippingAddress": "123 Main Street, New York, NY, USA" 
    }


4. Ordering the entire cart:

    {
        "paymentMethod": "cod",
        "shippingAddress": "123 Main Street, New York, NY, USA"
    }

5. Ordering with a different payment method (Stripe - requires more setup): For specific Product from cart:
    {
    "products": [
        {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 3
        }
    ],    
    "paymentMethod": "stripe",
    "shippingAddress": "123 Main Street, New York, NY, USA" ,
    "paymentMethodId": "pm_1RLQgNRIm30GS1GnjDyEwtEw" // Example Stripe PaymentMethod ID
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
    "products": [
        {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 3
        }
    ],
        "paymentMethod": "paypal",
        "shippingAddress": "123 Main Street, New York, NY, USA" 

        // might need additional PayPal specific data here depending on implementation
    }