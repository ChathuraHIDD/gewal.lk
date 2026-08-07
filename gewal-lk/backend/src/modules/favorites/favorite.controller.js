import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  addFavorite as addFavoriteService,
  listFavoriteIds,
  listFavorites,
  removeFavorite as removeFavoriteService,
} from "./favorite.service.js";

export const getFavorites = asyncHandler(async (request, response) => {
  const properties = await listFavorites(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Saved properties retrieved successfully",
      data: { properties },
    })
  );
});

export const getFavoriteIds = asyncHandler(async (request, response) => {
  const propertyIds = await listFavoriteIds(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Saved property ids retrieved successfully",
      data: { propertyIds },
    })
  );
});

export const addFavorite = asyncHandler(async (request, response) => {
  await addFavoriteService({
    userId: request.user._id,
    propertyId: request.params.propertyId,
  });

  return response.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Property saved",
    })
  );
});

export const removeFavorite = asyncHandler(async (request, response) => {
  await removeFavoriteService({
    userId: request.user._id,
    propertyId: request.params.propertyId,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property removed from saved list",
    })
  );
});
