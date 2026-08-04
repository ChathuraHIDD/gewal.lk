import mongoose from "mongoose";

const { Schema } = mongoose;
const objectId = Schema.Types.ObjectId;

const schemaOptions = (collection) => ({
  timestamps: true,
  versionKey: false,
  collection,
});

const locationFields = {
  country: { type: String, trim: true, default: "Sri Lanka", index: true },
  province: { type: String, trim: true, default: null, index: true },
  district: { type: String, trim: true, default: null, index: true },
  city: { type: String, trim: true, default: null, index: true },
  postalCode: { type: String, trim: true, default: null, index: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
};

const userAddressSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    ...locationFields,
    address: { type: String, trim: true, required: true },
  },
  schemaOptions("user_addresses")
);

const agencySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    logo: { type: String, default: null },
    email: { type: String, trim: true, lowercase: true, default: null },
    phone: { type: String, trim: true, default: null },
    website: { type: String, trim: true, default: null },
    address: { type: String, trim: true, default: null },
    district: { type: String, trim: true, default: null, index: true },
    city: { type: String, trim: true, default: null, index: true },
    description: { type: String, trim: true, default: "" },
    verified: { type: Boolean, default: false, index: true },
  },
  schemaOptions("agencies")
);

const agentProfileSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, unique: true },
    agencyId: { type: objectId, ref: "Agency", default: null, index: true },
    agencyName: { type: String, trim: true, default: null },
    licenseNumber: { type: String, trim: true, default: null, index: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    specialization: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    about: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: null },
    facebook: { type: String, trim: true, default: null },
    linkedin: { type: String, trim: true, default: null },
    instagram: { type: String, trim: true, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    totalProperties: { type: Number, default: 0, min: 0 },
    soldProperties: { type: Number, default: 0, min: 0 },
    rentProperties: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false, index: true },
  },
  schemaOptions("agent_profiles")
);

const propertySchema = new Schema(
  {
    ownerId: { type: objectId, ref: "User", required: true, index: true },
    agentId: { type: objectId, ref: "User", default: null, index: true },
    agencyId: { type: objectId, ref: "Agency", default: null, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ["House", "Apartment", "Land", "Commercial", "Villa", "Office", "Shop", "Warehouse", "Annexe"],
      required: true,
      index: true,
    },
    listingType: { type: String, enum: ["Sale", "Rent", "Lease"], required: true, index: true },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Published", "Sold", "Rented", "Expired", "Rejected"],
      default: "Draft",
      index: true,
    },
    approvalStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
    price: { type: Number, required: true, min: 0, index: true },
    currency: { type: String, default: "LKR", uppercase: true },
    negotiable: { type: Boolean, default: false },
    landSize: { type: Number, default: null, min: 0 },
    buildingSize: { type: Number, default: null, min: 0 },
    bedrooms: { type: Number, default: 0, min: 0, index: true },
    bathrooms: { type: Number, default: 0, min: 0, index: true },
    floors: { type: Number, default: null, min: 0 },
    parking: { type: Number, default: 0, min: 0 },
    yearBuilt: { type: Number, default: null, min: 1800 },
    furnished: { type: String, enum: ["Furnished", "Semi Furnished", "Unfurnished", "Not Applicable"], default: "Not Applicable" },
    ownershipType: { type: String, trim: true, default: null },
    availableFrom: { type: Date, default: null },
    viewsCount: { type: Number, default: 0, min: 0 },
    favoriteCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    contactName: { type: String, trim: true, default: null },
    contactPhone: { type: String, trim: true, default: null },
    contactEmail: { type: String, trim: true, lowercase: true, default: null },
    seoTitle: { type: String, trim: true, default: null },
    seoDescription: { type: String, trim: true, default: null },
    featured: { type: Boolean, default: false, index: true },
    premium: { type: Boolean, default: false, index: true },
    urgentSale: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null, index: true },
    expiresAt: { type: Date, default: null, index: true },
  },
  schemaOptions("properties")
);
propertySchema.index({ title: "text", description: "text" });
propertySchema.index({ propertyType: 1, listingType: 1, status: 1, price: 1 });

const propertyLocationSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, unique: true },
    ...locationFields,
    area: { type: String, trim: true, default: null, index: true },
    street: { type: String, trim: true, default: null },
    googlePlaceId: { type: String, trim: true, default: null, index: true },
    coordinates: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number], default: undefined },
    },
  },
  schemaOptions("property_locations")
);
propertyLocationSchema.index({ coordinates: "2dsphere" }, { sparse: true });
propertyLocationSchema.index({ country: 1, province: 1, district: 1, city: 1, area: 1 });

const propertyImageSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    imageUrl: { type: String, required: true },
    thumbnail: { type: String, default: null },
    displayOrder: { type: Number, default: 0 },
    isCover: { type: Boolean, default: false, index: true },
  },
  schemaOptions("property_images")
);
propertyImageSchema.index({ propertyId: 1, displayOrder: 1 });

const propertyVideoSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    videoUrl: { type: String, required: true },
  },
  schemaOptions("property_videos")
);

const propertyFloorPlanSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
  },
  schemaOptions("property_floor_plans")
);

const amenitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: null },
  },
  schemaOptions("amenities")
);

const propertyAmenitySchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    amenityId: { type: objectId, ref: "Amenity", required: true, index: true },
  },
  schemaOptions("property_amenities")
);
propertyAmenitySchema.index({ propertyId: 1, amenityId: 1 }, { unique: true });

const nearbyPlaceSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    placeName: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, index: true },
    distance: { type: Number, default: null, min: 0 },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  schemaOptions("property_nearby_places")
);

const savedSearchSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    searchJson: { type: Schema.Types.Mixed, required: true },
    alertEnabled: { type: Boolean, default: false, index: true },
  },
  schemaOptions("saved_searches")
);

const favoriteSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
  },
  schemaOptions("favorites")
);
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const appointmentSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    buyerId: { type: objectId, ref: "User", required: true, index: true },
    agentId: { type: objectId, ref: "User", default: null, index: true },
    appointmentDate: { type: Date, required: true, index: true },
    appointmentTime: { type: String, required: true },
    message: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"], default: "Pending", index: true },
    confirmedAt: { type: Date, default: null },
    cancelReason: { type: String, trim: true, default: null },
  },
  schemaOptions("appointments")
);

const agentReviewSchema = new Schema(
  {
    agentId: { type: objectId, ref: "User", required: true, index: true },
    userId: { type: objectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, default: "" },
  },
  schemaOptions("agent_reviews")
);
agentReviewSchema.index({ agentId: 1, userId: 1 }, { unique: true });

const propertyReviewSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    userId: { type: objectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, default: "" },
  },
  schemaOptions("property_reviews")
);
propertyReviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

const conversationSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    buyerId: { type: objectId, ref: "User", required: true, index: true },
    sellerId: { type: objectId, ref: "User", required: true, index: true },
    lastMessageAt: { type: Date, default: null, index: true },
  },
  schemaOptions("conversations")
);
conversationSchema.index({ propertyId: 1, buyerId: 1, sellerId: 1 }, { unique: true });

const messageSchema = new Schema(
  {
    conversationId: { type: objectId, ref: "Conversation", required: true, index: true },
    senderId: { type: objectId, ref: "User", required: true, index: true },
    message: { type: String, trim: true, default: "" },
    attachment: { type: String, default: null },
    isSeen: { type: Boolean, default: false, index: true },
  },
  schemaOptions("messages")
);

const notificationSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, index: true },
    isRead: { type: Boolean, default: false, index: true },
  },
  schemaOptions("notifications")
);

const reportSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    reportedBy: { type: objectId, ref: "User", required: true, index: true },
    reason: { type: String, enum: ["Spam", "Fake", "Duplicate", "Wrong Price", "Sold Already", "Other"], required: true },
    description: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Pending", "Reviewed", "Resolved", "Rejected"], default: "Pending", index: true },
  },
  schemaOptions("reports")
);

const propertyViewSchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    userId: { type: objectId, ref: "User", default: null, index: true },
    ip: { type: String, default: null },
    device: { type: String, default: null },
    country: { type: String, default: null },
    viewedAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false, collection: "property_views" }
);

const recentlyViewedSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    viewedAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false, collection: "recently_viewed" }
);
recentlyViewedSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const comparisonListSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
  },
  schemaOptions("comparison_lists")
);

const comparisonItemSchema = new Schema(
  {
    comparisonListId: { type: objectId, ref: "ComparisonList", required: true, index: true },
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
  },
  schemaOptions("comparison_items")
);
comparisonItemSchema.index({ comparisonListId: 1, propertyId: 1 }, { unique: true });

const priceHistorySchema = new Schema(
  {
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
    oldPrice: { type: Number, required: true, min: 0 },
    newPrice: { type: Number, required: true, min: 0 },
    changedBy: { type: objectId, ref: "User", required: true, index: true },
    changedAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false, collection: "price_history" }
);

const planSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    featuredAds: { type: Number, default: 0, min: 0 },
    maxProperties: { type: Number, default: 0, min: 0 },
    prioritySupport: { type: Boolean, default: false },
  },
  schemaOptions("plans")
);

const subscriptionSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    planId: { type: objectId, ref: "Plan", required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
    status: { type: String, enum: ["Active", "Expired", "Cancelled", "Pending"], default: "Pending", index: true },
  },
  schemaOptions("subscriptions")
);

const paymentSchema = new Schema(
  {
    subscriptionId: { type: objectId, ref: "Subscription", default: null, index: true },
    userId: { type: objectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "LKR", uppercase: true },
    gateway: { type: String, required: true, trim: true },
    transactionId: { type: String, trim: true, default: null, index: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded", "Cancelled"], default: "Pending", index: true },
    paidAt: { type: Date, default: null },
  },
  schemaOptions("payments")
);

const advertisementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    link: { type: String, default: null },
    position: { type: String, required: true, trim: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
    status: { type: String, enum: ["Active", "Inactive", "Expired"], default: "Inactive", index: true },
  },
  schemaOptions("advertisements")
);

const blogCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, trim: true, default: "" },
  },
  schemaOptions("blog_categories")
);

const blogSchema = new Schema(
  {
    categoryId: { type: objectId, ref: "BlogCategory", required: true, index: true },
    authorId: { type: objectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, required: true },
    coverImage: { type: String, default: null },
    status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft", index: true },
    seoTitle: { type: String, trim: true, default: null },
    seoDescription: { type: String, trim: true, default: null },
    publishedAt: { type: Date, default: null, index: true },
  },
  schemaOptions("blogs")
);
blogSchema.index({ title: "text", excerpt: "text", content: "text" });

const blogCommentSchema = new Schema(
  {
    blogId: { type: objectId, ref: "Blog", required: true, index: true },
    userId: { type: objectId, ref: "User", default: null, index: true },
    name: { type: String, trim: true, default: null },
    email: { type: String, trim: true, lowercase: true, default: null },
    comment: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Spam"], default: "Pending", index: true },
  },
  schemaOptions("blog_comments")
);

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: null },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["New", "Open", "Closed", "Spam"], default: "New", index: true },
  },
  schemaOptions("contact_messages")
);

const activityLogSchema = new Schema(
  {
    adminId: { type: objectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, trim: true },
    tableName: { type: String, required: true, trim: true, index: true },
    recordId: { type: objectId, default: null, index: true },
    ip: { type: String, default: null },
  },
  schemaOptions("activity_logs")
);

const wishlistSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  schemaOptions("wishlist")
);

const wishlistItemSchema = new Schema(
  {
    wishlistId: { type: objectId, ref: "Wishlist", required: true, index: true },
    propertyId: { type: objectId, ref: "Property", required: true, index: true },
  },
  schemaOptions("wishlist_items")
);
wishlistItemSchema.index({ wishlistId: 1, propertyId: 1 }, { unique: true });

