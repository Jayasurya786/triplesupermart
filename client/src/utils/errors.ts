export function getUserFacingErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("invalid access token") || message.includes("401") || message.includes("unauthorized")) {
      return "Your session expired. Please sign in again to continue.";
    }

    if (message.includes("network") || message.includes("failed to fetch")) {
      return "Network error. Check your connection and try again.";
    }

    if (message.includes("forbidden") || message.includes("403")) {
      return "You do not have permission to view this data. Ask an admin to grant access.";
    }

    if (message.includes("not found") || message.includes("404")) {
      return "The requested data was not found. Refresh the page and try again.";
    }

    return message;
  }

  return "Something went wrong. Refresh the page and try again.";
}