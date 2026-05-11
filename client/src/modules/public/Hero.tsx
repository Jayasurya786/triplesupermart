import { motion } from "framer-motion";
import GetStartedButton from "@/components/ui/GetStartedButton";
import StyledOutlineButton from "@/components/ui/StyledOutlineButton";
import { FlipFadeText } from "@/components/ui/FlipFadeText";
import { NavLink, useNavigate } from "react-router-dom";
import FeatureCards from "@/components/common/FeatureCards";
import { useAuth } from "@/hooks/useAuth";

export function Hero() {
  const navigate = useNavigate();
  const { initialized, isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (!initialized || !isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin" || user.role === "staff") {
      navigate("/admin");
      return;
    }

    navigate("/portal");
  };

  return (
    <section className="px-6 md:px-10 py-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-block rounded-full bg-brand-100 px-4 py-2 mb-8">
            <span className="text-sm font-semibold text-brand-700">🌿 Freshness Guaranteed Daily</span>
          </div>

          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-brand-900 leading-tight uppercase tracking-tight break-words">
              TRIPLE N SUPERMART
            </h1>
          </div>

          {/* Animated Tagline */}
          <div className="mt-8 mb-8 min-h-[60px] md:min-h-[80px] flex items-center justify-center">
            <FlipFadeText
              words={["LOYALTY", "REWARDS", "SAVINGS", "ENGAGEMENT", "EXPERIENCE"]}
              interval={3500}
              size="lg"
              letterDuration={0.55}
              staggerDelay={0.075}
            />
          </div>

          <p className="text-xl md:text-2xl text-brand-800 font-semibold mb-10">
            The Taste of Home
          </p>

          {/* Pills - Animated Slider */}
          <div 
            className="logo-slider w-full mb-12 overflow-hidden"
            style={{
              "--speed": 60,
              "--count": 4,
              "--blurs": 8,
              "--blur": 1,
            } as React.CSSProperties}
          >
            <div className="logo-slider__container relative w-full grid">
              <div className="logo-slider__blur logo-slider__blur--left absolute top-0 bottom-0 left-0 w-1/4 z-10 pointer-events-none rotate-180"></div>
              <div className="logo-slider__blur logo-slider__blur--right absolute top-0 bottom-0 right-0 w-1/4 z-10 pointer-events-none"></div>
              
              <ul className="logo-slider__track flex items-center h-full w-fit m-0 p-0 list-none">
                <li className="logo-slider__item shrink-0 px-2" style={{ "--item-index": 0 } as React.CSSProperties}>
                  <div className="bg-white/70 border border-white/60 rounded-xl px-6 py-3 shadow-glass backdrop-blur-glass min-w-[220px] md:min-w-[280px]">
                    <p className="text-sm md:text-base text-brand-700 font-medium">🏡 Quality Groceries, Affordable Prices, Every Day.</p>
                  </div>
                </li>
                <li className="logo-slider__item shrink-0 px-2" style={{ "--item-index": 1 } as React.CSSProperties}>
                  <div className="bg-white/70 border border-white/60 rounded-xl px-6 py-3 shadow-glass backdrop-blur-glass min-w-[220px] md:min-w-[280px]">
                    <p className="text-sm md:text-base text-brand-700 font-medium">🚚 The Best of Kaki Bukit, Delivered to Your Door.</p>
                  </div>
                </li>
                <li className="logo-slider__item shrink-0 px-2" style={{ "--item-index": 2 } as React.CSSProperties}>
                  <div className="bg-white/70 border border-white/60 rounded-xl px-6 py-3 shadow-glass backdrop-blur-glass min-w-[220px] md:min-w-[280px]">
                    <p className="text-sm md:text-base text-brand-700 font-medium">⭐ Premium Quality, Trusted by Thousands.</p>
                  </div>
                </li>
                <li className="logo-slider__item shrink-0 px-2" style={{ "--item-index": 3 } as React.CSSProperties}>
                  <div className="bg-white/70 border border-white/60 rounded-xl px-6 py-3 shadow-glass backdrop-blur-glass min-w-[220px] md:min-w-[280px]">
                    <p className="text-sm md:text-base text-brand-700 font-medium">🎁 Loyalty Rewards on Every Purchase.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-20">
            <div className="w-full sm:w-auto">
              <GetStartedButton onClick={handleGetStarted} />
            </div>
            <div className="w-full sm:w-auto">
              <NavLink to="/contact">
                <StyledOutlineButton>Contact Us</StyledOutlineButton>
              </NavLink>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <FeatureCards />
        </motion.div>
      </div>
    </section>
  );
}
