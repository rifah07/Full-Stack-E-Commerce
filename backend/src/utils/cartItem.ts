/**
 * Utility functions for safely handling cart item operations
 * with type safety
 */

/**
 * Helper function to safely get a string ID from a product object
 * that might come from different sources (populated or not)
 */
export const getProductId = (product: any): string | null => {
  if (!product) return null;

  // Handle case where product is already an ID string
  if (typeof product === "string") return product;

  // Handle ObjectId directly
  if (product.toString && typeof product.toString === "function") {
    return product.toString();
  }

  // Handle populated product document
  if (typeof product === "object") {
    // Handle _id property
    if ("_id" in product) {
      const id = product._id;
      if (id && typeof id.toString === "function") {
        return id.toString();
      }
    }

    // Handle id property (sometimes MongoDB ObjectId is accessed as .id)
    if ("id" in product && product.id) {
      if (typeof product.id === "string") return product.id;
      if (typeof product.id.toString === "function")
        return product.id.toString();
    }
  }

  return null;
};

/**
 * Safely compare two product IDs that might be in different formats
 */
export const isSameProduct = (product1: any, product2: any): boolean => {
  const id1 = getProductId(product1);
  const id2 = getProductId(product2);

  return !!id1 && !!id2 && id1 === id2;
};