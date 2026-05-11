import type { ReactNode } from "react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setAuthInitialized, setAuthLoading, setSession } from "@/store/slices/authSlice";
import ToastProvider from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading());

    // Initialize auth state from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setSession({ user, accessToken, refreshToken: refreshToken || undefined }));
      } catch (e) {
        console.error("Failed to restore auth state", e);
        dispatch(setAuthInitialized());
      }
    } else {
      dispatch(setAuthInitialized());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthInitializer>
            <ToastProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </ToastProvider>
          </AuthInitializer>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
