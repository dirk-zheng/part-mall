import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3,
  Lightbulb, Ruler, Search, Settings2, ShoppingBag, Tag
} from 'lucide-react';
import { articleCards } from '../data/seoContent';

const categories = [
  { id: 'all', label: 'All insights', icon: BookOpen },
  { id: 'technical', label: 'Technical', icon: Settings2 },
  { id: 'fitment', label: 'Fitment', icon: Ruler },
  { id: 'knowledge', label: 'Knowledge', icon: Lightbulb },
  { id: 'buying', label: 'Buying Guide', icon: ShoppingBag },
];

const articles = [
  {
    id: 1,
    category: 'technical',
    title: 'Forged vs. cast wheels: what buyers should compare',
    summary: 'A practical comparison of manufacturing method, strength-to-weight ratio, pricing and the applications where each construction makes sense.',
    date: 'Aug 18, 2026',
    readTime: '6 min read',
    image: '/wheels/apex-f1.png',
    featured: true,
  },
  {
    id: 2,
    category: 'fitment',
    title: 'Wheel fitment basics: PCD, offset and center bore',
    summary: 'Understand the three measurements that decide whether a wheel mounts correctly, clears the suspension and sits properly in the arch.',
    date: 'Aug 12, 2026',
    readTime: '8 min read',
    image: '/wheels/wheel-qc-lab.png',
  },
  {
    id: 3,
    category: 'buying',
    title: 'How to plan a mixed-container trial order',
    summary: 'Balance sizes, finishes and vehicle applications without overloading your first order with slow-moving inventory.',
    date: 'Aug 5, 2026',
    readTime: '5 min read',
    image: '/wheels/urbansport-set.png',
  },
  {
    id: 4,
    category: 'knowledge',
    title: 'Wheel load rating explained for distributors',
    summary: 'Learn how vehicle weight, use case and safety margin affect the load rating you should specify for passenger cars, SUVs and pickups.',
    date: 'Jul 29, 2026',
    readTime: '7 min read',
    image: '/wheels/trailcore-at-set.png',
  },
  {
    id: 5,
    category: 'technical',
    title: 'What a useful pre-shipment wheel inspection covers',
    summary: 'From spoke roots and porosity to runout, balance and coating adhesion: the checkpoints worth recording before loading.',
    date: 'Jul 21, 2026',
    readTime: '9 min read',
    image: '/quality-center.png',
  },
  {
    id: 6,
    category: 'fitment',
    title: 'Building a fitment mix for your local vehicle market',
    summary: 'A repeatable way to turn popular vehicle models into a commercially useful mix of diameters, widths, PCDs and offsets.',
    date: 'Jul 15, 2026',
    readTime: '6 min read',
    image: '/wheels/touring-pro.png',
  },
  {
    id: 7,
    category: 'buying',
    title: 'Seven questions to ask before requesting a wheel quote',
    summary: 'Share the right market, fitment, finish, packaging and volume details to receive a quotation you can actually compare.',
    date: 'Jul 8, 2026',
    readTime: '4 min read',
    image: '/wheels/streetline-s8.png',
  },
];

const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));

export default function NewsBlog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const search = query.trim().toLowerCase();
    return articles.filter((article) => {
      const inCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch = !search || `${article.title} ${article.summary}`.toLowerCase().includes(search);
      return inCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  const featured = articles.find((article) => article.id === 2);

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute -top-32 right-0 w-[34rem] h-[34rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-400/20 bg-orange-400/10 text-orange-200 text-sm mb-6">
              <BookOpen size={15} />
              Driveline Knowledge Center
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-5">
              Make better wheel<br />buying decisions.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              Technical explainers, fitment know-how and field-tested purchasing guides for wheel distributors and modification shops.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <section className="grid lg:grid-cols-[1.3fr_.7fr] gap-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-14">
          <div className="relative min-h-[320px] overflow-hidden">
            <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">Editor&apos;s pick</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">{featured.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{featured.summary}</p>
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-7">
              <span className="flex items-center gap-1.5"><CalendarDays size={15} />{featured.date}</span>
              <span className="flex items-center gap-1.5"><Clock3 size={15} />{featured.readTime}</span>
            </div>
            <Link to="/news-blog/wheel-fitment-pcd-offset-center-bore" className="inline-flex items-center gap-2 text-primary font-semibold self-start hover:gap-3 transition-all">Read a fitment guide <ArrowRight size={18} /></Link>
          </div>
        </section>

        <section aria-labelledby="latest-insights">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Knowledge library</p>
              <h2 id="latest-insights" className="font-heading text-3xl font-bold text-slate-900">Latest insights</h2>
            </div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Search articles</span>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the knowledge center"
                className="w-full rounded-xl py-3 pl-11 pr-4 text-sm"
              />
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3 mb-7" aria-label="Article categories">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  activeCategory === id
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary'
                }`}
              >
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const category = categoryById[article.category];
                return (
                  <article key={article.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-semibold text-slate-700 shadow-sm">
                        <Tag size={12} className="text-primary" />{category.label}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span>{article.date}</span><span className="w-1 h-1 rounded-full bg-slate-300" /><span>{article.readTime}</span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-slate-900 leading-snug mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-5">{article.summary}</p>
                      {articleCards[article.id] ? <Link to={`/news-blog/${articleCards[article.id]}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">Read article <ArrowRight size={16} /></Link> : <span className="text-sm text-slate-400">Guide in preparation</span>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
              <Search size={32} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">No matching articles</h3>
              <p className="text-sm text-slate-500">Try another keyword or category.</p>
            </div>
          )}
        </section>

        <section className="mt-16 rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 p-8 md:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-orange-100 text-sm font-medium mb-3"><CheckCircle2 size={17} />Need an answer for a live order?</div>
            <h2 className="font-heading text-3xl font-bold mb-3">Start with the questions buyers ask most.</h2>
            <p className="text-orange-50/90">From MOQ and fitment confirmation to QC and shipping documents, our FAQ gives you the practical details.</p>
          </div>
          <Link to="/faq" className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-orange-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            Browse FAQ <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
