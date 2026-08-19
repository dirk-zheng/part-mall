import { 
  ShieldCheck, Truck, PackageCheck, Users, MapPin, 
  Mail, Phone, Search, Award, Target, Eye
} from 'lucide-react';

const teamMembers = [
  {
    name: 'David Chen',
    role: 'Trade & Customer Service',
    avatar: '/team/david-chen-v2.png',
    bio: 'Based in Guangzhou Yongning wheel industry cluster, David stays close to factories and customers, follows every order, and builds long-term partnerships through practical, reliable service.'
  },
  {
    name: 'Sara Li',
    role: 'Vehicle Fitment & Product Selection',
    avatar: '/team/sara-li-v2.png',
    bio: 'Maintains fitment libraries for popular Southeast Asian Japanese sedans, Middle Eastern SUVs and Hilux pickups, reducing repeated parameter checks and helping customers select faster.'
  },
  {
    name: 'James Zhang',
    role: 'Order & Export Documentation',
    avatar: '/team/james-zhang-v2.png',
    bio: 'Coordinates flexible mixed-container trial orders and stable full-container deliveries from nearby Huangpu Port, with material and fatigue-impact test reports prepared for customs clearance.'
  },
  {
    name: 'Emma Lin',
    role: 'On-site Quality Control',
    avatar: '/team/emma-lin-v2.png',
    bio: 'Randomly opens cartons in the finished-goods warehouse instead of accepting pre-selected samples, checking spoke-root cracks, porosity, dimensions, balance and coating adhesion against a complete checklist.'
  },
];

const values = [
  {
    icon: Eye,
    title: 'Practical Service',
    description: 'We are wheel traders, not a distant platform. We stay close to factories, respond directly, and follow the details of every order.'
  },
  {
    icon: Target,
    title: 'Quality Before Shipment',
    description: 'Our QC starts in the finished-goods warehouse. Random cartons are inspected by us, not pre-selected by the factory.'
  },
  {
    icon: Award,
    title: 'Long-term Partnership',
    description: 'We help distributors and modification shops test the market with flexible orders, then build stable repeat business together.'
  },
];

const centers = [
  { name: 'Yongning Wheel Industry Cluster', address: 'Yongning, Zengcheng District, Guangzhou', role: 'Factory Access · Product Selection · Order Follow-up', icon: Search },
  { name: 'Factory Finished-goods Warehouse', address: 'On site at partner wheel factories', role: 'Random Cartons · Full Checklist · No Pre-selected Samples', icon: ShieldCheck },
  { name: 'Huangpu Port Export Route', address: 'Huangpu Port, Guangzhou', role: 'Mixed Loads · Full Containers · Clearance Documents', icon: Truck },
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
            Rooted in Yongning · Guangzhou, China
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
            A Practical Wheel Trading<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Partner Close to Production
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
            Driveline Wheels works from Guangzhou's Yongning wheel industry cluster, helping distributors
            and modification shops select fitments, control quality and move each order reliably.
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14">
            {[
              { value: 'Yongning', label: 'Close to Wheel Production' },
              { value: 'Random', label: 'Carton Sampling' },
              { value: 'Flexible', label: 'Mixed or Full Container' },
              { value: 'Huangpu', label: 'Nearby Export Port' },
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
                  src="/wheels/wheel-qc-lab.png"
                  alt="Wheel inspection by the Driveline Wheels on-site QC team"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Small badge */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Random Carton QC</div>
                  <div className="text-[10px] text-slate-400">No pre-selected samples</div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-50 text-blue-600">
                Our Story
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Wheel Trade Built<br />
                <span className="text-blue-600">Close to the Factory Floor</span>
              </h2>
              <div className="space-y-5 text-slate-600 leading-relaxed text-base">
                <p>
                  Driveline Wheels is rooted in Yongning, Guangzhou — a wheel industry cluster where
                  factories, products and finished-goods warehouses are close at hand. We do trade,
                  and we believe the value of a trader is practical service and responsibility for details.
                </p>
                <p>
                  Before shipment, we go to the finished-goods warehouse and draw cartons at random.
                  Following a complete checklist, we focus on spoke-root cracks, porosity, dimensions,
                  dynamic balance and coating adhesion. We do not accept samples selected in advance.
                </p>
                <p>
                  We also keep fitment selections for Southeast Asian Japanese sedans, Middle Eastern
                  SUVs and Hilux pickups. Buyers can begin with mixed-container trials, move to stable
                  full containers, and receive material and fatigue-impact reports for customs clearance.
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
              Where We Work
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Close to Every Step of the Order
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              From Yongning factory access and warehouse QC to convenient loading through Huangpu Port
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
              Behind Every Order
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              A Hands-on Team You Can Reach
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We are wheel traders rooted in Guangzhou Yongning. From on-site QC and vehicle fitment to flexible loading and export documents, the same team follows every order through to shipment.
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
                Looking for a Reliable Wheel Partner?
              </h2>
              <p className="text-blue-200/70 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
              We welcome distributors and modification shops looking for steady, long-term cooperation.
              Start with a mixed-container trial and let us take care of each order step by step.
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
                <span>Yongning, Zengcheng District, Guangzhou, China</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
