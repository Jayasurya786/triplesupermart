import { useEffect, useState } from "react";
import {
  BellRing,
  CheckCheck,
  CircleAlert,
  Gift,
  Megaphone,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { apiFetch } from "@/api/client";

interface Notification {
  _id: string;
  customerId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

type Category = "points" | "reward" | "announcement" | "offer" | "tier";

function mapTypeToCategory(type: string): Category {
  switch (type) {
    case "success":
      return "reward";
    case "warning":
      return "tier";
    case "error":
      return "announcement";
    case "info":
    default:
      return "announcement";
  }
}

function getNotificationMeta(type: string) {
  const mapped = mapTypeToCategory(type);

  switch (mapped) {
    case "points":
      return {
        icon: Sparkles,
        tone: "from-emerald-100 to-lime-100 text-emerald-700 border-emerald-200",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
      };
    case "reward":
      return {
        icon: Gift,
        tone: "from-teal-100 to-emerald-100 text-teal-700 border-teal-200",
        border: "border-teal-200",
        dot: "bg-teal-500",
      };
    case "announcement":
      return {
        icon: Megaphone,
        tone: "from-sky-100 to-cyan-100 text-sky-700 border-sky-200",
        border: "border-sky-200",
        dot: "bg-sky-500",
      };
    case "offer":
      return {
        icon: BellRing,
        tone: "from-emerald-100 to-green-100 text-green-700 border-green-200",
        border: "border-green-200",
        dot: "bg-green-500",
      };
    case "tier":
      return {
        icon: Trophy,
        tone: "from-amber-100 to-orange-100 text-amber-700 border-amber-200",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    default:
      return {
        icon: CircleAlert,
        tone: "from-slate-100 to-slate-200 text-slate-700 border-slate-200",
        border: "border-slate-200",
        dot: "bg-slate-500",
      };
  }
}

export function PortalNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "unread">("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<{ notifications: Notification[] }>("/notifications");
        setNotifications(data.notifications ?? []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { notifications?: Notification[] };
        if (!detail?.notifications) return;

        const unreadList = detail.notifications;
        setNotifications((prev) => {
          const unreadMap = new Map(unreadList.map((n) => [n._id, n]));
          const existing = prev.map((n) =>
            unreadMap.has(n._id)
              ? { ...n, ...unreadMap.get(n._id)!, isRead: false }
              : { ...n, isRead: true }
          );
          const extra = unreadList.filter((n) => !prev.some((item) => item._id === n._id));
          return [...existing, ...extra];
        });
      } catch {
        // ignore malformed event payloads
      }
    };

    window.addEventListener("notifications:unread-update", handler as EventListener);
    return () => window.removeEventListener("notifications:unread-update", handler as EventListener);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications =
    filterType === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/unread`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: false } : n)));
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Failed to mark notification as unread:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetch("/notifications/mark-all/read", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-brand-900">Notifications</h2>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-[0_20px_70px_-45px_rgba(16,185,129,0.5)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Portal Inbox</p>
            <h2 className="mt-1 text-2xl font-display text-brand-900">Notifications</h2>
            <p className="mt-2 text-sm text-brand-700">
              Review reward updates, account announcements, and loyalty activity.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-left sm:text-right shadow-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">Unread</p>
              <p className="text-xl font-bold text-emerald-700">{unreadCount}</p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="inline-flex w-full sm:w-auto flex-wrap gap-2 rounded-2xl sm:rounded-full border border-emerald-100 bg-white/90 p-1 shadow-sm">
        <button
          onClick={() => setFilterType("all")}
          className={`flex-1 sm:flex-none rounded-full px-4 py-2 text-sm font-semibold transition ${
            filterType === "all" ? "bg-emerald-600 text-white" : "text-brand-700 hover:bg-emerald-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("unread")}
          className={`flex-1 sm:flex-none rounded-full px-4 py-2 text-sm font-semibold transition ${
            filterType === "unread"
              ? "bg-emerald-600 text-white"
              : "text-brand-700 hover:bg-emerald-50"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {displayedNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayedNotifications.map((notification) => {
            const meta = getNotificationMeta(notification.type);
            const Icon = meta.icon;

            return (
              <GlassCard key={notification._id}>
                <div
                  onClick={() => {
                    if (!notification.isRead) handleMarkAsRead(notification._id);
                  }}
                  className={`cursor-pointer rounded-2xl border bg-white/90 p-4 shadow-sm transition hover:shadow-md ${
                    meta.border
                  } ${notification.isRead ? "opacity-75" : ""}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-1 gap-3 min-w-0">
                      <div
                        className={`mt-0.5 grid h-11 w-11 place-items-center rounded-2xl border bg-gradient-to-br ${meta.tone}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          {!notification.isRead && (
                            <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                          )}
                          <div>
                            <h4
                              className={`font-semibold ${
                                notification.isRead ? "text-brand-700" : "text-brand-900"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-xs text-brand-600">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-brand-700">{notification.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="w-full sm:w-auto rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800"
                        >
                          Mark Read
                        </button>
                      )}

                      {notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsUnread(notification._id);
                          }}
                          className="w-full sm:w-auto rounded-full border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:text-brand-800"
                        >
                          Mark Unread
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 py-10 text-center">
            <BellRing className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="mt-3 text-sm text-brand-700">
              {filterType === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="mt-1 text-xs text-slate-500">New updates will appear here automatically.</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
