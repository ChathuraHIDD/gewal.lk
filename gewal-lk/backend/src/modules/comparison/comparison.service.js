import { ComparisonItem, ComparisonList, Property } from "../../models/propertyPlatform.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { attachRelations } from "../property/property.service.js";

export const MAX_COMPARISON_ITEMS = 4;

const getOrCreateComparisonList = async (userId) => {
  let list = await ComparisonList.findOne({ userId });

  if (!list) {
    list = await ComparisonList.create({ userId });
  }

  return list;
};

export const getComparison = async (userId) => {
  const list = await getOrCreateComparisonList(userId);
  const items = await ComparisonItem.find({ comparisonListId: list._id }).sort({ createdAt: 1 });

  const propertyIds = items.map((item) => item.propertyId);
  const properties = await Property.find({ _id: { $in: propertyIds } });
  const enriched = await attachRelations(properties);
  const propertyById = new Map(enriched.map((property) => [property._id.toString(), property]));

  /*
   * Preserve the order properties were added in, and silently drop
   * any item whose property no longer exists.
   */
  return items
    .map((item) => propertyById.get(item.propertyId.toString()))
    .filter(Boolean);
};

export const addToComparison = async ({ userId, propertyId }) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new ApiError({
      statusCode: 404,
      message: "Property not found",
      code: "PROPERTY_NOT_FOUND",
    });
  }

  const list = await getOrCreateComparisonList(userId);
  const count = await ComparisonItem.countDocuments({ comparisonListId: list._id });
  const alreadyAdded = await ComparisonItem.exists({ comparisonListId: list._id, propertyId });

  if (!alreadyAdded && count >= MAX_COMPARISON_ITEMS) {
    throw new ApiError({
      statusCode: 422,
      message: `You can only compare up to ${MAX_COMPARISON_ITEMS} properties at a time`,
      code: "COMPARISON_LIMIT_REACHED",
    });
  }

  try {
    await ComparisonItem.create({ comparisonListId: list._id, propertyId });
  } catch (error) {
    /*
     * Unique {comparisonListId, propertyId} index — already in the
     * list, treat as a no-op.
     */
    if (error.code !== 11000) {
      throw error;
    }
  }

  return getComparison(userId);
};

export const removeFromComparison = async ({ userId, propertyId }) => {
  const list = await getOrCreateComparisonList(userId);
  await ComparisonItem.deleteOne({ comparisonListId: list._id, propertyId });

  return getComparison(userId);
};

export const clearComparison = async (userId) => {
  const list = await getOrCreateComparisonList(userId);
  await ComparisonItem.deleteMany({ comparisonListId: list._id });

  return [];
};
