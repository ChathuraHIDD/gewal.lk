import fs from "node:fs/promises";

import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createProperty as createPropertyService,
  getPropertyBySlug,
  listMyProperties,
  listPublicProperties,
} from "./property.service.js";

export const createProperty = asyncHandler(async (request, response) => {
  try {
    const property = await createPropertyService({
      ownerId: request.user._id,
      payload: request.propertyPayload,
      files: request.files,
    });

    return response.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message:
          "Property submitted successfully. It will go live after admin approval.",
        data: { property },
      })
    );
  } catch (error) {
    /*
     * Remove images already written to disk when the
     * database transaction did not succeed.
     */
    await Promise.all(
      (request.files || []).map((file) =>
        fs.unlink(file.path).catch(() => {})
      )
    );

    throw error;
  }
});

export const listProperties = asyncHandler(async (request, response) => {
  const result = await listPublicProperties(request.query);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Properties retrieved successfully",
      data: { properties: result.properties },
      meta: result.pagination,
    })
  );
});

export const listMyPropertyListings = asyncHandler(async (request, response) => {
  const properties = await listMyProperties(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Your properties retrieved successfully",
      data: { properties },
    })
  );
});

export const getProperty = asyncHandler(async (request, response) => {
  const property = await getPropertyBySlug(request.params.slug);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property retrieved successfully",
      data: { property },
    })
  );
});
