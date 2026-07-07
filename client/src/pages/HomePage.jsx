import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, Users, Search, Award, ChevronRight, 
  Smartphone, Car, Cable, Watch, Headphones, Package, Cog, Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CategoryIcons = {
  phone: Smartphone,
  computer: Car,
  accessory: Cable,
  wearable: Watch,
  audio: Headphones,
};

const features = [
  {
    icon: Search,
    title: 'Extensive Supplier Network',
    description: 'Deep connections across the Pearl River Delta automotive supply chain. We source from 200+ vetted factories — the right part at the right price, every time.'
  },
  {
    icon: Shield,
    title: 'Rigorous Quality Inspection',
    description: 'Multi-point inspection at source, during transit, and pre-shipment. IATF 16949-aligned QC protocols for automotive-grade reliability.'
  },
  {
    icon: Truck,
    title: 'Fast Global Distribution',
    description: 'Integrated logistics with sea, air, and express options. 48-hour dispatch from our Guangzhou consolidation center to ports worldwide.'
  },
  {
    icon: Cog,
    title: 'Industry Expertise',
    description: 'A team with deep automotive domain knowledge — from OEM specs to aftermarket trends. We speak your language, technically and commercially.'
  },
];

const stats = [
  { value: '10+ Years', label: 'Industry Experience' },
  { value: '200+', label: 'Vetted Suppliers' },
  { value: '50+', label: 'Export Countries' },
  { value: '5,000+', label: 'Parts SKUs' },
];

const milestones = [
  { year: '2014', title: 'Founded in Guangzhou', desc: 'Started as a trading office in Yuexiu, connecting overseas buyers with Guangdong\'s booming auto parts manufacturers.' },
  { year: '2016', title: 'First Major Contract', desc: 'Secured a long-term distribution contract with a European aftermarket chain — our first milestone in becoming a trusted supply partner.' },
  { year: '2018', title: 'QC Center Established', desc: 'Opened our dedicated quality inspection center in Panyu with in-house testing equipment for electronics, lighting, and body parts.' },
  { year: '2020', title: 'Supplier Network Expansion', desc: 'Grew to 150+ vetted suppliers across the Pearl River Delta, covering electronics, lighting, interior, and chassis categories.' },
  { year: '2022', title: 'Digital Procurement Platform', desc: 'Launched our online B2B catalog with real-time inventory, transparent pricing, and end-to-end order tracking for global buyers.' },
  { year: '2024', title: '200+ Suppliers, 50+ Countries', desc: 'Reached 200+ qualified suppliers and export coverage across 50+ countries — our global distribution network continues to grow.' },
];

const services = [
  {
    icon: Search,
    title: 'Auto Parts Sourcing',
    desc: 'Find the exact OEM, aftermarket, or performance parts you need. We leverage our 200+ supplier network across Guangdong to deliver competitive quotes within 48 hours.'
  },
  {
    icon: Shield,
    title: 'Quality Inspection',
    desc: 'In-house QC team with automotive-grade inspection protocols. Every shipment is verified before it leaves Guangzhou — reducing your defect risk to near zero.'
  },
  {
    icon: Truck,
    title: 'Global Distribution',
    desc: 'End-to-end logistics management: consolidation, customs documentation, freight booking, and shipment tracking. From our warehouse to your doorstep.'
  },
];

export default function HomePage() {
  const { state } = useStore();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,102,255,0.2),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-8">
              <Car size={16} className="text-blue-400" />
              <span className="text-sm text-blue-200">Guangzhou · Auto Parts Sourcing · Global Distribution</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Quality Auto Parts<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                from Guangzhou to the World
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl">
              DriveLine International — your trusted automotive parts distributor rooted in Guangzhou, China's largest auto manufacturing hub. We source, inspect, and deliver quality parts to buyers worldwide.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Browse Parts Catalog
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                About Our Company
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200/70 mt-2">{stat.label}</div>
              </div>
            ))}
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
              End-to-end auto parts distribution from our Guangzhou hub
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why <span className="text-primary">DriveLine</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              A decade of automotive supply chain expertise, grounded in Guangzhou's industrial ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Featured Auto Parts
              </h2>
              <p className="text-slate-500 text-lg">Quality automotive parts sourced from our supplier network</p>
            </div>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-all font-medium"
            >
              View All Parts
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products.slice(0, 8).map((product) => {
              const Icon = CategoryIcons[product.category] || Cog;
              return (
                <Link
                  key={product.id}
                  to="/products"
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/f1f5f9/94a3b8?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200">
                      <Icon size={12} className="text-primary" />
                      <span className="text-xs font-medium text-slate-600 capitalize">{product.category}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-medium text-slate-900 mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <span className="font-mono text-lg font-bold text-primary">
                      ${product.price.toLocaleString()}
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
              Our Journey
            </h2>
            <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
              From a small trading office to a trusted global auto parts distributor
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-transparent" />
            
            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Source Quality Auto Parts?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            From OEM components to aftermarket accessories, we find the right parts at the right price. Partner with DriveLine for reliable automotive supply chain solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
            >
              Browse Parts Catalog
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
