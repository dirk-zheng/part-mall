import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, MessageSquareText, Send } from 'lucide-react';

const initialForm = {
  name: '', company: '', country: '', email: '', whatsapp: '',
  vehicleModels: '', specifications: '', estimatedQuantity: '',
  loadingPlan: 'undecided', destinationPort: '', message: '', website: '',
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ sending: false, error: '', reference: '' });

  useEffect(() => {
    const product = searchParams.get('product');
    if (product) setForm((current) => ({ ...current, specifications: product }));
  }, [searchParams]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ sending: true, error: '', reference: '' });
    try {
      const response = await fetch('/api/quotes/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to submit the inquiry');
      setStatus({ sending: false, error: '', reference: result.data.reference });
      setForm(initialForm);
    } catch (error) {
      setStatus({ sending: false, error: error.message, reference: '' });
    }
  };

  if (status.reference) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-slate-50">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
          <CheckCircle2 size={54} className="text-emerald-500 mx-auto mb-5" />
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-3">Inquiry received</h1>
          <p className="text-slate-600 mb-4">Our team will review the fitment, quantity and shipping information.</p>
          <p className="font-mono text-sm bg-slate-100 rounded-xl px-4 py-3">Reference: {status.reference}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <header className="bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-orange-300 uppercase tracking-wider font-semibold text-sm mb-4">No account required</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-5">Request a wheel quotation</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">Share what you already know. We will follow up on missing fitment, loading or document details before any order is confirmed.</p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
        <aside className="bg-white border border-slate-200 rounded-2xl p-7 lg:sticky lg:top-24">
          <MessageSquareText className="text-primary mb-4" size={30} />
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">Useful details</h2>
          <p className="text-slate-600 leading-relaxed mb-6">For a more accurate reply, include the destination market, vehicle year and trim, wheel size, PCD, offset, center bore, finish, quantity and destination port.</p>
          <a href="mailto:info@driveline-global.com" className="flex items-center gap-2 text-primary font-semibold"><Mail size={18} />info@driveline-global.com</a>
        </aside>
        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-9 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              ['name', 'Name *', 'text', true], ['company', 'Company *', 'text', true],
              ['country', 'Country / market *', 'text', true], ['email', 'Business email *', 'email', true],
              ['whatsapp', 'WhatsApp', 'text', false], ['vehicleModels', 'Target vehicles', 'text', false],
              ['specifications', 'Wheel specifications or product', 'text', false], ['estimatedQuantity', 'Estimated quantity', 'number', false],
              ['destinationPort', 'Destination port', 'text', false],
            ].map(([name, label, type, required]) => (
              <label key={name} className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span>
                <input name={name} type={type} required={required} min={type === 'number' ? '1' : undefined} value={form[name]} onChange={update} className="w-full rounded-xl border-slate-300" />
              </label>
            ))}
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Loading plan</span>
              <select name="loadingPlan" value={form.loadingPlan} onChange={update} className="w-full rounded-xl border-slate-300">
                <option value="undecided">Need a recommendation</option><option value="mixed-lcl">Mixed / LCL</option><option value="20gp">20GP</option><option value="40hq">40HQ</option>
              </select>
            </label>
          </div>
          <label className="block mt-5"><span className="block text-sm font-semibold text-slate-700 mb-2">Finish, packing, reports or other requirements</span><textarea name="message" rows="5" value={form.message} onChange={update} className="w-full rounded-xl border-slate-300" /></label>
          <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={update} /></label>
          <p className="text-xs text-slate-500 mt-4">By submitting, you allow Driveline Wheels to use these details to respond to this business inquiry. No payment or order is created.</p>
          {status.error && <p role="alert" className="mt-4 text-sm text-red-600">{status.error}</p>}
          <button disabled={status.sending} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-60">
            <Send size={18} />{status.sending ? 'Sending…' : 'Send inquiry'}
          </button>
        </form>
      </main>
    </div>
  );
}
