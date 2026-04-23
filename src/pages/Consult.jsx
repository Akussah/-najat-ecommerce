import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import './Consult.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: 'custom-bag',
  preferredDate: '',
  preferredTime: '',
  budget: '',
  preferredContact: 'email',
  message: ''
};

const services = [
  'Custom bead bag',
  'Bridal order',
  'Gift set planning',
  'Wholesale or event order'
];

const serviceOptions = [
  { value: 'custom-bag', label: 'Custom bead bag' },
  { value: 'bridal', label: 'Bridal order' },
  { value: 'gift-set', label: 'Gift set planning' },
  { value: 'wholesale', label: 'Wholesale or event order' }
];

const budgetOptions = [
  { value: 'under-100', label: 'Under $100' },
  { value: '100-250', label: '$100 - $250' },
  { value: '250-500', label: '$250 - $500' },
  { value: '500-plus', label: '$500+' }
];

const processSteps = [
  {
    title: 'Share your idea',
    detail: 'Tell us the style, colors, event, and timeline you have in mind.'
  },
  {
    title: 'Review recommendations',
    detail: 'We reply with guidance, pricing direction, and the best next step.'
  },
  {
    title: 'Confirm your plan',
    detail: 'Once aligned, we move forward with your order or design consultation.'
  }
];

function Consult() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      await apiFetch('/api/consults', {
        method: 'POST',
        body: {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim()
        }
      });

      setStatus({
        type: 'success',
        message: 'Consultation request sent. We will contact you shortly.'
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to send your consultation request.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="consult-page">
      <section className="consult-hero">
        <div className="consult-hero-copy consult-fade-up">
          <p className="consult-kicker">Consultation</p>
          <h1>Plan your bead order with a simple one-on-one consultation.</h1>
          <p>
            Whether you need a custom bag, bridal piece, gift set, or event order, we can help
            you choose the right style, price range, and timeline before you place your order.
          </p>

          <div className="consult-hero-actions">
            <a href="#consult-form" className="consult-btn consult-btn-primary">
              Book a Consultation
            </a>
            <Link to="/shop" className="consult-btn consult-btn-secondary">
              Browse the Shop
            </Link>
          </div>
        </div>

        <aside className="consult-hero-panel consult-fade-up consult-delay-1">
          <h2 className="consult-panel-title">Popular reasons people book</h2>
          <div className="consult-service-chips">
            {services.map((service) => (
              <span key={service} className="consult-chip">
                {service}
              </span>
            ))}
          </div>

          <div className="consult-metrics">
            <div>
              <strong>1 business day</strong>
              <span>Typical response time</span>
            </div>
            <div>
              <strong>Flexible</strong>
              <span>Virtual or direct follow-up</span>
            </div>
            <div>
              <strong>Custom-ready</strong>
              <span>Great for unique design ideas</span>
            </div>
            <div>
              <strong>Clear pricing</strong>
              <span>Helpful budget guidance</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="consult-layout">
        <div className="consult-card consult-form-card consult-fade-up" id="consult-form">
          <h2>Send your consultation request</h2>
          <p className="consult-muted">
            Fill in a few details and we will reach out with recommendations and next steps.
          </p>

          <form onSubmit={handleSubmit} className="consult-form-grid" aria-busy={isSubmitting}>
            <label className="consult-field">
              Full Name
              <input
                className="consult-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="consult-field">
              Email
              <input
                className="consult-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="consult-field">
              Phone
              <input
                className="consult-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>

            <label className="consult-field">
              Service Type
              <select
                className="consult-input"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="consult-field">
              Preferred Date
              <input
                className="consult-input"
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
              />
            </label>

            <label className="consult-field">
              Preferred Time
              <select
                className="consult-input"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
              >
                <option value="">Select a time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>

            <label className="consult-field">
              Budget
              <select
                className="consult-input"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select a budget</option>
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="consult-field">
              Preferred Contact
              <select
                className="consult-input"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>

            <label className="consult-field consult-full-width">
              Tell us what you need
              <textarea
                className="consult-input consult-textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Share your style idea, event date, color preferences, quantity, or any references."
                required
              />
            </label>

            <div className="consult-submit-wrap consult-full-width">
              <button type="submit" className="consult-btn consult-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>

              <div aria-live="polite" role="status">
                {status.type === 'success' && <p className="consult-success">{status.message}</p>}
                {status.type === 'error' && <p className="consult-error">{status.message}</p>}
              </div>
            </div>
          </form>
        </div>

        <aside className="consult-side-stack">
          <div className="consult-card consult-info-card consult-fade-up consult-delay-1">
            <h2>What to expect</h2>
            <p className="consult-muted">
              We use your consultation request to recommend the best order path for your needs.
            </p>
            <ul>
              <li>Advice on styles, colors, and use case</li>
              <li>Guidance on pricing and quantity</li>
              <li>Help choosing between ready-made and custom work</li>
              <li>Clear next steps for booking or ordering</li>
            </ul>
          </div>

          <div className="consult-card consult-fade-up">
            <h3>Direct contact</h3>
            <p className="consult-muted">Reach us directly for quick questions.</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:Alhamdashino@gmail.com">Alhamdashino@gmail.com</a>
              <br />
              <strong>Phone:</strong>{' '}
              <a href="tel:+18622710875">862-271-0875</a>
            </p>
          </div>

          <div className="consult-card consult-process-card consult-fade-up">
            <h3>How it works</h3>
            <div className="consult-steps">
              {processSteps.map((step, index) => (
                <div key={step.title} className="consult-step-item">
                  <span>{index + 1}</span>
                  <div>
                    <p>{step.title}</p>
                    <small>{step.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="consult-card consult-cta-card consult-fade-up consult-delay-1">
            <h3>Need inspiration first?</h3>
            <p>Browse current pieces before requesting a custom consultation.</p>
            <Link to="/shop" className="consult-btn consult-btn-primary">
              View Collections
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Consult;
