import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2.5rem] bg-brand-light/70 border border-slate-200/80 px-6 py-20 shadow-hero md:mx-10 md:px-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="space-y-8 lg:max-w-2xl">
            <p className="eyebrow text-brand-dark">Consultation</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Plan your bead order with a simple one-on-one consultation.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Whether you need a custom bag, bridal piece, gift set, or event order, we can help
              you choose the right style, price range, and timeline before you place your order.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#consult-form" className="btn btn-primary">
                Book a Consultation
              </a>
              <Link to="/shop" className="btn btn-secondary">
                Browse the Shop
              </Link>
            </div>
          </div>

          <aside className="mt-12 grid gap-6 rounded-[2rem] bg-white p-8 shadow-[0_24px_44px_rgba(17,17,17,0.08)] sm:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 mb-5">Popular reasons people book</h3>
              <div className="flex flex-wrap gap-3">
                {services.map((service) => (
                  <span key={service} className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">1 business day</strong>
                <span className="text-sm text-slate-600">Typical response time</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Flexible</strong>
                <span className="text-sm text-slate-600">Virtual or direct follow-up</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Custom-ready</strong>
                <span className="text-sm text-slate-600">Great for unique design ideas</span>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <strong className="block text-lg font-semibold text-slate-950">Clear pricing</strong>
                <span className="text-sm text-slate-600">Helpful budget guidance</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 md:px-10 lg:grid-cols-[1.4fr_0.95fr]">
          <article id="consult-form" className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(17,17,17,0.08)]">
            <h2 className="text-3xl font-semibold text-slate-950 mb-3">Send your consultation request</h2>
            <p className="text-slate-600 mb-8">
              Fill in a few details and we will reach out with recommendations and next steps.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-6" aria-busy={isSubmitting}>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Full Name
                <input
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Email
                <input
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Phone
                <input
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Service Type
                <select
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
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

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-900">
                  Preferred Date
                  <input
                    className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-900">
                  Preferred Time
                  <select
                    className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
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
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-900">
                  Budget
                  <select
                    className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
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

                <label className="grid gap-2 text-sm font-semibold text-slate-900">
                  Preferred Contact
                  <select
                    className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-slate-900 md:col-span-full">
                Tell us what you need
                <textarea
                  className="min-h-[14rem] rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Share your style idea, event date, color preferences, quantity, or any references."
                  required
                />
              </label>

              <div className="grid gap-4">
                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>

                <div aria-live="polite" role="status">
                  {status.type === 'success' && <p className="success-msg">{status.message}</p>}
                  {status.type === 'error' && <p className="error-msg">{status.message}</p>}
                </div>
              </div>
            </form>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2rem] bg-white/95 p-8 shadow-[0_24px_44px_rgba(17,17,17,0.08)]">
              <h2 className="text-2xl font-semibold mb-4 text-slate-950">What to expect</h2>
              <p className="text-slate-600 mb-6">
                We use your consultation request to recommend the best order path for your needs.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li>Advice on styles, colors, and use case</li>
                <li>Guidance on pricing and quantity</li>
                <li>Help choosing between ready-made and custom work</li>
                <li>Clear next steps for booking or ordering</li>
              </ul>
            </article>

            <article className="rounded-[2rem] bg-white/95 p-8 shadow-[0_24px_44px_rgba(17,17,17,0.08)]">
              <h3 className="text-xl font-semibold text-slate-950 mb-4">Direct contact</h3>
              <p className="text-slate-600 mb-4">Reach us directly for quick questions.</p>
              <p className="text-sm leading-7 text-slate-600">
                <strong>Email:</strong>{' '}
                <a href="mailto:Alhamdashino@gmail.com" className="text-slate-900 hover:text-[#b27f52]">Alhamdashino@gmail.com</a>
                <br />
                <strong>Phone:</strong>{' '}
                <a href="tel:+18622710875" className="text-slate-900 hover:text-[#b27f52]">862-271-0875</a>
              </p>
            </article>

            <article className="rounded-[2rem] bg-white/95 p-8 shadow-[0_24px_44px_rgba(17,17,17,0.08)]">
              <h3 className="text-xl font-semibold text-slate-950 mb-4">How it works</h3>
              <div className="grid gap-4">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="rounded-[1.5rem] border border-slate-200/80 bg-[#fbf6ef] p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#b27f52]/10 text-lg font-bold text-[#b27f52]">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-slate-950">{step.title}</p>
                    <p className="text-sm leading-7 text-slate-600">{step.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] bg-white/95 p-8 shadow-[0_24px_44px_rgba(17,17,17,0.08)]">
              <h3 className="text-xl font-semibold text-slate-950 mb-4">Need inspiration first?</h3>
              <p className="text-slate-600 mb-6">Browse current pieces before requesting a custom consultation.</p>
              <Link to="/shop" className="btn btn-primary w-full text-center">
                View Collections
              </Link>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Consult;
