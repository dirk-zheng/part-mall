import { 
  ShieldCheck, Truck, PackageCheck, Users, MapPin, 
  Mail, Phone, Search, Globe, Cog 
} from 'lucide-react';

const teamMembers = [
  {
    name: 'David Chen',
    role: 'Founder & Managing Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: '20 years in automotive supply chain, formerly procurement director at a major auto parts trading group'
  },
  {
    name: 'Sara Li',
    role: 'Operations Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: '15 years in international trade and logistics, expert in Pearl River Delta automotive supply chain'
  },
  {
    name: 'James Zhang',
    role: 'Sourcing Director',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    bio: 'Former GAC Group supply chain manager, deep relationships with 200+ auto parts manufacturers across Guangdong'
  },
  {
    name: 'Emma Lin',
    role: 'Quality Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    bio: 'Certified IATF 16949 auditor with over a decade of automotive parts quality inspection experience'
  },
];

const values = [
  {
    icon: Search,
    title: 'Vetted Supplier Network',
    description: 'Rooted in Guangzhou, the heart of China\'s automotive industry. We curate 200+ manufacturers with proven quality records — every supplier is audited before you see their parts.'
  },
  {
    icon: ShieldCheck,
    title: 'Automotive-Grade Quality',
    description: 'Our QC team follows IATF 16949-aligned protocols. Every shipment undergoes multi-point inspection — from source factory to our consolidation center to pre-shipment. Zero tolerance for substandard parts.'
  },
  {
    icon: PackageCheck,
    title: 'Reliable Distribution',
    description: 'In-house logistics team managing consolidation, customs, and freight. Full tracking from Guangzhou to your destination with 99%+ on-time delivery rate.'
  },
];

const centers = [
  { name: 'Guangzhou Sourcing Center', address: 'Building A, Guangzhou Science City, Huangpu District, Guangzhou', role: 'Supplier Management · RFQ Processing · Order Management', icon: Search },
  { name: 'Panyu Inspection Center', address: 'Building 5, Huachuang Industrial Park, Panyu District, Guangzhou', role: 'Incoming Inspection · In-Process Audit · Pre-Shipment QC', icon: ShieldCheck },
  { name: 'Nansha Logistics Hub', address: 'Warehouse Zone A, Nansha Port Logistics Park, Guangzhou', role: 'Consolidation · Customs Clearance · Container Loading', icon: Truck },
];

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.15),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Your Auto Parts Partner<br className="md:hidden" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> in Guangzhou</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Rooted in Guangzhou, the largest automotive manufacturing hub in China. We source, inspect,
            and distribute quality auto parts to buyers across 50+ countries.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { icon: Globe, value: '10+ Years', label: 'Industry Experience' },
              { icon: Users, value: '200+', label: 'Vetted Suppliers' },
              { icon: ShieldCheck, value: 'IATF 16949', label: 'QC Standard' },
              { icon: Truck, value: '48H', label: 'Fast Dispatch' },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 text-center min-w-[120px]">
                <item.icon size={24} className="text-blue-400 mx-auto mb-2" />
                <div className="font-heading text-xl font-bold">{item.value}</div>
                <div className="text-xs text-blue-200/60">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  It started in a small office in Tianhe Gangding, Guangzhou in 2014. Our founder, David Chen,
                  saw firsthand how overseas buyers struggled to navigate Guangdong's fragmented auto parts
                  supply chain — language barriers, unreliable quality, and opaque pricing were constant headaches.
                  He envisioned a company that could bridge this gap: a distributor that vets suppliers, inspects
                  parts, and manages logistics so buyers could focus on their business.
                </p>
                <p>
                  We started with a handful of suppliers and a single shared office. Through word-of-mouth and
                  consistent delivery, our reputation grew. European and Middle Eastern buyers began to trust us
                  as their procurement partner in China. We expanded the team, built a dedicated inspection center
                  in Panyu, and established logistics operations at Nansha Port.
                </p>
                <p>
                  Today, DriveLine International connects 200+ vetted auto parts manufacturers in the Pearl
                  River Delta with buyers across 50+ countries. From electronics and lighting to body parts and
                  accessories — we handle sourcing, quality inspection, and global distribution under one roof.
                  Our simple promise hasn't changed: deliver the right parts, at the right quality, on time.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=750&fit=crop"
                  alt="Auto parts quality inspection center"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <div className="text-2xl font-heading font-bold">50+</div>
                  <div className="text-xs opacity-80">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operations Centers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Operations in Guangzhou
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Three dedicated facilities covering the complete distribution chain — from sourcing to shipment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div 
                key={center.name}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                  <center.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2">{center.name}</h3>
                <p className="text-xs text-primary font-medium mb-2">{center.role}</p>
                <div className="flex items-start gap-2 mt-3">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-500">{center.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              From supplier vetting to final delivery — quality you can count on at every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div 
                key={value.title}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Deep expertise in automotive supply chain — delivering reliable parts through experience and domain knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="group text-center"
              >
                <div className="w-32 h-32 mx-auto mb-5 rounded-2xl overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-slate-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,102,255,0.2),transparent_70%)]" />
            
            <div className="relative">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Let's Talk
              </h2>
              <p className="text-blue-200/80 mb-10 max-w-xl mx-auto">
                Looking for a reliable auto parts distributor in Guangzhou? Reach out for a quote or schedule a visit to our sourcing center.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <a href="mailto:info@driveline-global.com" className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                  <Mail size={20} className="text-blue-400" />
                  <span>info@driveline-global.com</span>
                </a>
                <a href="tel:+86-20-8888-6688" className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                  <Phone size={20} className="text-blue-400" />
                  <span>+86-20-8888-6688</span>
                </a>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-blue-200/60 text-sm">
                <MapPin size={14} />
                <span>Building A, Guangzhou Science City, Huangpu, Guangzhou, China</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
