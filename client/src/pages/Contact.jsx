import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, LockKeyhole, Mail, MessageSquareText, Send, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const createInitialForm = (product = '') => ({
  name: '', company: '', country: '', email: '', whatsapp: '',
  vehicleModels: '', specifications: product, estimatedQuantity: '',
  loadingPlan: 'undecided', destinationPort: '', message: '', website: '',
});

export function QuoteForm({ initialProduct = '', compact = false }) {
  const { user, register } = useAuth();
  const [form, setForm] = useState(() => createInitialForm(initialProduct));
  const [status, setStatus] = useState({ sending: false, error: '', reference: '' });
  const [account, setAccount] = useState({ password: '', confirmPassword: '', saving: false, error: '', created: false });

  useEffect(() => {
    if (!initialProduct) return;
    setForm((current) => ({ ...current, specifications: initialProduct }));
  }, [initialProduct]);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

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
      setStatus({
        sending: false,
        error: '',
        reference: result.data.reference,
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
      });
      setForm(createInitialForm());
    } catch (error) {
      setStatus({ sending: false, error: error.message, reference: '' });
    }
  };

  const createAccount = async (event) => {
    event.preventDefault();
    if (account.password.length < 8) {
      setAccount((current) => ({ ...current, error: 'Use at least 8 characters for your password.' }));
      return;
    }
    if (account.password !== account.confirmPassword) {
      setAccount((current) => ({ ...current, error: 'The two passwords do not match.' }));
      return;
    }

    setAccount((current) => ({ ...current, saving: true, error: '' }));
    try {
      await register(status.email, account.password, status.name, status.reference);
      setAccount((current) => ({ ...current, saving: false, created: true, password: '', confirmPassword: '' }));
    } catch (error) {
      const message = error.message?.includes('already uses')
        ? 'An account already uses this email. Close this window and sign in with the same email.'
        : error.message || 'Unable to create the account right now.';
      setAccount((current) => ({ ...current, saving: false, error: message }));
    }
  };

  if (status.reference) {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">Inquiry received</h2>
          <p className="text-slate-600 mb-4">Our team will review the fitment, quantity and shipping information.</p>
          <p className="font-mono text-sm bg-white rounded-xl px-4 py-3">Reference: {status.reference}</p>
        </div>

        {account.created ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-7 text-center">
            <CheckCircle2 size={36} className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-heading text-xl font-bold text-slate-900">Account created</h3>
            <p className="mt-2 text-sm text-slate-600">Your sign-in email is <strong>{status.email}</strong>. This inquiry has been linked to your account.</p>
          </div>
        ) : !user && (
          <form onSubmit={createAccount} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary"><UserPlus size={22} /></div>
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900">Create account to track this inquiry</h3>
                <p className="mt-1 text-sm text-slate-500">Optional. Your inquiry is already submitted and will not be affected if you skip this step.</p>
              </div>
            </div>
            <label className="block mb-4">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Sign-in email</span>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" readOnly value={status.email} className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-11 text-slate-600" />
              </div>
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Create password</span>
                <div className="relative">
                  <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" minLength="8" required autoComplete="new-password" value={account.password} onChange={(event) => setAccount((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-xl border-slate-300 py-3 pl-11" />
                </div>
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">Confirm password</span>
                <input type="password" minLength="8" required autoComplete="new-password" value={account.confirmPassword} onChange={(event) => setAccount((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full rounded-xl border-slate-300 py-3" />
              </label>
            </div>
            {account.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{account.error}</p>}
            <button disabled={account.saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              <UserPlus size={17} />{account.saving ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? '' : 'bg-white border border-slate-200 rounded-3xl p-6 md:p-9 shadow-sm'}>
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
            <input
              name={name}
              type={type}
              required={required}
              min={type === 'number' ? '1' : undefined}
              value={form[name]}
              onChange={update}
              className="w-full rounded-xl border-slate-300"
            />
          </label>
        ))}
        <label className="block">
          <span className="block text-sm font-semibold text-slate-700 mb-2">Loading plan</span>
          <select name="loadingPlan" value={form.loadingPlan} onChange={update} className="w-full rounded-xl border-slate-300">
            <option value="undecided">Need a recommendation</option>
            <option value="mixed-lcl">Mixed / LCL</option>
            <option value="20gp">20GP</option>
            <option value="40hq">40HQ</option>
          </select>
        </label>
      </div>
      <label className="block mt-5">
        <span className="block text-sm font-semibold text-slate-700 mb-2">Finish, packing, reports or other requirements</span>
        <textarea name="message" rows={compact ? 4 : 5} value={form.message} onChange={update} className="w-full rounded-xl border-slate-300" />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={update} />
      </label>
      <p className="text-xs text-slate-500 mt-4">By submitting, you allow Driveline Wheels to use these details to respond to this business inquiry. No payment or order is created.</p>
      {status.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{status.error}</p>}
      <button disabled={status.sending} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-60">
        <Send size={18} />{status.sending ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product') || '';

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
        <QuoteForm initialProduct={product} />
      </main>
    </div>
  );
}
