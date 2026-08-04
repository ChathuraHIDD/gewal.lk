import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, UserRound } from "lucide-react";
import "./ContactPage.css";

const faqs = [
  ["How do I post a property?", "Click Post Property, complete the steps, upload images and submit for approval."],
  ["How long does approval take?", "Most listings are reviewed within 24 hours by the Gewal.lk team."],
  ["Can I contact agents directly?", "Yes, you can call, email, WhatsApp or book an appointment from property pages."],
  ["Do you support agencies?", "Yes, agencies can manage agents, listings, leads and subscription plans."],
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="contact-page">
      <section className="container contact-hero">
        <span>Contact Gewal.lk</span>
        <h1>We’re here to help you move smarter</h1>
        <p>Reach our team for property support, partnerships, agent onboarding, billing questions or listing assistance.</p>
      </section>

      <section className="container contact-shell">
        <div className="contact-info-grid">
          <article><Phone size={24} /><h3>Call us</h3><p>+94 77 123 4567</p><a href="tel:+94771234567">Call now</a></article>
          <article><Mail size={24} /><h3>Email</h3><p>hello@gewal.lk</p><a href="mailto:hello@gewal.lk">Send email</a></article>
          <article><MapPin size={24} /><h3>Office</h3><p>Colombo, Sri Lanka</p><button>Open map</button></article>
          <article><Clock size={24} /><h3>Hours</h3><p>Mon - Fri, 9:00 - 18:00</p><button>Book support</button></article>
        </div>

        <div className="contact-main-grid">
          <form className="contact-form" onSubmit={submit}>
            <h2>Send us a message</h2>
            <p>Our support team will get back to you as soon as possible.</p>
            {sent && <div className="contact-success"><CheckCircle2 size={18} /> Message sent successfully.</div>}
            <div className="contact-form__row"><label><span>Name</span><input name="name" value={form.name} onChange={update} required /></label><label><span>Email</span><input name="email" type="email" value={form.email} onChange={update} required /></label></div>
            <div className="contact-form__row"><label><span>Phone</span><input name="phone" value={form.phone} onChange={update} /></label><label><span>Subject</span><input name="subject" value={form.subject} onChange={update} required /></label></div>
            <label><span>Message</span><textarea name="message" rows="6" value={form.message} onChange={update} required /></label>
            <button><Send size={17} /> Send Message</button>
          </form>

          <aside className="contact-side">
            <div className="contact-agent-card"><UserRound size={30} /><h3>Need property help?</h3><p>Talk with a marketplace advisor for guidance on buying, renting, selling or posting property.</p><a href="/agents">Find an Agent</a></div>
            <div className="contact-map"><MapPin size={32} /><span>Colombo support office map preview</span></div>
          </aside>
        </div>

        <section className="contact-faq">
          <div><span>FAQ</span><h2>Frequently asked questions</h2></div>
          <div className="contact-faq__list">{faqs.map(([question, answer], index) => <article key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>{question}</button>{openFaq === index && <p>{answer}</p>}</article>)}</div>
        </section>
      </section>
    </main>
  );
}

export default ContactPage;
