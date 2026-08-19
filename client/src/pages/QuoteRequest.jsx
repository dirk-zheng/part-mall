import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ClipboardList, FileCheck2, Layers3,
  Loader2, Minus, PackageCheck, Plus, Send, Trash2, Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const reportOptions = [
  { id: 'material', label: 'Material report' },
  { id: 'fatigue', label: 'Fatigue test report' },
  { id: 'impact', label: 'Impact test report' },
  { id: 'clearance', label: 'Customs clearance support' },
];

const initialForm = {
  market: '',
  vehicleModels: '',
  specifications: '',
  estimatedQuantity: '',
  containerType: 'mixed-lcl',
  reportRequirements: [],
  notes: '',
};

export default function QuoteRequest() {
  const {
    state,
    removeFromMixedLoad,
    updateQuantity,
    clearMixedLoad,
    submitQuote,
  } = useStore();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const totalUnits = state.mixedLoad.reduce((sum, item) => sum + item.quantity, 0);

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const toggleReport = (reportId) => {
    setForm(current => ({
      ...current,
      reportRequirements: current.reportRequirements.includes(reportId)
        ? current.reportRequirements.filter(id => id !== reportId)
        : [...current.reportRequirements, reportId],
    }));
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(productId, quantity);
    } catch (err) {
      setError(err.message || 'Unable to update the requested quantity');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear every program from this mixed load?')) return;
    try {
      await clearMixedLoad();
    } catch (err) {
      setError(err.message || 'Unable to clear the mixed load');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await submitQuote(form);
      setSubmitted(result);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Unable to submit the quote request');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="w-full max-w-xl mx-4 rounded-3xl bg-white border border-dark-200 p-8 md:p-10 text-center shadow-xl animate-bounce-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
            <PackageCheck size={40} className="text-green-600" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600 mb-2">Request received</p>
          <h1 className="font-heading text-3xl font-bold text-dark-900 mb-3">Your mixed-load RFQ is ready for review</h1>
          <p className="text-dark-500 leading-relaxed mb-6">
            Our team will check vehicle fitment, loading options and report requirements before preparing a practical quotation.
          </p>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 mb-8">
            <span className="block text-xs text-dark-400 mb-1">RFQ reference</span>
            <strong className="font-mono text-xl text-primary">{submitted.reference}</strong>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity">
              Browse More Programs
            </Link>
            <button
              type="button"
              onClick={() => setSubmitted(null)}
              className="px-6 py-3 rounded-xl border border-dark-200 text-dark-700 font-semibold hover:border-primary/40 hover:text-primary transition-colors"
            >
              Start Another RFQ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.mixedLoad.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center animate-fade-in px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white border border-dark-200 flex items-center justify-center shadow-lg">
            <Layers3 size={48} className="text-dark-300" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-3 text-dark-900">Build a Mixed Load</h1>
          <p className="text-dark-500 mb-7 max-w-md">Select wheel programs first, then tell us your market, vehicles, target quantities and document needs.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <ArrowLeft size={18} />
            Browse Wheel Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Layers3 size={17} /> Mixed-container inquiry
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-900">Build Mixed Load</h1>
            <p className="text-dark-500 mt-2">Combine programs for fitment review and a volume-based export quotation.</p>
          </div>
          <button onClick={handleClear} className="inline-flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start">
            <Trash2 size={18} /> Clear Mixed Load
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <section className="bg-white rounded-3xl border border-dark-200 p-5 md:p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-xl text-dark-900">Selected Programs</h2>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">{totalUnits} requested units</span>
            </div>
            <div className="space-y-4">
              {state.mixedLoad.map(item => (
                <article key={item.product.id} className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" onError={event => { event.currentTarget.src = '/no-image.png'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-dark-900 leading-snug">{item.product.name}</h3>
                        <p className="text-xs text-dark-500 line-clamp-2 mt-1">{item.product.description}</p>
                      </div>
                      <button type="button" onClick={() => removeFromMixedLoad(item.product.id)} className="p-1.5 text-dark-400 hover:text-red-500 rounded-lg hover:bg-red-50" aria-label={`Remove ${item.product.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-dark-500 mr-1">Qty</span>
                      <button type="button" onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 rounded-lg bg-white border border-dark-200 flex items-center justify-center disabled:opacity-40">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-mono text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-dark-200 flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <Plus size={16} /> Add more wheel programs
            </Link>
          </section>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-dark-200 p-6 md:p-8 shadow-sm space-y-7">
            <div className="flex items-start gap-3 pb-6 border-b border-dark-100">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><ClipboardList size={23} className="text-primary" /></div>
              <div>
                <h2 className="font-heading font-semibold text-xl text-dark-900">Quote Request Details</h2>
                <p className="text-sm text-dark-500 mt-1">We use these details to check fitment, loading and document availability before quoting.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="block text-sm font-semibold text-dark-700">Target market <span className="text-red-500">*</span></span>
                <input required value={form.market} onChange={event => updateField('market', event.target.value)} placeholder="e.g. Thailand, Saudi Arabia" className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </label>
              <label className="space-y-2">
                <span className="block text-sm font-semibold text-dark-700">Estimated quantity <span className="text-red-500">*</span></span>
                <input required min="1" type="number" value={form.estimatedQuantity} onChange={event => updateField('estimatedQuantity', event.target.value)} placeholder="Total wheels or sets" className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="block text-sm font-semibold text-dark-700">Vehicle models <span className="text-red-500">*</span></span>
              <textarea required rows="3" value={form.vehicleModels} onChange={event => updateField('vehicleModels', event.target.value)} placeholder="Make, model, year and market version — e.g. Toyota Hilux 2022, GCC" className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
            </label>

            <label className="space-y-2 block">
              <span className="block text-sm font-semibold text-dark-700">Wheel specifications <span className="text-red-500">*</span></span>
              <textarea required rows="3" value={form.specifications} onChange={event => updateField('specifications', event.target.value)} placeholder="Diameter, width, PCD, offset, center bore, load rating, finish and packing" className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
            </label>

            <label className="space-y-2 block">
              <span className="flex items-center gap-2 text-sm font-semibold text-dark-700"><Truck size={16} /> Container plan <span className="text-red-500">*</span></span>
              <select required value={form.containerType} onChange={event => updateField('containerType', event.target.value)} className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white">
                <option value="mixed-lcl">Mixed-container / LCL trial</option>
                <option value="20gp">20GP full container</option>
                <option value="40hq">40HQ full container</option>
                <option value="undecided">Not decided — please advise</option>
              </select>
            </label>

            <fieldset className="space-y-3">
              <legend className="flex items-center gap-2 text-sm font-semibold text-dark-700"><FileCheck2 size={16} /> Report and clearance requirements</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                {reportOptions.map(option => (
                  <label key={option.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.reportRequirements.includes(option.id) ? 'border-primary bg-primary/5' : 'border-dark-200 hover:border-primary/30'}`}>
                    <input type="checkbox" checked={form.reportRequirements.includes(option.id)} onChange={() => toggleReport(option.id)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-dark-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="space-y-2 block">
              <span className="block text-sm font-semibold text-dark-700">Additional requirements</span>
              <textarea rows="3" value={form.notes} onChange={event => updateField('notes', event.target.value)} placeholder="Destination port, certification standard, packaging, logo or other instructions" className="w-full px-4 py-3 rounded-xl border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y" />
            </label>

            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex gap-3 text-sm text-blue-800">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <p>This is a quotation request, not a payment or confirmed order. Specifications, availability, pricing and delivery terms will be confirmed by our team.</p>
            </div>

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-primary/20">
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {submitting ? 'Submitting RFQ...' : 'Submit Quote Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