const userPreferenceSchema = new Schema(
  {
    userId: { type: objectId, ref: "User", required: true, unique: true },
    preferredLocation: { type: String, trim: true, default: null },
    budgetMin: { type: Number, default: null, min: 0 },
    budgetMax: { type: Number, default: null, min: 0 },
    propertyType: { type: String, trim: true, default: null },
    bedrooms: { type: Number, default: null, min: 0 },
    bathrooms: { type: Number, default: null, min: 0 },
  },
  schemaOptions("user_preferences")
);

const seoPageSchema = new Schema(
  {
    page: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    ogImage: { type: String, default: null },
  },
  schemaOptions("seo_pages")
);

export const UserAddress = mongoose.models.UserAddress || mongoose.model("UserAddress", userAddressSchema);
export const Agency = mongoose.models.Agency || mongoose.model("Agency", agencySchema);
export const AgentProfile = mongoose.models.AgentProfile || mongoose.model("AgentProfile", agentProfileSchema);
export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
export const PropertyLocation = mongoose.models.PropertyLocation || mongoose.model("PropertyLocation", propertyLocationSchema);
export const PropertyImage = mongoose.models.PropertyImage || mongoose.model("PropertyImage", propertyImageSchema);
export const PropertyVideo = mongoose.models.PropertyVideo || mongoose.model("PropertyVideo", propertyVideoSchema);
export const PropertyFloorPlan = mongoose.models.PropertyFloorPlan || mongoose.model("PropertyFloorPlan", propertyFloorPlanSchema);
export const Amenity = mongoose.models.Amenity || mongoose.model("Amenity", amenitySchema);
export const PropertyAmenity = mongoose.models.PropertyAmenity || mongoose.model("PropertyAmenity", propertyAmenitySchema);
export const PropertyNearbyPlace = mongoose.models.PropertyNearbyPlace || mongoose.model("PropertyNearbyPlace", nearbyPlaceSchema);
export const SavedSearch = mongoose.models.SavedSearch || mongoose.model("SavedSearch", savedSearchSchema);
export const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
export const AgentReview = mongoose.models.AgentReview || mongoose.model("AgentReview", agentReviewSchema);
export const PropertyReview = mongoose.models.PropertyReview || mongoose.model("PropertyReview", propertyReviewSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export const PropertyView = mongoose.models.PropertyView || mongoose.model("PropertyView", propertyViewSchema);
export const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model("RecentlyViewed", recentlyViewedSchema);
export const ComparisonList = mongoose.models.ComparisonList || mongoose.model("ComparisonList", comparisonListSchema);
export const ComparisonItem = mongoose.models.ComparisonItem || mongoose.model("ComparisonItem", comparisonItemSchema);
export const PriceHistory = mongoose.models.PriceHistory || mongoose.model("PriceHistory", priceHistorySchema);
export const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export const Advertisement = mongoose.models.Advertisement || mongoose.model("Advertisement", advertisementSchema);
export const BlogCategory = mongoose.models.BlogCategory || mongoose.model("BlogCategory", blogCategorySchema);
export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export const BlogComment = mongoose.models.BlogComment || mongoose.model("BlogComment", blogCommentSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactMessageSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
export const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
export const WishlistItem = mongoose.models.WishlistItem || mongoose.model("WishlistItem", wishlistItemSchema);
export const UserPreference = mongoose.models.UserPreference || mongoose.model("UserPreference", userPreferenceSchema);
export const SeoPage = mongoose.models.SeoPage || mongoose.model("SeoPage", seoPageSchema);

export const platformModels = [
  UserAddress,
  Agency,
  AgentProfile,
  Property,
  PropertyLocation,
  PropertyImage,
  PropertyVideo,
  PropertyFloorPlan,
  Amenity,
  PropertyAmenity,
  PropertyNearbyPlace,
  SavedSearch,
  Favorite,
  Appointment,
  AgentReview,
  PropertyReview,
  Conversation,
  Message,
  Notification,
  Report,
  PropertyView,
  RecentlyViewed,
  ComparisonList,
  ComparisonItem,
  PriceHistory,
  Plan,
  Subscription,
  Payment,
  Advertisement,
  BlogCategory,
  Blog,
  BlogComment,
  ContactMessage,
  ActivityLog,
  Wishlist,
  WishlistItem,
  UserPreference,
  SeoPage,
];
