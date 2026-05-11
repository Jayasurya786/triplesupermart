import { Seo } from "@/seo/Seo";
import { NavLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 text-center">
      <Seo title="Page Not Found" />
      <h1 className="text-4xl font-display text-brand-800">Page not found</h1>
      <p className="mt-4 text-sm text-brand-700">
        The page you are looking for does not exist. Return to the homepage to continue.
      </p>
      <NavLink
        to="/"
        className="inline-flex mt-6 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white"
      >
        Back to home
      </NavLink>
    </div>
  );
}
