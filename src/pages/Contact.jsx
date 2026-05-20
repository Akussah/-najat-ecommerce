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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-6 mt-12 overflow-hidden rounded-[2.5rem] bg-brand-light/70 border border-slate-200/80 px-6 py-16 shadow-hero md:mx-10 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-dark">Contact</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Reach out through a contact page that stays clear and direct.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Use this page for custom questions, order follow-up, repairs, bulk inquiries, or a
              general message to the studio.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Order questions</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Bulk inquiries</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">Repair requests</span>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950 mb-6">Direct details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">Email</h3>
                <p className="mt-2 text-sm text-slate-600"><a href="mailto:Alhamdashino@gmail.com" className="hover:text-brand">Alhamdashino@gmail.com</a></p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">Phone</h3>
                <p className="mt-2 text-sm text-slate-600"><a href="tel:+18622710875" className="hover:text-brand">862-271-0875</a></p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">Hours</h3>
                <p className="mt-2 text-sm text-slate-600">Mon - Fri, 9:00 AM - 7:00 PM</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">Best for</h3>
                <p className="mt-2 text-sm text-slate-600">General support, timelines, and order questions</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:px-10 lg:grid-cols-[1.4fr_0.95fr]">
          <article className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Send a Message</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Tell us what you need.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Keep it simple. Share your request and we will follow up with the best next step.
            </p>

            <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Email', name: 'email', type: 'email', required: true },
                { label: 'Phone', name: 'phone', type: 'text' }
              ].map((field) => (
                <label key={field.name} className="grid gap-2 text-sm font-semibold text-slate-900">
                  {field.label}
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  />
                </label>
              ))}

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Subject
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                >
                  <option value="custom-order">Custom order</option>
                  <option value="consultation">Consultation</option>
                  <option value="repair">Repair request</option>
                  <option value="bulk-order">Bulk or event order</option>
                  <option value="general">General question</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Preferred Contact
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Message
                <textarea
                  name="message"
                  className="min-h-[14rem] rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#b27f52] focus:ring-4 focus:ring-[#b27f52]/10"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </label>

              {status.type === 'success' && <p className="text-sm text-emerald-700">{status.message}</p>}

              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </article>

          <aside className="rounded-[2rem] bg-white/95 p-10 shadow-[0_24px_44px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Quick Notes</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">When to use contact vs consultation</h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
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
