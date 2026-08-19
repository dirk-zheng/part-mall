import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';

const categories = ['All', 'Fitment', 'Orders', 'Quality', 'Customization', 'Shipping', 'After-sales'];

const faqItems = [
  { category: 'Fitment', question: 'How do you verify that a wheel fits my target vehicle?', answer: 'Send us the vehicle make, model, year, market and any brake or suspension changes. We cross-check wheel diameter, width, PCD, offset, center bore, load requirement and brake clearance. Final specifications are confirmed on the quotation and proforma invoice before production.' },
  { category: 'Fitment', question: 'Can you help build a fitment list for my local market?', answer: 'Yes. Tell us your sales country and the vehicles that sell well locally. We can turn that information into a focused application list, then recommend a practical mix of sizes, PCDs and offsets for a trial order.' },
  { category: 'Orders', question: 'What is the minimum order quantity?', answer: 'MOQ depends on construction, size, finish and whether an item is already in regular production. Mixed-container trial orders are welcome, so you can test several proven fitments without committing to a full container of one style.' },
  { category: 'Orders', question: 'What information do you need for an accurate quotation?', answer: 'Please share your destination market, target vehicle applications, wheel construction and sizes, preferred finishes, estimated quantity, packaging requirements and destination port. The clearer the brief, the more useful the quotation and loading plan will be.' },
  { category: 'Quality', question: 'What does your pre-shipment inspection include?', answer: 'Our team draws cartons at random from finished stock rather than accepting factory-selected samples. Depending on the order, checks cover appearance, spoke roots, porosity, dimensions, runout, dynamic balance, coating adhesion, markings, accessories and packaging.' },
  { category: 'Quality', question: 'Can you provide wheel test reports?', answer: 'Material, fatigue and impact test reports can be supplied where available or arranged according to the confirmed product and market requirement. Tell us which standard your customs authority or customer needs before placing the order.' },
  { category: 'Customization', question: 'Can I order a custom finish, cap or logo?', answer: 'Custom finishes, center caps, logos and cartons are possible for qualifying quantities. We confirm artwork, color reference, sample approval, tooling if needed, and any additional lead time before production begins.' },
  { category: 'Shipping', question: 'How are wheels packed for export?', answer: 'Standard export packing typically uses protective sleeves, face protection, rim guards and strong cartons. Pallets, reinforced cartons, custom marks and accessory placement can be specified according to your handling and retail needs.' },
  { category: 'Shipping', question: 'Which shipping documents can you prepare?', answer: 'We coordinate the commercial invoice, packing list and standard export documentation. Certificate of origin, test reports or market-specific supporting documents can be discussed during quotation so requirements are clear before loading.' },
  { category: 'Shipping', question: 'How long does production and delivery take?', answer: 'Lead time varies with construction, finish, quantity and factory schedule. We provide an estimated production window with the quotation, follow progress during production, then coordinate loading through the agreed port. Transit time depends on the destination and sailing schedule.' },
  { category: 'After-sales', question: 'What happens if goods arrive damaged or incorrect?', answer: 'Keep the cartons and take clear photos or video of the packaging, labels and affected products as soon as the issue is found. Send us the quantity and order reference promptly. We review the evidence against inspection and loading records, then agree on a practical resolution under the confirmed order terms.' },
  { category: 'After-sales', question: 'What warranty coverage is included?', answer: 'Coverage depends on the product and confirmed order terms. It applies to verified manufacturing defects, not incorrect fitment, overloading, impact damage, improper installation or normal cosmetic wear. Specific terms are stated in the sales agreement.' },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState(faqItems[0].question);

  useEffect(() => {
    document.title = 'Frequently Asked Wheel Purchasing Questions | Driveline Wheels';
    return () => { document.title = 'Driveline Wheels'; };
  }, []);

  const visibleItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return faqItems.filter((item) => {
      const inCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !search || `${item.question} ${item.answer}`.toLowerCase().includes(search);
      return inCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute left-1/2 -top-40 w-[40rem] h-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-400/20 bg-orange-400/10 text-orange-200 text-sm mb-6">
            <HelpCircle size={15} /> Buyer FAQ
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-5">Answers before you order.</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Clear, practical answers about fitment, order quantities, quality control, customization and export shipping.
          </p>
          <label className="relative block max-w-2xl mx-auto text-left">
            <span className="sr-only">Search frequently asked questions</span>
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search MOQ, fitment, inspection, shipping..."
              className="w-full bg-white border-0 rounded-2xl py-4 pl-14 pr-5 text-slate-900 shadow-2xl shadow-black/20"
            />
          </label>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8" aria-label="FAQ categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                activeCategory === category
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_20rem] gap-8 items-start">
          <section className="space-y-3" aria-live="polite">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl font-bold text-slate-900">{activeCategory === 'All' ? 'Frequently asked questions' : activeCategory}</h2>
              <span className="text-sm text-slate-400">{visibleItems.length} answers</span>
            </div>
            {visibleItems.length > 0 ? visibleItems.map((item) => {
              const isOpen = openQuestion === item.question;
              return (
                <article key={item.question} className={`bg-white border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-primary/30' : 'border-slate-200'}`}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenQuestion(isOpen ? '' : item.question)}
                      className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                    >
                      <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${isOpen ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
                        <HelpCircle size={18} />
                      </span>
                      <span className="flex-1 font-semibold text-slate-900">{item.question}</span>
                      <ChevronDown size={20} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="px-5 md:px-6 pb-6 pl-[4.75rem] md:pl-[5.25rem] animate-fade-in">
                      <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                      <span className="inline-block mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</span>
                    </div>
                  )}
                </article>
              );
            }) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <Search size={32} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">No matching answers</h3>
                <p className="text-sm text-slate-500">Try a shorter keyword or select another category.</p>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-24 space-y-5">
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-5"><MessageCircle size={22} /></div>
              <h2 className="font-heading text-xl font-bold mb-2">Still need help?</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">Share your market, vehicle list and target quantity. Our team will help clarify the next step.</p>
              <a href="mailto:info@driveline-global.com" className="inline-flex items-center gap-2 text-orange-300 font-semibold text-sm hover:text-orange-200">
                Contact our team <ArrowRight size={16} />
              </a>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">A faster quotation starts with:</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {['Destination market', 'Popular vehicle models', 'Target sizes and finishes', 'Estimated order quantity'].map((item) => (
                  <li key={item} className="flex gap-2.5"><CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </div>
            <Link to="/news-blog/" className="flex items-center justify-between gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-5 text-sm font-semibold text-orange-800 hover:border-orange-300 transition-colors">
              Explore our technical guides <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
