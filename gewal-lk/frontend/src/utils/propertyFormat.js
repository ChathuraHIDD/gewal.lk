import { resolveMediaUrl } from "../services/propertyService.js";

export const placeholderPropertyImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85";

export const formatPropertyPrice = (property) => {
  const amount = `Rs. ${Number(property.price).toLocaleString()}`;
  return property.listingType === "Rent" || property.listingType === "Lease"
    ? `${amount} /mo`
    : amount;
};

export const formatPropertyLocation = (property) => {
  const { city, district } = property.location || {};
  return [city, district].filter(Boolean).join(", ") || "Sri Lanka";
};

export const formatPropertyArea = (property) => {
  if (property.buildingSize) return `${Number(property.buildingSize).toLocaleString()} sqft`;
  if (property.landSize) return `${Number(property.landSize).toLocaleString()} perches`;
  return "—";
};

/**
 * Map an API property document (from propertyService) into
 * the shape the demo-data-era <PropertyCard /> component expects.
 */
export const toPropertyCardShape = (property) => ({
  _id: property._id,
  id: property.slug,
  title: property.title,
  price: formatPropertyPrice(property),
  location: formatPropertyLocation(property),
  image: resolveMediaUrl(property.coverImage) || placeholderPropertyImage,
  images: property.images?.length
    ? property.images.map((image) => resolveMediaUrl(image.imageUrl))
    : undefined,
  listingType: property.listingType,
  propertyType: property.propertyType,
  beds: property.bedrooms,
  baths: property.bathrooms,
  area: formatPropertyArea(property),
  parking: property.parking,
  verified: property.approvalStatus === "Approved",
  featured: Boolean(property.featured),
});
