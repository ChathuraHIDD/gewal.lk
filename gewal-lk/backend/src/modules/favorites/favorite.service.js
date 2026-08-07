import { Favorite, Property } from "../../models/propertyPlatform.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { attachRelations } from "../property/property.service.js";

export const listFavorites = async (userId) => {
  const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
  const propertyIds = favorites.map((favorite) => favorite.propertyId);

  const properties = await Property.find({ _id: { $in: propertyIds } });
  const enriched = await attachRelations(properties);
  const propertyById = new Map(enriched.map((property) => [property._id.toString(), property]));

  return favorites
    .map((favorite) => propertyById.get(favorite.propertyId.toString()))
    .filter(Boolean);
};

export const listFavoriteIds = async (userId) => {
  const favorites = await Favorite.find({ userId }).select("propertyId");

  return favorites.map((favorite) => favorite.propertyId.toString());
};

export const addFavorite = async ({ userId, propertyId }) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new ApiError({
      statusCode: 404,
      message: "Property not found",
      code: "PROPERTY_NOT_FOUND",
    });
  }

  try {
    await Favorite.create({ userId, propertyId });
    await Property.updateOne({ _id: propertyId }, { $inc: { favoriteCount: 1 } });
  } catch (error) {
    /*
     * Unique {userId, propertyId} index — already saved, treat as a no-op.
     */
    if (error.code !== 11000) {
      throw error;
    }
  }
};

export const removeFavorite = async ({ userId, propertyId }) => {
  const result = await Favorite.deleteOne({ userId, propertyId });

  if (result.deletedCount > 0) {
    await Property.updateOne(
      { _id: propertyId, favoriteCount: { $gt: 0 } },
      { $inc: { favoriteCount: -1 } }
    );
  }
};
