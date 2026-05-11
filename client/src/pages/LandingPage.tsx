import { Seo } from "@/seo/Seo";
import { storeSchema } from "@/seo/schemas";
import { Hero } from "@/modules/public/Hero";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/animate-ui/components/base/accordion";
import { Zap, Clock3, Truck, Accessibility, Gift, MapPin, ShoppingCart, Sunrise, Moon, CheckCircle2, MapPinIcon, Clock, CreditCard, Warehouse, Phone, MessageCircle, Store, Globe, Camera, Leaf, Utensils, Wine, Croissant, Droplets, Heart, type LucideIcon } from 'lucide-react';

function Solutions() {
  const cards: { Icon: LucideIcon; title: string; desc: string }[] = [
    {
      Icon: Zap,
      title: "Fresh Foods",
      desc: "Quality groceries picked daily, so your kitchen stays stocked with the best produce and staples.",
    },
    {
      Icon: Clock3,
      title: "Late-Night Availability",
      desc: "Open 7:30 AM to 11:30 PM every day, perfect for last-minute ingredients or midnight cravings.",
    },
    {
      Icon: Truck,
      title: "Easy Collect",
      desc: "Order ahead online and grab your basket quickly at our Kaki Bukit pickup counter.",
    },
    {
      Icon: Accessibility,
      title: "Accessible for All",
      desc: "Wide aisles, wheelchair-friendly access, and convenient parking make shopping easy for everyone.",
    },
    {
      Icon: Gift,
      title: "Loyalty Rewards",
      desc: "Earn points on every purchase and unlock exclusive deals designed for Triple N Supermart members.",
    },
    {
      Icon: MapPin,
      title: "Local Convenience",
      desc: "A trusted neighborhood store that brings dependable groceries to Kaki Bukit and nearby communities.",
    },
  ];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-8 text-center">
          <div className="section-label mb-3 text-sm font-semibold uppercase tracking-[0.4em] text-brand-700">
            Why Shop With Us
          </div>
          <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-brand-900">
            Shopping, <span className="text-brand-600">Made Simple</span>
          </h2>
        </div>

        <div className="solutions-grid grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="solution-card rounded-[28px] border border-brand-200/60 bg-white/90 p-10 shadow-glass backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="solution-icon mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-brand-700 shadow-sm">
                <c.Icon size={28} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-semibold text-brand-900 mb-3">{c.title}</h3>
              <p className="text-sm leading-7 text-brand-700">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryItem {
  title: string;
  icon: LucideIcon;
}

function ProductShowcase() {
  const featuredCategories: CategoryItem[] = [
    { title: "Fresh Produce", icon: Leaf },
    { title: "Premium Meats", icon: Utensils },
    { title: "Gourmet Pantry", icon: Wine },
    { title: "Bakery", icon: Croissant },
    { title: "Dairy & Chilled", icon: Droplets },
    { title: "Wellness", icon: Heart },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-brand-700 backdrop-blur-sm">
              <Store className="h-4 w-4" />
              Product Showcase
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight text-brand-900 mb-6">
            Curated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">Excellence</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg md:text-xl leading-8 text-brand-700/90 font-medium">
            Discover our finest selection of premium categories, handpicked to bring you the best quality, freshness, and value every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category, i) => {
            const IconComponent = category.icon;
            return (
              <article
                key={category.title}
                className="group relative overflow-hidden rounded-3xl border border-brand-200/60 bg-gradient-to-br from-white via-brand-50/40 to-white/80 p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-brand-100 to-brand-200/50 blur-3xl transition-all duration-500 group-hover:scale-150" />
                <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-brand-50/50 blur-2xl transition-all duration-500 group-hover:opacity-70" />
                
                <div className="relative z-10 mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 shadow-md ring-1 ring-brand-200/50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-brand-300">
                    <IconComponent className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold text-brand-900 mb-3">{category.title}</h3>
                  <p className="text-sm leading-6 text-brand-700/80 mb-4">
                    Seasonal picks and staff recommendations.
                  </p>
                </div>

                <div className="relative z-10 h-px w-12 bg-gradient-to-r from-brand-300 to-transparent" />
                
                <p className="relative z-10 mt-4 text-xs font-bold uppercase tracking-[0.25em] text-brand-600 opacity-80">
                  Premium Selections
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base md:text-lg font-medium text-brand-700/80">
            Refreshed weekly • Carefully Curated • Always Fresh
          </p>
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    stars: 5,
    title: "The Value Seeker",
    text: "Best prices in the Kaki Bukit area. I get all my monthly bulk groceries and spices here for way less than the bigger supermarket chains.",
    author: "Arjun S.",
    role: "Local Resident",
    emoji: "👨‍💼",
  },
  {
    stars: 5,
    title: "The Home Cook",
    text: "Finally found a place that stocks authentic Indian brands and fresh curry leaves daily. The quality of the vegetables is always top-notch.",
    author: "Priya K.",
    role: "Home Chef",
    emoji: "👩‍🍳",
  },
  {
    stars: 5,
    title: "The Late-Night Pro",
    text: "Open until 11:30 PM! This place has saved me so many times when I needed essentials after a late shift. Highly recommended.",
    author: "David L.",
    role: "Kaki Bukit Professional",
    emoji: "👨‍💻",
  },
  {
    stars: 5,
    title: "The Quality Conscious",
    text: "The freshness here is unbeatable. Vegetables arrive early morning and stay crisp throughout the day. Best local option for my family.",
    author: "Meera V.",
    role: "Nutritionist",
    emoji: "👩‍⚕️",
  },
  {
    stars: 5,
    title: "The Busy Parent",
    text: "Quick checkout, friendly staff, and convenient location. This place makes grocery shopping so much easier when juggling kids and work.",
    author: "Rajesh M.",
    role: "Working Parent",
    emoji: "👨‍👩‍👧",
  },
  {
    stars: 5,
    title: "The International Foodie",
    text: "Impressed by the variety! From local staples to imported items, the selection keeps getting better. A true gem in the neighborhood.",
    author: "Sophie T.",
    role: "Food Enthusiast",
    emoji: "👩‍🍳",
  },
];

function SocialProof() {
  return (
    <section className="reviews py-14">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-8 text-center">
          <div className="section-label mb-3 text-sm font-semibold uppercase tracking-[0.4em] text-brand-700">
            Customer Stories
          </div>
          <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-brand-900">
            Loved by Our <span className="text-brand-600">Community</span>
          </h2>
        </div>
        <div className="reviews-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 to-brand-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="review-card relative rounded-2xl border border-brand-200/40 bg-gradient-to-br from-white via-brand-50/50 to-white p-8 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-transparent" />
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg transition-shadow">
                      {r.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="reviewer-name font-bold text-brand-900">{r.author}</div>
                      <div className="reviewer-role text-xs font-medium text-brand-600 uppercase tracking-wider">{r.role}</div>
                    </div>
                  </div>
                </div>
                <div className="review-stars mb-4 text-base tracking-wide">{'⭐'.repeat(r.stars)}</div>
                <div className="review-title font-bold text-brand-900 mb-3 text-lg leading-tight">{r.title}</div>
                <p className="review-text text-sm leading-7 text-brand-700">"{ r.text }"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const cards = [
    { letter: "N", word: "N-iche Selection", desc: "The largest variety of Indian and regional consumer goods in the area.", icon: "🛒" },
    { letter: "N", word: "N-eighborhood Prices", desc: "We keep our overhead low so we can pass the savings directly to you.", icon: "💰" },
    { letter: "N", word: "N-earby & Accessible", desc: "Located at the heart of Kaki Bukit with full wheelchair access and easy parking.", icon: "📍" },
  ];

  return (
    <section className="why-us py-14">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-8 text-center">
          <div className="section-label mb-3 text-sm font-semibold uppercase tracking-[0.4em] text-brand-700">
            Our Promise
          </div>
          <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-brand-900">
            The Triple N <span className="text-brand-600">Difference</span>
          </h2>
        </div>

        <div className="why-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="why-card group relative overflow-hidden rounded-2xl border border-brand-200/50 bg-gradient-to-br from-white via-brand-50/60 to-white p-8 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-brand-100/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="why-icon-wrap mb-6 flex items-center justify-between">
                  <span className="why-big-n flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-2xl font-bold text-white shadow-md">
                    {c.letter}
                  </span>
                  <span className="why-icon flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-brand-100">
                    {c.icon}
                  </span>
                </div>
                <h3 className="why-word mb-3 text-xl font-bold text-brand-900">{c.word}</h3>
                <p className="text-sm leading-7 text-brand-700">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta-section relative py-16 md:py-20 bg-white">
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Tag */}
            <div className="mb-6 inline-block">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">⏰ Open Now</span>
            </div>
            
            {/* Main headline */}
            <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-brand-950">
              Fresh & Local,<br />
              <span className="text-brand-600">Always Ready</span>
            </h2>
            
            {/* Description */}
            <p className="mb-8 text-lg leading-relaxed text-brand-700 max-w-md">
              From farm-fresh produce delivered daily at 7:30 AM to authentic Indian staples, we've got everything you need. Open until 11:30 PM.
            </p>
            
            {/* Quick info boxes */}
            <div className="mb-10 grid grid-cols-2 gap-4">
              <div className="px-4 py-3 rounded-lg bg-brand-50 border border-brand-200 shadow-sm">
                <Sunrise className="w-6 h-6 mb-2 text-brand-600" />
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Opens Daily</p>
                <p className="text-sm font-bold text-brand-900">7:30 AM</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-brand-50 border border-brand-200 shadow-sm">
                <Moon className="w-6 h-6 mb-2 text-brand-600" />
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Closes</p>
                <p className="text-sm font-bold text-brand-900">11:30 PM</p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=Triple+N+Supermart+7+Kaki+Bukit+Ave+3+Singapore"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white px-8 py-3 font-bold shadow-lg shadow-brand-600/30 transition-all duration-300 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-600 text-brand-600 px-8 py-3 font-bold transition-all duration-300 hover:bg-brand-50"
              >
                <Clock3 className="w-5 h-5" />
                More Info
              </a>
            </div>
          </div>
          
          {/* Right: Visual highlight */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 -left-8 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
              
              {/* Main content box */}
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-brand-100">
                <div className="space-y-6">
                  <ShoppingCart className="w-12 h-12 text-brand-600" />
                  <div>
                    <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Visit Us
                    </p>
                    <p className="text-xl font-bold text-brand-900">7 Kaki Bukit Ave 3</p>
                    <p className="text-sm text-brand-600 mt-1">Singapore 415814</p>
                  </div>
                  <div className="pt-4 border-t border-brand-100 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-brand-700"><span className="font-bold">Full wheelchair access</span> & easy parking</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-brand-700"><span className="font-bold">1000+</span> authentic Indian & regional brands</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-brand-700"><span className="font-bold">Best prices</span> in Kaki Bukit area</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Where is Triple N Supermart located?", a: "We are located at 7 Kaki Bukit Ave 3, Singapore 415814, conveniently situated within the Kaki Bukit Recreation Centre.", icon: MapPinIcon },
  { q: "What are your operating hours?", a: "We are open daily from 7:30 AM to 11:30 PM, including weekends and public holidays, to ensure you can get your essentials whenever you need them.", icon: Clock },
  { q: "Do you offer home delivery?", a: "Yes! We provide delivery services for your groceries. You can also choose in-store pickup if you prefer to order ahead and collect your items at your convenience.", icon: Truck },
  { q: "What payment methods do you accept?", a: "We accept Credit Cards, Debit Cards, and NFC mobile payments (like Apple Pay and Google Pay) for a smooth checkout.", icon: CreditCard },
  { q: "Is the store wheelchair accessible?", a: "Yes, our store features a wheelchair-accessible entrance and dedicated parking to ensure a comfortable shopping experience for everyone.", icon: Accessibility },
  { q: "What kind of products do you specialize in?", a: "While we are a full-service supermarket with a wide range of consumer goods and fresh produce, we are well-known for our extensive selection of authentic Indian groceries and spices at very competitive prices.", icon: Warehouse },
  { q: "Is there parking available nearby?", a: "Yes, there is accessible parking available right at our location for customers who prefer to drive.", icon: MapPin },
];

function FAQ() {
  return (
    <section className="faq py-16 md:py-20 bg-gradient-to-b from-white to-brand-50/30" id="faq">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-brand-900 mb-4">
            Frequently Asked <span className="text-brand-600">Questions</span>
          </h2>
          <p className="text-lg text-brand-700 max-w-2xl mx-auto">
            Find answers to common questions about our store, hours, services, and more.
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <Accordion className="w-full space-y-3" multiple={false}>
            {FAQS.map((item, index) => {
              const Icon = item.icon;

              return (
                <AccordionItem key={item.q} value={`item-${index + 1}`}>
                  <AccordionTrigger showArrow className="shadow-sm">
                    <span className="inline-flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionPanel keepRendered className="pt-2">
                    {item.a}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const contactDetails = [
    {
      icon: MapPin,
      title: "Visit Us",
      description: "7 Kaki Bukit Ave 3, Singapore 415814",
      link: "https://maps.google.com/?q=7+Kaki+Bukit+Ave+3+Singapore+415814",
    },
    {
      icon: Clock,
      title: "Store Hours",
      description: "7:30 AM – 11:30 PM Daily",
      link: null,
    },
    {
      icon: Phone,
      title: "Phone",
      description: "+65 6844 1445",
      link: "tel:+6568441445",
    },
  ];

  return (
    <section className="contact py-16 md:py-20 bg-gradient-to-b from-brand-50/30 to-white" id="contact">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Contact</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-brand-900 mb-4">
            Get in <span className="text-brand-600">Touch</span>
          </h2>
          <p className="text-lg text-brand-700 max-w-2xl mx-auto">
            Have a question or need a quick delivery? Our team is ready to help you find what you need or arrange your next grocery run.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactDetails.map((item, i) => {
            const Icon = item.icon;

            if (item.link) {
              return (
                <a
                  key={i}
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                  className="group relative overflow-hidden rounded-2xl border border-brand-200/50 bg-white p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-brand-300 hover:bg-gradient-to-br hover:from-brand-50 hover:to-white hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-brand-900">{item.title}</h3>
                    <p className="text-brand-700 text-sm hover:text-brand-600 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </a>
              );
            }

            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-brand-200/50 bg-white p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-brand-300 hover:bg-gradient-to-br hover:from-brand-50 hover:to-white hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-brand-900">{item.title}</h3>
                  <p className="text-brand-700 text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <a
            href="https://wa.me/6568441445"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 text-white px-8 py-3 font-bold shadow-lg shadow-brand-600/30 transition-all duration-300 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-white px-6 py-10 text-brand-900 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-3 text-lg font-bold tracking-wide">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-md shadow-brand-600/20 backdrop-blur-sm">
            <Store className="h-5 w-5" />
          </span>
          <span>Triple N Supermart</span>
        </div>

        <p className="text-sm text-brand-700">Quality Groceries, Community Values.</p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-brand-700">
          <a
            href="https://maps.google.com/?q=Triple+N+Supermart"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-200 bg-white px-4 py-2 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Google Maps
            </span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-200 bg-white px-4 py-2 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
          >
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Facebook
            </span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-200 bg-white px-4 py-2 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
          >
            <span className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Instagram
            </span>
          </a>
        </div>

        <p className="text-xs text-brand-500">© 2024 Triple N Supermart Pte. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div>
      <Seo title="Home" description="Premium loyalty platform for Triple N Supermart." schema={storeSchema} />
      <Hero />
      <Solutions />
      <ProductShowcase />
      <SocialProof />
      <WhyUs />
      <CTA />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
