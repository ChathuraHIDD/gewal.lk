import mongoose from "mongoose";

import {
  Amenity,
  Property,
  PropertyAmenity,
  PropertyImage,
  PropertyLocation,
  PropertyVideo,
} from "../../models/propertyPlatform.models.js";

import { ApiError } from "../../utils/ApiError.js";
import { buildUniqueSlug } from "../../utils/slugify.js";

const toPublicFileUrl = (filename) => `/uploads/properties/${filename}`;

const linkAmenities = async ({ propertyId, amenityNames, session }) => {
  if (!amenityNames || amenityNames.length === 0) {
    return;
  }

  const amenityIds = await Promise.all(
    amenityNames.map(async (name) => {
      const amenity = await Amenity.findOneAndUpdate(
        { name },
        { $setOnInsert: { name } },
        { new: true, upsert: true, session }
      );

      return amenity._id;
    })
  );

  await PropertyAmenity.insertMany(
    amenityIds.map((amenityId) => ({ propertyId, amenityId })),
    { session }
  );
};

/**
 * Create a property listing together with its location,
 * uploaded images, amenities and optional video, atomically.
 */
export const createProperty = async ({ ownerId, payload, files }) => {
  const session = await mongoose.startSession();

  try {
    let createdProperty = null;

    await session.withTransaction(async () => {
      const [property] = await Property.create(
        [
          {
            ownerId,
            title: payload.title,
            slug: buildUniqueSlug(payload.title),
            description: payload.description,
            propertyType: payload.propertyType,
            listingType: payload.listingType,
            status: "Pending",
            approvalStatus: "Pending",
            price: payload.price,
            negotiable: payload.negotiable,
            bedrooms: payload.bedrooms,
            bathrooms: payload.bathrooms,
            buildingSize: payload.buildingSize,
            landSize: payload.landSize,
            ownershipType: payload.ownershipType,
            availableFrom: payload.availableFrom
              ? new Date(payload.availableFrom)
              : null,
            contactName: payload.contactName,
            contactPhone: payload.contactPhone,
            contactEmail: payload.contactEmail,
            seoTitle: payload.seoTitle,
            seoDescription: payload.seoDescription,
          },
        ],
        { session }
      );

      await PropertyLocation.create(
        [
          {
            propertyId: property._id,
            country: payload.location.country,
            province: payload.location.province,
            district: payload.location.district,
            city: payload.location.city,
            street: payload.location.street,
          },
        ],
        { session }
      );

      if (files && files.length > 0) {
        await PropertyImage.insertMany(
          files.map((file, index) => ({
            propertyId: property._id,
            imageUrl: toPublicFileUrl(file.filename),
            displayOrder: index,
            isCover: index === 0,
          })),
          { session }
        );
      }

      if (payload.videoUrl) {
        await PropertyVideo.create(
          [{ propertyId: property._id, videoUrl: payload.videoUrl }],
          { session }
        );
      }

      await linkAmenities({
        propertyId: property._id,
        amenityNames: payload.amenities,
        session,
      });

      createdProperty = property;
    });

    return createdProperty;
  } finally {
    await session.endSession();
  }
};

export const attachRelations = async (properties) => {
  const propertyIds = properties.map((property) => property._id);

  const [locations, coverImages] = await Promise.all([
    PropertyLocation.find({ propertyId: { $in: propertyIds } }),
    PropertyImage.find({
      propertyId: { $in: propertyIds },
      isCover: true,
    }),
  ]);

  const locationByPropertyId = new Map(
    locations.map((location) => [location.propertyId.toString(), location])
  );

  const coverImageByPropertyId = new Map(
    coverImages.map((image) => [image.propertyId.toString(), image])
  );

  return properties.map((property) => ({
    ...property.toObject(),
    location: locationByPropertyId.get(property._id.toString()) || null,
    coverImage:
      coverImageByPropertyId.get(property._id.toString())?.imageUrl || null,
  }));
};

/**
 * List published properties with basic filtering and pagination.
 */
export const listPublicProperties = async ({
  page = 1,
  limit = 12,
  propertyType,
  listingType,
  district,
  city,
  minPrice,
  maxPrice,
  search,
}) => {
  const filter = { status: "Published", approvalStatus: "Approved" };

  if (propertyType) filter.propertyType = propertyType;
  if (listingType) filter.listingType = listingType;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  let propertyIdsForLocation = null;

  if (district || city) {
    const locationFilter = {};
    if (district) locationFilter.district = district;
    if (city) locationFilter.city = city;

    const matchingLocations = await PropertyLocation.find(
      locationFilter,
      "propertyId"
    );

    propertyIdsForLocation = matchingLocations.map((location) => location.propertyId);
    filter._id = { $in: propertyIdsForLocation };
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Property.countDocuments(filter),
  ]);

  return {
    properties: await attachRelations(properties),
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
    },
  };
};

/**
 * List every property owned by the requesting user.
 */
export const listMyProperties = async (ownerId) => {
  const properties = await Property.find({ ownerId }).sort({ createdAt: -1 });

  return attachRelations(properties);
};

/**
 * List every property for admin moderation, optionally
 * filtered by approval status.
 */
export const listPropertiesForAdmin = async ({ approvalStatus } = {}) => {
  const filter = {};

  if (approvalStatus) {
    filter.approvalStatus = approvalStatus;
  }

  const properties = await Property.find(filter).sort({ createdAt: -1 });

  return attachRelations(properties);
};

/**
 * Approve or reject a submitted property listing.
 *
 * Approving moves the listing to "Published" so it becomes
 * visible on the public site; rejecting keeps it hidden.
 */
export const setPropertyApprovalStatus = async ({
  propertyId,
  approvalStatus,
}) => {
  const property = await Property.findByIdAndUpdate(
    propertyId,
    {
      approvalStatus,
      status: approvalStatus === "Approved" ? "Published" : "Rejected",
      publishedAt: approvalStatus === "Approved" ? new Date() : null,
    },
    { new: true }
  );

  if (!property) {
    throw new ApiError({
      statusCode: 404,
      message: "Property not found",
      code: "PROPERTY_NOT_FOUND",
    });
  }

  return property;
};

/**
 * Fetch a single property by its public slug, including
 * location, images, amenities and video.
 */
export const getPropertyBySlug = async (slug) => {
  const property = await Property.findOne({ slug });

  if (!property) {
    throw new ApiError({
      statusCode: 404,
      message: "Property not found",
      code: "PROPERTY_NOT_FOUND",
    });
  }

  const [location, images, video, propertyAmenities] = await Promise.all([
    PropertyLocation.findOne({ propertyId: property._id }),
    PropertyImage.find({ propertyId: property._id }).sort({ displayOrder: 1 }),
    PropertyVideo.findOne({ propertyId: property._id }),
    PropertyAmenity.find({ propertyId: property._id }).populate("amenityId"),
  ]);

  await Property.updateOne({ _id: property._id }, { $inc: { viewsCount: 1 } });

  return {
    ...property.toObject(),
    location,
    images,
    video,
    amenities: propertyAmenities.map((item) => item.amenityId),
  };
};
