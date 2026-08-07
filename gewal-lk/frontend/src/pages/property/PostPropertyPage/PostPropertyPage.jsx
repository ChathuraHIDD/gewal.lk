import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth.js";
import { createProperty } from "../../../services/propertyService.js";
import { APPOINTMENT_SLOTS, APPOINTMENT_SLOT_VALUES } from "../../../utils/appointmentSlots.js";

import "./PostPropertyPage.css";

const steps = ["Basic", "Location", "Price", "Media", "Amenities", "Contact", "Preview"];
const propertyTypes = ["House", "Apartment", "Villa", "Land", "Commercial", "Office", "Shop", "Warehouse", "Annexe"];
const amenities = ["Swimming Pool", "Gym", "Balcony", "Garden", "Garage", "Lift", "CCTV", "Security", "Air Conditioning", "Solar", "Internet", "Water Supply"];

const initialForm = {
  title: "",
  description: "",
  propertyType: "House",
  listingType: "Sale",
  bedrooms: "3",
  bathrooms: "2",
  buildingSize: "1800",
  country: "Sri Lanka",
  province: "Western",
  district: "Colombo",
  city: "Colombo",
  street: "",
  price: "",
  negotiable: true,
  availableFrom: "",
  ownershipType: "Freehold",
  videoUrl: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
  appointmentSlotMode: "Fixed",
};

const requiredFieldsByStep = [
  ["title", "description"],
  ["district", "city"],
  ["price"],
  [],
  [],
  ["contactName", "contactPhone"],
  [],
];

const fieldToStep = {
  title: 0,
  description: 0,
  propertyType: 0,
  listingType: 0,
  district: 1,
  city: 1,
  price: 2,
  images: 3,
  contactName: 5,
  contactPhone: 5,
  contactEmail: 5,
  appointmentSlotMode: 5,
  availableSlots: 5,
};

function PostPropertyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user) return;

    setForm((current) => ({
      ...current,
      contactName: current.contactName || `${user.firstName} ${user.lastName}`.trim(),
      contactPhone: current.contactPhone || user.phone || "",
      contactEmail: current.contactEmail || user.email || "",
    }));
  }, [user]);

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState(APPOINTMENT_SLOT_VALUES);
  const [images, setImages] = useState([]);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const progress = ((step + 1) / steps.length) * 100;

  const previewImage = useMemo(() => images[0]?.preview || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85", [images]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const toggleSlot = (slot) => {
    setSelectedSlots((current) => current.includes(slot) ? current.filter((value) => value !== slot) : [...current, slot]);
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);
    const mappedFiles = files.map((file) => ({ id: crypto.randomUUID(), file, name: file.name, preview: URL.createObjectURL(file) }));
    setImages((current) => [...current, ...mappedFiles].slice(0, 10));
    event.target.value = "";
  };

  const nextStep = () => setStep((value) => Math.min(steps.length - 1, value + 1));
  const prevStep = () => setStep((value) => Math.max(0, value - 1));

  const findFirstInvalidField = () => {
    for (let index = 0; index < requiredFieldsByStep.length; index += 1) {
      const emptyField = requiredFieldsByStep[index].find((field) => !String(form[field] || "").trim());
      if (emptyField) {
        return { step: index, message: "Please fill in all required fields before publishing." };
      }
    }

    if (form.title.trim().length < 5) {
      return { step: 0, message: "Property title must be at least 5 characters." };
    }

    if (form.description.trim().length < 20) {
      return { step: 0, message: "Description must be at least 20 characters." };
    }

    if (!(Number(form.price) > 0)) {
      return { step: 2, message: "Enter a valid price greater than zero." };
    }

    if (form.appointmentSlotMode === "Fixed" && selectedSlots.length === 0) {
      return { step: 5, message: "Select at least one appointment time slot, or enable custom scheduling." };
    }

    return null;
  };

  const publish = async () => {
    setSubmitError("");

    const invalid = findFirstInvalidField();
    if (invalid) {
      setStep(invalid.step);
      setSubmitError(invalid.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("propertyType", form.propertyType);
    payload.append("listingType", form.listingType);
    payload.append("price", form.price);
    payload.append("negotiable", form.negotiable);
    payload.append("bedrooms", form.bedrooms);
    payload.append("bathrooms", form.bathrooms);
    payload.append("buildingSize", form.buildingSize);
    payload.append("ownershipType", form.ownershipType);
    payload.append("availableFrom", form.availableFrom);

    payload.append("country", form.country);
    payload.append("province", form.province);
    payload.append("district", form.district);
    payload.append("city", form.city);
    payload.append("street", form.street);

    payload.append("contactName", form.contactName);
    payload.append("contactPhone", form.contactPhone);
    payload.append("contactEmail", form.contactEmail);

    payload.append("seoTitle", form.seoTitle);
    payload.append("seoDescription", form.seoDescription);
    payload.append("videoUrl", form.videoUrl);

    payload.append("amenities", JSON.stringify(selectedAmenities));

    payload.append("appointmentSlotMode", form.appointmentSlotMode);
    payload.append("availableSlots", JSON.stringify(selectedSlots));

    images.forEach((image) => payload.append("images", image.file));

    try {
      setIsSubmitting(true);
      await createProperty(payload);
      setPublished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const fieldMessages = (error.errors || []).map((item) => item.message).filter(Boolean);
      setSubmitError(
        fieldMessages.length > 0
          ? fieldMessages.join(" ")
          : error.message || "Failed to publish property. Please try again."
      );

      const firstErrorField = error.errors?.[0]?.field;
      if (firstErrorField && fieldToStep[firstErrorField] !== undefined) {
        setStep(fieldToStep[firstErrorField]);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewListing = () => {
    setForm(initialForm);
    setSelectedAmenities([]);
    setImages([]);
    setPublished(false);
    setStep(0);
  };

  return (
    <main className="post-property-page">
      <section className="container post-property-hero">
        <span>List your property</span>
        <h1>Post a premium property listing</h1>
        <p>Create a beautiful, high-converting listing with images, location, amenities, contact details and SEO information.</p>
      </section>

      <section className="container post-property-shell">
        <aside className="post-property-steps">
          <div className="post-property-progress"><i style={{ width: `${progress}%` }} /></div>
          {steps.map((item, index) => (
            <button key={item} className={index === step ? "is-active" : index < step ? "is-done" : ""} onClick={() => setStep(index)}>
              <span className="post-step-number">
                {index < step ? <CheckCircle2 size={18} /> : index + 1}
              </span>
              <span>{item}</span>
            </button>
          ))}
        </aside>

        <div className="post-property-card">
          {published ? (
            <div className="post-step">
              <div className="post-property-success"><CheckCircle2 size={20} /> Property submitted for approval successfully.</div>
              <p>Our team will review your listing shortly. You can track its status from your dashboard.</p>
              <div className="post-property-actions">
                <button type="button" onClick={startNewListing}><Plus size={17} /> Post another property</button>
                <button type="button" onClick={() => navigate("/dashboard")}>Go to dashboard <ArrowRight size={17} /></button>
              </div>
            </div>
          ) : (
            <>
              {submitError && <div className="post-property-error"><AlertCircle size={20} /> {submitError}</div>}

              {step === 0 && (
                <Step title="Basic Details" description="Tell buyers what this property is.">
                  <Field label="Property title"><input name="title" value={form.title} onChange={updateField} placeholder="Luxury villa in Colombo" /></Field>
                  <div className="post-grid-2">
                    <Field label="Property type"><select name="propertyType" value={form.propertyType} onChange={updateField}>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
                    <Field label="Listing type"><select name="listingType" value={form.listingType} onChange={updateField}><option>Sale</option><option>Rent</option><option>Lease</option></select></Field>
                  </div>
                  <Field label="Description"><textarea name="description" value={form.description} onChange={updateField} rows="5" placeholder="Describe the property, nearby places and key benefits" /></Field>
                  <div className="post-grid-3"><Field label="Bedrooms"><input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={updateField} /></Field><Field label="Bathrooms"><input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={updateField} /></Field><Field label="Area (sqft)"><input name="buildingSize" type="number" min="0" value={form.buildingSize} onChange={updateField} /></Field></div>
                </Step>
              )}

              {step === 1 && (
                <Step title="Location" description="Add accurate address details for map and search.">
                  <div className="post-grid-2"><Field label="Country"><input name="country" value={form.country} onChange={updateField} /></Field><Field label="Province"><input name="province" value={form.province} onChange={updateField} /></Field></div>
                  <div className="post-grid-2"><Field label="District"><input name="district" value={form.district} onChange={updateField} /></Field><Field label="City / Area"><input name="city" value={form.city} onChange={updateField} /></Field></div>
                  <Field label="Street address"><input name="street" value={form.street} onChange={updateField} placeholder="Street, landmark or building name" /></Field>
                  <div className="post-map-preview"><MapPin size={30} /><span>Map location preview</span></div>
                </Step>
              )}

              {step === 2 && (
                <Step title="Price" description="Set pricing and availability details.">
                  <Field label="Price"><input name="price" type="number" min="0" value={form.price} onChange={updateField} placeholder="85000000" /></Field>
                  <label className="post-check"><input type="checkbox" name="negotiable" checked={form.negotiable} onChange={updateField} /> Price negotiable</label>
                  <div className="post-grid-2"><Field label="Available from"><input type="date" name="availableFrom" value={form.availableFrom} onChange={updateField} /></Field><Field label="Ownership type"><select name="ownershipType" value={form.ownershipType} onChange={updateField}><option>Freehold</option><option>Leasehold</option><option>Permit</option></select></Field></div>
                </Step>
              )}

              {step === 3 && (
                <Step title="Images & Video" description="Upload high-quality media. First image becomes cover.">
                  <label className="upload-box"><UploadCloud size={34} /><strong>Upload property images</strong><span>PNG/JPG/WebP up to 10 images</span><input type="file" multiple accept="image/*" onChange={handleImages} /></label>
                  <div className="uploaded-grid">{images.map((image) => <div key={image.id}><img src={image.preview} alt={image.name} /><button onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}><Trash2 size={15} /></button></div>)}{images.length === 0 && <p><ImagePlus size={18} /> No images uploaded yet.</p>}</div>
                  <Field label="Video URL"><input name="videoUrl" value={form.videoUrl} onChange={updateField} placeholder="YouTube, Vimeo or Cloudinary video URL" /></Field>
                </Step>
              )}

              {step === 4 && (
                <Step title="Amenities" description="Help buyers understand lifestyle value.">
                  <div className="amenity-selector">{amenities.map((item) => <button key={item} className={selectedAmenities.includes(item) ? "is-active" : ""} onClick={() => toggleAmenity(item)}>{item}</button>)}</div>
                </Step>
              )}

              {step === 5 && (
                <Step title="Contact & SEO" description="Add contact and SEO details.">
                  <div className="post-grid-2"><Field label="Contact name"><input name="contactName" value={form.contactName} onChange={updateField} /></Field><Field label="Contact phone"><input name="contactPhone" value={form.contactPhone} onChange={updateField} /></Field></div>
                  <Field label="Contact email"><input name="contactEmail" value={form.contactEmail} onChange={updateField} /></Field>

                  <div className="post-field">
                    <span>Appointment scheduling</span>
                    <label className="post-check">
                      <input
                        type="checkbox"
                        checked={form.appointmentSlotMode === "Customizable"}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            appointmentSlotMode: event.target.checked ? "Customizable" : "Fixed",
                          }))
                        }
                      />
                      Let visitors request any custom time (instead of fixed slots)
                    </label>
                  </div>

                  {form.appointmentSlotMode === "Fixed" && (
                    <Field label="Available time slots">
                      <div className="amenity-selector">
                        {APPOINTMENT_SLOTS.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            className={selectedSlots.includes(slot.value) ? "is-active" : ""}
                            onClick={() => toggleSlot(slot.value)}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}

                  <Field label="SEO title"><input name="seoTitle" value={form.seoTitle} onChange={updateField} placeholder="Luxury villa for sale in Colombo" /></Field>
                  <Field label="SEO description"><textarea name="seoDescription" value={form.seoDescription} onChange={updateField} rows="3" /></Field>
                </Step>
              )}

              {step === 6 && (
                <Step title="Preview & Publish" description="Review your listing before submission.">
                  <article className="post-preview-card"><img src={previewImage} alt="Property preview" /><div><span>{form.listingType} · {form.propertyType}</span><h3>{form.price ? `Rs. ${Number(form.price).toLocaleString()}` : "Price not set"}</h3><h4>{form.title || "Untitled property"}</h4><p><MapPin size={16} /> {form.city}, {form.district}</p><div><span><BedDouble size={16} /> {form.bedrooms}</span><span><Bath size={16} /> {form.bathrooms}</span><span>{form.buildingSize} sqft</span></div></div></article>
                </Step>
              )}

              <div className="post-property-actions">
                <button type="button" onClick={prevStep} disabled={step === 0 || isSubmitting}><ArrowLeft size={17} /> Back</button>
                {step < steps.length - 1
                  ? <button type="button" onClick={nextStep}>Next <ArrowRight size={17} /></button>
                  : <button type="button" onClick={publish} disabled={isSubmitting}>{isSubmitting ? <Loader2 size={17} className="spin" /> : <Plus size={17} />} {isSubmitting ? "Publishing..." : "Publish Property"}</button>}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Step({ title, description, children }) {
  return <div className="post-step"><h2>{title}</h2><p>{description}</p><div className="post-step__content">{children}</div></div>;
}

function Field({ label, children }) {
  return <label className="post-field"><span>{label}</span>{children}</label>;
}

export default PostPropertyPage;
