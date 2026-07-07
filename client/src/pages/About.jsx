import { 
  ShieldCheck, Truck, PackageCheck, Users, MapPin, 
  Mail, Phone, Search, Globe, Award, Target, Eye
} from 'lucide-react';

const teamMembers = [
  {
    name: 'David Chen',
    role: 'Founder & Managing Director',
    avatar: '/team/david-chen.png',
    bio: '20 years in automotive supply chain, formerly procurement director at a major auto parts trading group'
  },
  {
    name: 'Sara Li',
    role: 'Operations Director',
    avatar: '/team/sara-li.png',
    bio: '15 years in international trade and logistics, expert in Pearl River Delta automotive supply chain'
  },
  {
    name: 'James Zhang',
    role: 'Sourcing Director',
    avatar: '/team/james-zhang.png',
    bio: 'Former GAC Group supply chain manager, deep relationships with 200+ auto parts manufacturers across Guangdong'
  },
  {
    name: 'Emma Lin',
    role: 'Quality Manager',
    avatar: '/team/emma-lin.png',
    bio: 'Certified IATF 16949 auditor with over a decade of automotive parts quality inspection experience'
  },
];

const values = [
  {
    icon: Eye,
    title: 'Vision',
    description: 'To become the most trusted bridge between global buyers and China\'s premium auto parts manufacturers — making quality sourcing simple, transparent, and reliable.'
  },
  {
    icon: Target,
    title: 'Mission',
    description: 'We vet, inspect, and deliver quality auto parts from Guangzhou\'s finest factories to customers worldwide — handling complexity so you don\'t have to.'
  },
  {
    icon: Award,
    title: 'Commitment',
    description: 'Every part shipped carries our reputation. IATF 16949-aligned QC, factory audits, and end-to-end logistics — quality you can count on, every single time.'
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
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,102,255,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
            Established 2014 · Guangzhou, China
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trusted Auto Parts<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Sourcing Partner in Guangzhou
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
            We source, inspect, and distribute quality auto parts from 200+ vetted manufacturers 
            in the Pearl River Delta to buyers across 50+ countries.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '200+', label: 'Vetted Suppliers' },
              { value: '50+', label: 'Countries Served' },
              { value: '99%', label: 'On-Time Delivery' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="text-sm text-blue-300/60 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/quality-center.png"
                  alt="Auto parts quality inspection center"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <Globe size={28} className="mx-auto mb-1" />
                  <div className="text-xs font-medium opacity-80">Global Reach</div>
                </div>
              </div>
              {/* Small badge */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">IATF 16949</div>
                  <div className="text-[10px] text-slate-400">QC Standard</div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-50 text-blue-600">
                Our Story
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                From a Small Office<br />
                <span className="text-blue-600">to a Global Supply Chain</span>
              </h2>
              <div className="space-y-5 text-slate-600 leading-relaxed text-base">
                <p>
                  It started in a small office in Tianhe Gangding, Guangzhou in 2014. Our founder, 
                  David Chen, saw firsthand how overseas buyers struggled to navigate Guangdong's 
                  fragmented auto parts supply chain — language barriers, unreliable quality, and 
                  opaque pricing were constant headaches.
                </p>
                <p>
                  Through word-of-mouth and consistent delivery, our reputation grew. European and 
                  Middle Eastern buyers began to trust us as their procurement partner. We expanded 
                  the team, built a dedicated inspection center in Panyu, and established logistics 
                  operations at Nansha Port.
                </p>
                <p>
                  Today, DriveLine International connects 200+ vetted auto parts manufacturers in the 
                  Pearl River Delta with buyers worldwide. From electronics and lighting to body parts 
                  and accessories — we handle sourcing, quality inspection, and global distribution 
                  under one roof.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vision / Mission / Commitment ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div 
                key={value.title}
                className="relative group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-b bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-top scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-4">
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

      {/* ─── Operations Centers ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-50 text-blue-600">
              Our Infrastructure
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Three Facilities, One Mission
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Covering the complete distribution chain — from sourcing to shipment — all based in Guangzhou
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {centers.map((center, index) => (
              <div 
                key={center.name}
                className="relative bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <center.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{center.name}</h3>
                <p className="text-xs text-blue-600 font-semibold mb-4 tracking-wide">{center.role}</p>
                <div className="flex items-start gap-2 pt-4 border-t border-slate-200">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-500 leading-relaxed">{center.address}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Arrow */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-300" />
            <span className="text-xs text-slate-400 font-medium tracking-wider">SEAMLESS FLOW</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-300" />
          </div>
        </div>
      </section>

      {/* ─── Leadership Team ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-50 text-blue-600">
              Our People
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Decades of combined expertise in automotive supply chain — guiding every decision with deep domain knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                {/* Avatar */}
                <div className="relative inline-block mb-5">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-slate-50 group-hover:ring-blue-100 transition-all duration-300">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                </div>

                <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,102,255,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-white/10 text-blue-300 border border-white/10">
                Get in Touch
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                Ready to Source Smarter?
              </h2>
              <p className="text-blue-200/70 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                Looking for a reliable auto parts distributor in Guangzhou? 
                Reach out for a quote or schedule a visit to our sourcing center.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <a 
                  href="mailto:info@driveline-global.com" 
                  className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                  <Mail size={20} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                  <span className="font-medium">info@driveline-global.com</span>
                </a>
                <a 
                  href="tel:+86-20-8888-6688" 
                  className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                  <Phone size={20} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                  <span className="font-medium">+86-20-8888-6688</span>
                </a>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-blue-300/50 text-sm">
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
