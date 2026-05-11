import { getUserFacingErrorMessage } from "@/utils/errors";

type ErrorMessageProps = {
  title?: string;
  error: unknown;
  className?: string;
  compact?: boolean;
  hideTitle?: boolean;
};

export function ErrorMessage({
  title = "Something went wrong",
  error,
  className = "",
  compact = false,
  hideTitle = false,
}: ErrorMessageProps) {
  const message = getUserFacingErrorMessage(error);
  const baseStyles = compact
    ? "rounded-[1.5rem] border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700"
    : "rounded-[1.75rem] border border-rose-200 bg-rose-50/95 p-6 shadow-[0_20px_50px_-20px_rgba(185,28,28,0.45)] text-rose-900";

  return (
    <div className={`${baseStyles} ${className}`} role="alert">
      {!hideTitle && (
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 font-semibold ${
              compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
            }`}
          >
            !
          </span>
          <h2 className={`font-semibold ${compact ? "text-sm" : "text-lg"} text-rose-900`}>
            {title}
          </h2>
        </div>
      )}
      <p className={`${compact ? "text-xs" : "text-sm leading-6"} text-rose-800`}>{message}</p>
    </div>
  );
}
