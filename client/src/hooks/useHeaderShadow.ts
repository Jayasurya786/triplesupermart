import { useEffect, useEffectEvent, useState } from "react";

export function useHeaderShadow() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useEffectEvent(() => {
    setScrolled(window.scrollY > 8);
  });

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrolled;
}
