import { useEffect, useRef } from "react";
import { apiFetch } from "@/api/client";
import { useToast } from "@/components/ui/Toast";

export default function NotificationPoller({
  onUnread,
  useBrowser = false,
}: {
  onUnread: (n: number) => void;
  useBrowser?: boolean;
}) {
  const prevIdsRef = useRef<Set<string>>(new Set());
  const hasShownErrorRef = useRef(false);
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;

    async function fetchUnread() {
      try {
        const res = await apiFetch<{ notifications: { _id: string; title: string; message: string }[] }>(
          "/notifications/unread"
        );
        if (!mounted) return;
        const list = res.notifications || [];
        onUnread(list.length);

        const newIds = list.map((n) => n._id).filter((id) => !prevIdsRef.current.has(id));
        if (newIds.length > 0) {
          const newItems = list.filter((n) => newIds.includes(n._id));
          newItems.forEach((n) => {
            show({ title: n.title, message: n.message, ttl: 7000 });
          });

          // Optionally show browser notifications when explicitly enabled
          if (useBrowser && typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") Notification.requestPermission();
            if (Notification.permission === "granted") {
              newItems.forEach((n) => {
                try {
                  new Notification(n.title, { body: n.message });
                } catch (e) {
                  // ignore
                }
              });
            }
          }
        }

        prevIdsRef.current = new Set(list.map((n) => n._id));
        window.dispatchEvent(new CustomEvent("notifications:unread-update", { detail: { notifications: list } }));
        hasShownErrorRef.current = false;
      } catch (err) {
        console.error("NotificationPoller error:", err);
        if (!hasShownErrorRef.current) {
          hasShownErrorRef.current = true;
          try {
            show({ title: "Notifications", message: "Could not fetch notifications. Are you logged in?", ttl: 6000 });
          } catch (e) {
            // ignore
          }
        }
      }
    }

    fetchUnread();
    const t = setInterval(fetchUnread, 15000);

    const refreshHandler = () => fetchUnread();
    window.addEventListener("notifications:refresh", refreshHandler);

    return () => {
      mounted = false;
      clearInterval(t);
      window.removeEventListener("notifications:refresh", refreshHandler);
    };
  }, [onUnread, show, useBrowser]);

  return null;
}
