import { PageHeader } from "@/components/ui/PageHeader";
import ProductShowcaseCard from "@/components/common/ProductShowcaseCard";
import { Seo } from "@/seo/Seo";
import { Leaf, Utensils, Wine, Croissant, Droplets, Heart } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface CategoryItem {
  title: string;
  icon: LucideIcon;
}

const categories: CategoryItem[] = [
  { title: "Fresh Produce", icon: Leaf },
  { title: "Premium Meats", icon: Utensils },
  { title: "Gourmet Pantry", icon: Wine },
  { title: "Bakery", icon: Croissant },
  { title: "Dairy & Chilled", icon: Droplets },
  { title: "Wellness", icon: Heart },
];

export function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10 py-12">
      <Seo title="Product Showcase" description="Explore signature categories at Triple N Supermart." />
      <PageHeader
        title="Product Showcase"
        description="Curated categories that highlight our premium in-store selections."
      />
      <div className="mb-6 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Featured categories
        </span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <ProductShowcaseCard
            key={category.title}
            title={category.title}
            icon={category.icon}
            description="Seasonal picks and staff recommendations."
          />
        ))}
      </div>
      <p className="mt-8 text-center text-sm font-medium text-brand-700">
        Freshly curated every week for quality, taste, and value.
      </p>
    </div>
  );
}
