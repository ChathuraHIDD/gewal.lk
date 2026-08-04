import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  FileImage,
  Home,
  ImagePlus,
  MapPin,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";

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
  area: "1800 sqft",
  country: "Sri Lanka",
  province: "Western",
  district: "Colombo",
  city: "Colombo",
  street: "",
  price: "",
  negotiable: true,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
};

function PostPropertyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [published, setPublished] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const previewImage = useMemo(() => images[0]?.preview || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85", [images]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);
    const mappedFiles = files.map((file) => ({ id: crypto.randomUUID(), name: file.name, preview: URL.createObjectURL(file) }));
    setImages((current) => [...current, ...mappedFiles].slice(0, 10));
  };

  const nextStep = () => setStep((value) => Math.min(steps.length - 1, value + 1));
  const prevStep = () => setStep((value) => Math.max(0, value - 1));

  const publish = () => {
    setPublished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          {published && <div className="post-property-success"><CheckCircle2 size={20} /> Property submitted for approval successfully.</div>}

          {step === 0 && (
            <Step title="Basic Details" description="Tell buyers what this property is.">
              <Field label="Property title"><input name="title" value={form.title} onChange={updateField} placeholder="Luxury villa in Colombo" /></Field>
              <div className="post-grid-2">
                <Field label="Property type"><select name="propertyType" value={form.propertyType} onChange={updateField}>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
                <Field label="Listing type"><select name="listingType" value={form.listingType} onChange={updateField}><option>Sale</option><option>Rent</option><option>Lease</option></select></Field>
              </div>
              <Field label="Description"><textarea name="description" value={form.description} onChange={updateField} rows="5" placeholder="Describe the property, nearby places and key benefits" /></Field>
              <div className="post-grid-3"><Field label="Bedrooms"><input name="bedrooms" value={form.bedrooms} onChange={updateField} /></Field><Field label="Bathrooms"><input name="bathrooms" value={form.bathrooms} onChange={updateField} /></Field><Field label="Area"><input name="area" value={form.area} onChange={updateField} /></Field></div>
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
              <Field label="Price"><input name="price" value={form.price} onChange={updateField} placeholder="85000000" /></Field>
              <label className="post-check"><input type="checkbox" name="negotiable" checked={form.negotiable} onChange={updateField} /> Price negotiable</label>
              <div className="post-grid-2"><Field label="Available from"><input type="date" /></Field><Field label="Ownership type"><select><option>Freehold</option><option>Leasehold</option><option>Permit</option></select></Field></div>
            </Step>
          )}

          {step === 3 && (
            <Step title="Images, Video & Floor Plans" description="Upload high-quality media. First image becomes cover.">
              <label className="upload-box"><UploadCloud size={34} /><strong>Upload property images</strong><span>PNG/JPG/WebP up to 10 images</span><input type="file" multiple accept="image/*" onChange={handleImages} /></label>
              <div className="uploaded-grid">{images.map((image) => <div key={image.id}><img src={image.preview} alt={image.name} /><button onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}><Trash2 size={15} /></button></div>)}{images.length === 0 && <p><ImagePlus size={18} /> No images uploaded yet.</p>}</div>
              <Field label="Video URL"><input placeholder="YouTube, Vimeo or Cloudinary video URL" /></Field>
              <Field label="Floor plan title"><input placeholder="Ground floor plan" /></Field>
            </Step>
          )}

          {step === 4 && (
            <Step title="Amenities & Nearby Places" description="Help buyers understand lifestyle value.">
              <div className="amenity-selector">{amenities.map((item) => <button key={item} className={selectedAmenities.includes(item) ? "is-active" : ""} onClick={() => toggleAmenity(item)}>{item}</button>)}</div>
              <div className="post-grid-2"><Field label="Nearby place"><input placeholder="School, hospital, supermarket" /></Field><Field label="Distance"><input placeholder="850m" /></Field></div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Contact & SEO" description="Add contact and SEO details.">
              <div className="post-grid-2"><Field label="Contact name"><input name="contactName" value={form.contactName} onChange={updateField} /></Field><Field label="Contact phone"><input name="contactPhone" value={form.contactPhone} onChange={updateField} /></Field></div>
              <Field label="Contact email"><input name="contactEmail" value={form.contactEmail} onChange={updateField} /></Field>
              <Field label="SEO title"><input name="seoTitle" value={form.seoTitle} onChange={updateField} placeholder="Luxury villa for sale in Colombo" /></Field>
              <Field label="SEO description"><textarea name="seoDescription" value={form.seoDescription} onChange={updateField} rows="3" /></Field>
            </Step>
          )}

          {step === 6 && (
            <Step title="Preview & Publish" description="Review your listing before submission.">
              <article className="post-preview-card"><img src={previewImage} alt="Property preview" /><div><span>{form.listingType} · {form.propertyType}</span><h3>{form.price ? `Rs. ${Number(form.price).toLocaleString()}` : "Price not set"}</h3><h4>{form.title || "Untitled property"}</h4><p><MapPin size={16} /> {form.city}, {form.district}</p><div><span><BedDouble size={16} /> {form.bedrooms}</span><span><Bath size={16} /> {form.bathrooms}</span><span><Home size={16} /> {form.area}</span></div></div></article>
            </Step>
          )}

          <div className="post-property-actions">
            <button type="button" onClick={prevStep} disabled={step === 0}><ArrowLeft size={17} /> Back</button>
            {step < steps.length - 1 ? <button type="button" onClick={nextStep}>Next <ArrowRight size={17} /></button> : <button type="button" onClick={publish}><Plus size={17} /> Publish Property</button>}
          </div>
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
