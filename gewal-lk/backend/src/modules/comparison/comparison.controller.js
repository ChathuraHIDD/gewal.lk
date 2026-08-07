import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  addToComparison,
  clearComparison,
  getComparison,
  removeFromComparison,
} from "./comparison.service.js";

export const getMyComparison = asyncHandler(async (request, response) => {
  const properties = await getComparison(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Comparison list retrieved successfully",
      data: { properties },
    })
  );
});

export const addComparisonItem = asyncHandler(async (request, response) => {
  const properties = await addToComparison({
    userId: request.user._id,
    propertyId: request.params.propertyId,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property added to comparison",
      data: { properties },
    })
  );
});

export const removeComparisonItem = asyncHandler(async (request, response) => {
  const properties = await removeFromComparison({
    userId: request.user._id,
    propertyId: request.params.propertyId,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property removed from comparison",
      data: { properties },
    })
  );
});

export const clearMyComparison = asyncHandler(async (request, response) => {
  const properties = await clearComparison(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Comparison list cleared",
      data: { properties },
    })
  );
});
