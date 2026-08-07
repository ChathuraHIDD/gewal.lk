import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createAdmin as createAdminService,
  deleteAdmin as deleteAdminService,
  listAdmins,
} from "./admin.service.js";

import {
  listPropertiesForAdmin,
  setPropertyApprovalStatus,
} from "../property/property.service.js";

export const getAdmins = asyncHandler(async (request, response) => {
  const admins = await listAdmins();

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Admin accounts retrieved successfully",
      data: { admins },
    })
  );
});

export const createAdmin = asyncHandler(async (request, response) => {
  const admin = await createAdminService(request.body);

  return response.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Admin account created successfully",
      data: { admin },
    })
  );
});

export const deleteAdmin = asyncHandler(async (request, response) => {
  await deleteAdminService({
    adminId: request.params.id,
    requestingUserId: request.user._id,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Admin account deleted successfully",
    })
  );
});

export const listProperties = asyncHandler(async (request, response) => {
  const properties = await listPropertiesForAdmin({
    approvalStatus: request.query.approvalStatus,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Properties retrieved successfully",
      data: { properties },
    })
  );
});

export const approveProperty = asyncHandler(async (request, response) => {
  const property = await setPropertyApprovalStatus({
    propertyId: request.params.id,
    approvalStatus: "Approved",
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property approved and published",
      data: { property },
    })
  );
});

export const rejectProperty = asyncHandler(async (request, response) => {
  const property = await setPropertyApprovalStatus({
    propertyId: request.params.id,
    approvalStatus: "Rejected",
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Property rejected",
      data: { property },
    })
  );
});
