import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { articlePages } from '../data/seoContent';
import NotFound from './NotFound';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articlePages[slug];
  if (!article) return <NotFound />;

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <article>
        <header className="bg-slate-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-orange-300 uppercase tracking-wider font-semibold text-sm mb-5">Wheel buyer guide</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">{article.title}</h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">{article.intro}</p>
            <div className="flex justify-center gap-5 text-sm text-slate-400"><span className="flex items-center gap-2"><CalendarDays size={16} />{article.date}</span><span className="flex items-center gap-2"><Clock3 size={16} />{article.readTime}</span></div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <img src={article.image} alt={article.title} className="w-full aspect-[16/9] object-cover rounded-3xl border border-slate-200 mb-12" width="960" height="540" />
          <div className="space-y-10">
            {article.sections.map(([title, body]) => <section key={title}><h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">{title}</h2><p className="text-lg text-slate-600 leading-8">{body}</p></section>)}
          </div>
          <aside className="mt-14 bg-white border border-slate-200 rounded-3xl p-8">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">Need help with a live wheel order?</h2>
            <p className="text-slate-600 mb-6">Share your market, target vehicles and order volume. We will clarify the fitment and order information needed next.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-semibold">Send an open inquiry <ArrowRight size={18} /></Link>
          </aside>
        </div>
      </article>
    </div>
  );
}
