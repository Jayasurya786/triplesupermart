import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { animate } from "framer-motion";
import { cn } from "@/utils/cn";

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

export function SpotlightNavbar({
  items = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Offers", href: "/offers" },
    { label: "Loyalty", href: "/loyalty" },
    { label: "About", href: "/about" },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const location = useLocation();

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  // Update activeIndex when location changes
  useEffect(() => {
    const currentPathIndex = items.findIndex((item) => item.href === location.pathname);
    if (currentPathIndex !== -1) {
      setActiveIndex(currentPathIndex);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  return (
    <div className={cn("relative flex justify-center", className)}>
      <nav
        ref={navRef}
        className={cn(
          "spotlight-nav relative h-11 rounded-full transition-all duration-300 overflow-hidden",
          "border border-brand-200/30 bg-white/40 backdrop-blur-md shadow-lg"
        )}
      >
        <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <NavLink
                to={item.href}
                data-index={idx}
                onClick={() => handleItemClick(item, idx)}
                className={({ isActive }) => cn(
                  "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                  activeIndex === idx || isActive
                    ? "text-brand-500 font-semibold"
                    : "text-brand-900 hover:text-brand-700"
                )}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `radial-gradient(120px circle at var(--spotlight-x) 100%, var(--spotlight-color, rgba(42, 163, 105, 0.15)) 0%, transparent 50%)`,
          }}
        />

        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[3px] z-[2]"
          style={{
            background: `radial-gradient(80px circle at var(--ambience-x) 0%, var(--ambience-color, #2aa369) 0%, transparent 100%)`,
          }}
        />

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-200/20 z-0" />
      </nav>

      <style>{`
        nav {
          --spotlight-color: rgba(42, 163, 105, 0.2);
          --ambience-color: #2aa369;
        }
        :global(.dark) nav {
          --spotlight-color: rgba(74, 193, 132, 0.25);
          --ambience-color: #4ac184;
        }
      `}</style>
    </div>
  );
}
