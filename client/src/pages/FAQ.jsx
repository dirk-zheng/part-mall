import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';

//渲染:渲染FAQ组件或页面内容
export default function FAQ({ initialFaqs = [] }) {
  const [faqItems, setFaqItems] = useState(initialFaqs);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
              //同步前台最新的已发布FAQ数据
    let active = true;

    //请求公开FAQ接口并更新页面内容
    async function loadPublishedFaqs() {
      try {
        const response = await fetch('/api/faqs');
        if (!response.ok) throw new Error('Unable to load published FAQs');
        const result = await response.json();
        if (active && Array.isArray(result.data?.list)) setFaqItems(result.data.list);
      } catch (error) {
        console.warn('Published FAQ refresh failed:', error);
      }
    }

    loadPublishedFaqs();
    return () => {
             //停止已卸载页面的数据更新
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
                                  //根据已发布FAQ生成分类筛选项
    return ['All', ...new Set(faqItems.map((item) => {
                                           //提取FAQ分类名称
      return item.category;
    }).filter(Boolean))];
  }, [faqItems]);

  const visibleItems = useMemo(() => {
                                 //计算并缓存派生数据

    const search = query.trim().toLowerCase();
    return faqItems.filter((item) => {
                             //筛选符合条件的数据

      const inCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !search || `${item.question} ${item.answer}`.toLowerCase().includes(search);
      return inCategory && matchesSearch;
    });
  }, [faqItems, activeCategory, query]);

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
              onChange={(event) => {
                          //处理页面交互事件
                          return setQuery(event.target.value);
                        }}
              placeholder="Search MOQ, fitment, inspection, shipping..."
              className="w-full bg-white border-0 rounded-2xl py-4 pl-14 pr-5 text-slate-900 shadow-2xl shadow-black/20"
            />
          </label>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8" aria-label="FAQ categories">
          {categories.map((category) => {
            //渲染:渲染列表内容
            return (
<button
              key={category}
              type="button"
              onClick={() => {
                         //处理页面交互事件
                         return setActiveCategory(category);
                       }}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                activeCategory === category
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {category}
            </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_20rem] gap-8 items-start">
          <section className="space-y-3" aria-live="polite">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-2xl font-bold text-slate-900">{activeCategory === 'All' ? 'Frequently asked questions' : activeCategory}</h2>
              <span className="text-sm text-slate-400">{visibleItems.length} answers</span>
            </div>
            {visibleItems.length > 0 ? visibleItems.map((item) => {
                                                          //渲染:渲染列表内容
              return (
                <details key={item.id || item.question} className="group bg-white border border-slate-200 open:border-primary/30 rounded-2xl overflow-hidden transition-colors">
                  <summary className="w-full flex cursor-pointer list-none items-center gap-4 p-5 md:p-6 text-left [&::-webkit-details-marker]:hidden">
                    <span className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center bg-orange-50 text-primary group-open:bg-primary group-open:text-white">
                      <HelpCircle size={18} />
                    </span>
                    <span className="flex-1 font-semibold text-slate-900">{item.question}</span>
                    <ChevronDown size={20} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 md:px-6 pb-6 pl-[4.75rem] md:pl-[5.25rem]">
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                    <span className="inline-block mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</span>
                  </div>
                </details>
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
                {['Destination market', 'Popular vehicle models', 'Target sizes and finishes', 'Estimated order quantity'].map((item) => {
                  //渲染:渲染列表内容
                  return (
<li key={item} className="flex gap-2.5"><CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />{item}</li>
                  );
                })}
              </ul>
            </div>
            <Link to="/news-blog/" className="flex items-center justify-between gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-5 text-sm font-semibold text-orange-800 hover:border-orange-300 transition-colors">
              Explore our technical guides <ArrowRight size={17} />
            </Link>
          </aside>
        </div>

        <section className="mt-16 overflow-hidden rounded-3xl bg-slate-950 text-white">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 p-8 md:p-12 lg:p-14 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300 mb-4">About Driveline Wheels</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-5">
                A practical wheel trading team rooted in Guangzhou Yongning
              </h2>
              <p className="text-slate-300 leading-relaxed max-w-2xl">
                We support distributors and modification shops with local-market fitment selection, order coordination, random-carton warehouse QC and export documents. We stay close to the work and keep the same team accountable through shipment.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/about" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 hover:bg-orange-50 transition-colors">
                  Learn about our team <ArrowRight size={17} />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors">
                  Request a quote <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {[
                'Fitment support for popular vehicles in your market',
                'Random cartons selected from finished stock for agreed QC checks',
                'Mixed-load planning, test-report coordination and export documents',
              ].map((item) => {
                return (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-orange-300" />
                    <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
