import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, PackageCheck, Ruler, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { productSlug } from '../data/seoContent';

export default function ProductDetail() {
  const { slug } = useParams();
  const { state } = useStore();
  const product = state.products.find((item) => productSlug(item) === slug);

  if (!product && state.loading) {
    return <div className="min-h-screen pt-28 text-center text-slate-500">Loading wheel program…</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">Wheel program not found</h1>
        <Link to="/products" className="text-primary font-semibold">Browse all wheel programs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link to="/products" className="hover:text-primary">Wheel programs</Link><span>/</span><span className="text-slate-800">{product.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" width="800" height="600" />
          </div>
          <div>
            <p className="text-primary font-semibold uppercase tracking-wider text-sm mb-3">Wholesale wheel program</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">{product.name}</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">{product.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                [Ruler, 'Fitment checked', 'PCD, offset, center bore, load and brake clearance confirmed for the target vehicle.'],
                [ShieldCheck, 'Order-level QC', 'Inspection scope and sampling are agreed against the confirmed order.'],
                [PackageCheck, 'Export packing', 'Finish protection, accessories, carton marks and loading requirements reviewed.'],
                [CheckCircle2, 'Documents by requirement', 'Available reports are confirmed for the exact model and destination market.'],
              ].map(([Icon, title, text]) => (
                <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <Icon size={22} className="text-primary mb-3" />
                  <h2 className="font-semibold text-slate-900 mb-1">{title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90">
              Request fitment and volume quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <section className="mt-16 bg-slate-900 text-white rounded-3xl p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Information needed before confirmation</h2>
          <p className="text-slate-300 max-w-3xl leading-relaxed mb-6">Share the destination market, vehicle make, model, year and trim, plus any brake or suspension changes. Final availability, MOQ, finish, packaging, lead time and supporting documents are confirmed in the quotation.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services/quality-control" className="text-orange-300 font-semibold">View our QC process</Link>
            <Link to="/products" className="inline-flex items-center gap-1 text-white font-semibold"><ArrowLeft size={16} /> Back to programs</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
