import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";

type AccordionContextValue = {
  multiple: boolean;
  openValues: string[];
  toggleValue: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

type AccordionItemContextValue = {
  value: string;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

type AccordionProps = {
  children: ReactNode;
  multiple?: boolean;
  className?: string;
};

export function Accordion({ children, multiple = false, className = "" }: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      multiple,
      openValues,
      toggleValue: (itemValue: string) => {
        setOpenValues((prev) => {
          const isOpen = prev.includes(itemValue);

          if (multiple) {
            return isOpen ? prev.filter((value) => value !== itemValue) : [...prev, itemValue];
          }

          return isOpen ? [] : [itemValue];
        });
      },
    }),
    [multiple, openValues],
  );

  return <div className={className} role="presentation"><AccordionContext.Provider value={value}>{children}</AccordionContext.Provider></div>;
}

type AccordionItemProps = {
  children: ReactNode;
  value: string;
  className?: string;
};

export function AccordionItem({ children, value, className = "" }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={className}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = {
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
};

export function AccordionTrigger({ children, showArrow = true, className = "" }: AccordionTriggerProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!accordion || !item) {
    throw new Error("AccordionTrigger must be used inside Accordion and AccordionItem.");
  }

  const isOpen = accordion.openValues.includes(item.value);

  return (
    <button
      type="button"
      onClick={() => accordion.toggleValue(item.value)}
      aria-expanded={isOpen}
      className={`group flex w-full items-center gap-4 rounded-2xl border border-brand-200/70 bg-white px-5 py-4 text-left transition-all duration-300 hover:border-brand-300 hover:bg-brand-50/40 ${
        isOpen ? "border-brand-300 bg-brand-50/70" : ""
      } ${className}`}
    >
      <span className="flex-1 text-base font-semibold text-brand-900 md:text-lg">{children}</span>
      {showArrow ? (
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      ) : null}
    </button>
  );
}

type AccordionPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  keepRendered?: boolean;
};

export function AccordionPanel({ children, keepRendered = false, className = "", ...props }: AccordionPanelProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!accordion || !item) {
    throw new Error("AccordionPanel must be used inside Accordion and AccordionItem.");
  }

  const isOpen = accordion.openValues.includes(item.value);

  if (!keepRendered && !isOpen) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden px-2 pb-3 ${className}`}
      aria-hidden={!isOpen}
      style={{ maxHeight: isOpen ? "360px" : "0px", transition: "max-height 300ms ease" }}
      {...props}
    >
      <div className="rounded-2xl border border-brand-100 bg-brand-50/40 px-5 py-4 text-sm leading-7 text-brand-700 md:text-base">
        {children}
      </div>
    </div>
  );
}
