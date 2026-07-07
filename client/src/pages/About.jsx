import { 
  Target, Eye, Heart, Users, MapPin, Mail, Phone, 
  Linkedin, Github, Globe, Award, TrendingUp 
} from 'lucide-react';

const teamMembers = [
  {
    name: 'David Chen',
    role: 'Founder & CEO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: '20+ years in international trade, former VP at a Fortune 500 trading group'
  },
  {
    name: 'Sarah Mitchell',
    role: 'Chief Operations Officer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Supply chain expert with deep experience across Asia-Pacific and European markets'
  },
  {
    name: 'James Wilson',
    role: 'VP of Global Sales',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    bio: '15 years of B2B sales leadership across 6 continents, 200+ major accounts'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of Quality Control',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    bio: 'Certified quality management professional with ISO, CE, and FDA compliance expertise'
  },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To bridge global markets by providing seamless, reliable, and cost-effective trade solutions. We empower businesses of all sizes to access international markets with confidence.'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become the world\'s most trusted trading partner — connecting suppliers and buyers across every continent through innovation, integrity, and excellence.'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Integrity in every deal. Excellence in every shipment. Partnership in every relationship. We believe long-term success comes from putting our clients first.'
  },
];

const offices = [
  { city: 'Shenzhen', address: '15 Keyuan Road, Nanshan District, Shenzhen 518057, China', role: 'Global Headquarters · Sourcing Center' },
  { city: 'Rotterdam', address: 'Wilhelminakade 123, 3072 AP Rotterdam, Netherlands', role: 'European Hub · Distribution Center' },
  { city: 'Los Angeles', address: '555 W 5th Street, Los Angeles, CA 90013, USA', role: 'Americas HQ · West Coast Logistics' },
  { city: 'Dubai', address: 'Jebel Ali Free Zone, Plot S-201, Dubai, UAE', role: 'MENA Regional Hub · Trade Finance' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.15),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Atlas Bridge</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            Founded in 2012, Atlas Bridge International is a leading global trading company specializing in 
            product sourcing, supply chain management, and cross-border trade solutions. 
            We connect manufacturers with buyers worldwide, delivering quality products with reliability and speed.
          </p>
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
                  Atlas Bridge was born in a small office in Shenzhen, China's manufacturing powerhouse. 
                  Our founder, David Chen, saw firsthand how small and medium businesses struggled to access 
                  quality suppliers overseas. Language barriers, cultural differences, quality concerns, 
                  and complex logistics stood in the way of great business opportunities.
                </p>
                <p>
                  Starting with just three clients and a deep knowledge of the electronics supply chain, 
                  we built our reputation one successful shipment at a time. By 2016, we had expanded 
                  into European and Middle Eastern markets, adding warehousing and logistics to our 
                  core sourcing services.
                </p>
                <p>
                  Today, Atlas Bridge operates across four continents with a team of 300+ professionals 
                  speaking 15+ languages. We've facilitated over $8 billion in trade volume, serving 
                  clients ranging from startups to Fortune 500 enterprises. But we haven't forgotten 
                  where we came from — every client, big or small, receives the same dedication and care.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-10">
                {[
                  { icon: Globe, value: '50+', label: 'Countries' },
                  { icon: TrendingUp, value: '$8B+', label: 'Trade Volume' },
                  { icon: Award, value: '12 Years', label: 'Experience' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-slate-50">
                    <item.icon size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-heading text-xl font-bold text-slate-900">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=750&fit=crop"
                  alt="Atlas Bridge Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <div className="text-2xl font-heading font-bold">300+</div>
                  <div className="text-xs opacity-80">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What We Do
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              End-to-end trade services that simplify global commerce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Sourcing', desc: 'We identify and vet manufacturers across Asia, matching you with suppliers that meet your quality, price, and capacity requirements.' },
              { icon: TrendingUp, title: 'Negotiation', desc: 'Our bilingual teams negotiate prices, MOQs, and payment terms so you get the best deal without the language barrier.' },
              { icon: MapPin, title: 'Logistics', desc: 'Full freight management — ocean, air, and rail — plus customs brokerage, warehousing, and last-mile delivery.' },
              { icon: Award, title: 'Compliance', desc: 'We handle all regulatory documentation, product certifications (CE, FCC, FDA, RoHS), and quality inspections.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/20 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Decades of combined experience in international trade and supply chain management
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

      {/* Global Offices */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Global Offices
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Strategically located to serve clients across every time zone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offices.map((office) => (
              <div 
                key={office.city}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/20 hover:shadow-lg transition-all flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-slate-900">{office.city}</h3>
                  <p className="text-xs text-primary font-medium mb-1">{office.role}</p>
                  <p className="text-sm text-slate-500">{office.address}</p>
                </div>
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
                Get in Touch
              </h2>
              <p className="text-blue-200/80 mb-10 max-w-xl mx-auto">
                Have questions about sourcing, logistics, or partnership opportunities? We'd love to hear from you.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <a href="mailto:info@atlasbridge.com" className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                  <Mail size={20} className="text-blue-400" />
                  <span>info@atlasbridge.com</span>
                </a>
                <a href="tel:+86-755-8888-6688" className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                  <Phone size={20} className="text-blue-400" />
                  <span>+86-755-8888-6688</span>
                </a>
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Linkedin size={18} className="text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Github size={18} className="text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Globe size={18} className="text-blue-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
