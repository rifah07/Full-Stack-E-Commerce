Scenario 1: Ordering specific product(s) from the cart:

{
    "paymentMethod": "cod",
    "shippingAddress": "123 Main Street, New York, NY, USA"
}


Scenario 2: Ordering the entire cart:

{
    "paymentMethod": "cod",

    "shippingAddress": {

        "street": "456 Oak Ave",

        "city": "Otherville",

        "state": "NY",

        "zip": "10001",

        "country": "USA"

    }
}

Scenario 3: Ordering with a different payment method (Stripe - requires more setup):

{
    "productId": "<product_id>",

    "quantity": 1,

    "paymentMethod": "stripe",

    "shippingAddress": {

        "street": "...",

        "city": "...",

        "state": "...",

        "zip": "...",

        "country": "..."
        
    },

    "paymentMethodId": "pm_xxxxxxxxxxxxxxxxx" // Example Stripe PaymentMethod ID
}


Scenario 4: Ordering with a different payment method (PayPal - requires more setup):

{
    "productId": "<product_id>",

    "quantity": 1,

    "paymentMethod": "paypal",

    "shippingAddress": {

        "street": "...",

        "city": "...",

        "state": "...",

        "zip": "...",

        "country": "..."

    },

    // might need additional PayPal specific data here depending on implementation
}