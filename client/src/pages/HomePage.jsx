import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Zap, Users, Globe, Award, ChevronRight, 
  Smartphone, Laptop, Cable, Watch, Headphones, TrendingUp, Package, Ship, Handshake
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CategoryIcons = {
  phone: Smartphone,
  computer: Laptop,
  accessory: Cable,
  wearable: Watch,
  audio: Headphones,
};

const features = [
  {
    icon: Globe,
    title: 'Global Sourcing',
    description: 'Access premium suppliers across 50+ countries. We source the best products at competitive prices through our extensive network.'
  },
  {
    icon: Ship,
    title: 'End-to-End Logistics',
    description: 'From factory to destination, we handle shipping, customs clearance, warehousing, and last-mile delivery seamlessly.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Rigorous quality control at every stage. ISO 9001 certified inspection processes ensure every shipment meets international standards.'
  },
  {
    icon: Handshake,
    title: 'Trusted Partnership',
    description: '10,000+ satisfied clients worldwide trust us for reliable supply chain management and long-term business relationships.'
  },
];

const stats = [
  { value: '50+', label: 'Countries Served' },
  { value: '10K+', label: 'Happy Clients' },
  { value: '5M+', label: 'Products Shipped' },
  { value: '99.7%', label: 'On-Time Delivery' },
];

const milestones = [
  { year: '2012', title: 'Company Founded', desc: 'Atlas Bridge was established in Shenzhen with a vision to connect global markets through efficient trade solutions.' },
  { year: '2014', title: 'First Major Contract', desc: 'Secured partnership with top European retailers, expanding our supply chain across 12 countries.' },
  { year: '2016', title: 'Warehouse Expansion', desc: 'Opened distribution centers in Rotterdam, Los Angeles, and Dubai, tripling our logistics capacity.' },
  { year: '2018', title: 'Digital Platform Launch', desc: 'Launched our proprietary B2B trading platform, enabling real-time order tracking and supplier management.' },
  { year: '2020', title: 'Global Resilience', desc: 'Navigated global supply chain challenges, maintaining 98% fulfillment rate while expanding to new markets.' },
  { year: '2024', title: 'Industry Leadership', desc: 'Recognized as a Top 50 Global Trading Company with annual revenue exceeding $2 billion.' },
];

const services = [
  {
    icon: Package,
    title: 'Product Sourcing',
    desc: 'Find the right suppliers across Asia, Europe, and the Americas. We negotiate the best terms on your behalf.'
  },
  {
    icon: Ship,
    title: 'Shipping & Logistics',
    desc: 'Air, sea, and rail freight solutions tailored to your timeline and budget. Full customs documentation included.'
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    desc: 'Data-driven insights on pricing trends, demand forecasting, and competitive analysis to guide your purchasing decisions.'
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
              <Award size={16} className="text-blue-400" />
              <span className="text-sm text-blue-200">Global Sourcing · Supply Chain · Trade Solutions</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Bridging Markets<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Delivering Excellence
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl">
              Atlas Bridge International — Your trusted partner in global trade. We source, ship, and deliver quality products across borders with unmatched reliability.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
              >
                View Products
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                About Us
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
              Comprehensive trade solutions tailored to your business needs
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
              Why Choose <span className="text-primary">Atlas Bridge</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We deliver value through expertise, reliability, and a global network built over a decade
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
                Featured Products
              </h2>
              <p className="text-slate-500 text-lg">Explore our extensive product catalog</p>
            </div>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-all font-medium"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.products.slice(0, 8).map((product) => {
              const Icon = CategoryIcons[product.category] || Smartphone;
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
              From a small trading desk to a global supply chain leader
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
            Ready to Grow Your Business?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're sourcing products or expanding into new markets, Atlas Bridge has the expertise and network to make it happen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
            >
              Browse Products
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:border-primary/30 hover:text-primary transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
