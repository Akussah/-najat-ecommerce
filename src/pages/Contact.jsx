import { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: 'custom-order',
  preferredContact: 'email',
  message: ''
};

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    setTimeout(() => {
      setStatus({ type: 'success', message: 'Message sent. We will contact you shortly.' });
      setFormData(initialForm);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <main className="page">
      <section className="hero-simple">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">Contact</p>
            <h1 className="hero-title">Reach out through a contact page that stays clear and direct.</h1>
            <p className="hero-subtitle">
              Use this page for custom questions, order follow-up, repairs, bulk inquiries, or a
              general message to the studio.
            </p>
            <div className="tag-row">
              <span className="tag-pill">Order questions</span>
              <span className="tag-pill">Bulk inquiries</span>
              <span className="tag-pill">Repair requests</span>
            </div>
          </div>
          <aside className="hero-panel">
            <h3>Direct details</h3>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>Email</h3>
                <p>
                  <a href="mailto:Alhamdashino@gmail.com">Alhamdashino@gmail.com</a>
                </p>
              </div>
              <div className="feature-card">
                <h3>Phone</h3>
                <p>
                  <a href="tel:+18622710875">862-271-0875</a>
                </p>
              </div>
              <div className="feature-card">
                <h3>Hours</h3>
                <p>Mon - Fri, 9:00 AM - 7:00 PM</p>
              </div>
              <div className="feature-card">
                <h3>Best for</h3>
                <p>General support, timelines, and order questions</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container page-grid">
          <article className="panel-card page-card">
            <p className="eyebrow">Send a Message</p>
            <h2 className="section-title">Tell us what you need.</h2>
            <p className="section-subtitle">
              Keep it simple. Share your request and we will follow up with the best next step.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>
              <label>
                Phone
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </label>
              <label>
                Subject
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="custom-order">Custom order</option>
                  <option value="consultation">Consultation</option>
                  <option value="repair">Repair request</option>
                  <option value="bulk-order">Bulk or event order</option>
                  <option value="general">General question</option>
                </select>
              </label>
              <label>
                Preferred Contact
                <select name="preferredContact" value={formData.preferredContact} onChange={handleChange}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </label>

              {status.type === 'success' && <p className="muted-text" style={{ color: 'var(--success)' }}>{status.message}</p>}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </article>

          <aside className="panel-card page-card">
            <p className="eyebrow">Quick Notes</p>
            <h2 className="section-title">When to use contact vs consultation</h2>
            <ul>
              <li>Use contact for general questions, repair issues, and order updates.</li>
              <li>Use consultation when you want style guidance or a custom plan.</li>
              <li>Use commission when you already know you need bespoke work.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Contact;
