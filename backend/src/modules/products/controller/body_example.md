1. Add a percentage discount:
 {
  "type": "percentage",
  "value": 10
}

2. Add a fixed ammount discount:
 {
  "type": "fixed",
  "value": 10
 }

3. Add a eemove the discount:
 {
  "value": null
 }

4. Add body while crearing product: {
  "name": "New Product",
  "description": "...",
  "price": 100,
  "stock": 50,
  "category": "...",
  "imageUrl": "...",
  "discount": { // Optional discount object
    "type": "percentage", // "percentage" or "fixed"
    "value": 15           // The discount value
  }
}