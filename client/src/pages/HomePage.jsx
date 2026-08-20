import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Zap, Users, Search, Award, ChevronRight,
  CircleDot, Car, Disc3, Circle, Wrench, Package, Cog, Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { categoryNames } from '../data/products';
import { productSlug } from '../data/seoContent';

const CategoryIcons = {
  'forged-wheel': Disc3,
  'cast-wheel': CircleDot,
  tire: Circle,
  'wheel-set': Package,
  accessory: Wrench,
};

const features = [
  {
    icon: Shield,
    title: 'On-site QC Before Shipment',
    description: 'We randomly open cartons in the finished-goods warehouse and inspect against a complete checklist. Factory-selected samples are not accepted.'
  },
  {
    icon: Search,
    title: 'Local-market Fitment Library',
    description: 'Ready fitment selections for popular Japanese sedans in Southeast Asia, Middle Eastern SUVs and high-volume Hilux pickup applications.'
  },
  {
    icon: Package,
    title: 'Flexible Order Volumes',
    description: 'Start with a mixed-container trial instead of holding heavy inventory. Move to stable full-container supply when the market is proven.'
  },
  {
    icon: Truck,
    title: 'Reports & Export Support',
    description: 'Material, fatigue and impact test reports are prepared to support customs clearance, with convenient loading through nearby Huangpu Port.'
  },
];

const stats = [
  { value: 'Yongning', label: 'Wheel Industry Cluster' },
  { value: 'Random QC', label: 'Cartons Opened On Site' },
  { value: 'Mixed Load', label: 'Trial Orders Welcome' },
  { value: 'Huangpu', label: 'Nearby Export Port' },
];

const milestones = [
  { year: '01', title: 'Understand Your Market', desc: 'We start with your sales region, target customers and locally popular vehicles instead of pushing a generic catalog.' },
  { year: '02', title: 'Confirm the Right Fitments', desc: 'PCD, offset, center bore, wheel size and load requirements are matched against our regional application library.' },
  { year: '03', title: 'Choose a Practical Order Plan', desc: 'Use a mixed-container trial to test demand, then move proven fitments into repeat full-container orders.' },
  { year: '04', title: 'Follow Production Closely', desc: 'Our team stays close to Yongning factories and follows specification, finish, packing and production progress.' },
  { year: '05', title: 'Random-carton On-site QC', desc: 'We draw cartons from finished stock ourselves and check spoke roots, porosity, dimensions, balance and coating adhesion.' },
  { year: '06', title: 'Documents & Huangpu Loading', desc: 'Material and fatigue-impact reports support clearance, while nearby Huangpu Port keeps export handling straightforward.' },
];

const services = [
  {
    icon: Search,
    title: 'Market-ready Wheel Selection',
    desc: 'We maintain practical fitment options for Southeast Asian Japanese sedans, Middle Eastern SUVs and Hilux pickups so buyers spend less time reconfirming parameters.'
  },
  {
    icon: Shield,
    title: 'Pre-shipment On-site QC',
    desc: 'Random cartons are taken directly from finished stock. Spoke-root cracks, porosity, dimensions, dynamic balance and coating adhesion are checked before loading.'
  },
  {
    icon: Truck,
    title: 'Flexible Orders & Documents',
    desc: 'Start with mixed-container trials, scale to stable full containers, and receive the material and fatigue-impact reports needed for customs clearance.'
  },
];

//渲染:渲染HomePage组件或页面内容
export default function HomePage() {
  const { state } = useStore();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <img src="/wheels/hero-wheel.png" alt="Performance wheel and tire" className="absolute inset-0 w-full h-full object-cover object-center md:object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-8">
              <Car size={16} className="text-blue-400" />
              <span className="text-sm text-orange-200">Guangzhou Yongning · Wheel Trading · On-site QC</span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Wheel trading,<br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                done carefully.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl">
              Driveline Wheels is rooted in Guangzhou's Yongning wheel industry cluster. We work hard, stay practical, and take care of every order from fitment selection to on-site QC and export documents.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Explore Wheel Catalog
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Why Driveline Wheels
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => {
              //渲染:渲染列表内容
              return (
<div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200/70 mt-2">{stat.label}</div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Practical support for wheel distributors and modification shops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              //渲染:渲染列表内容
              return (
<div
                key={service.title}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <service.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why <span className="text-primary">Driveline Wheels</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Close to production, careful with quality, flexible with orders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              //渲染:渲染列表内容
              return (
<div
                key={feature.title}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Featured Wheel Programs
              </h2>
              <p className="text-slate-500 text-lg">Practical styles and fitments for local aftermarket demand</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-all font-medium"
            >
              View All Programs
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products.slice(0, 8).map((product) => {
                                              //渲染:渲染列表内容

              const Icon = CategoryIcons[product.category] || Cog;
              return (
                <Link
                  key={product.id}
                  to={`/products/${productSlug(product)}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                                 //处理页面交互事件

                        e.target.src = '/no-image.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200">
                      <Icon size={12} className="text-primary" />
                      <span className="text-xs font-medium text-slate-600">{categoryNames[product.category]}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-medium text-slate-900 mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <span className="text-sm font-semibold text-primary">
                      Request fitment &amp; volume quote
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              How We Handle Every Order
            </h2>
            <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
              A clear, practical process from market fitment to shipment
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-transparent" />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => {
                //渲染:渲染列表内容
                return (
<div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all ${index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'}`}>
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="font-heading font-semibold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-blue-100/60 text-sm">{milestone.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-4 border-slate-900 shrink-0 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Start small. Build a reliable wheel program.
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Tell us your market, popular vehicle models and target styles. Mixed-container trials are welcome, and proven fitments can scale into stable full-container supply.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
            >
              Request a Quote
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:border-primary/30 hover:text-primary transition-all"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
