import React, { useState } from 'react';
import { ChevronRight, LogOut, X } from 'lucide-react';
import styled from 'styled-components';

export interface SidebarItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
  items?: SidebarItem[];
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onNavigate?: (to: string) => void;
  showFooter?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  user,
  onLogout,
  onNavigate,
  showFooter = false,
  mobileOpen,
  onClose,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const isMobileCollapsed = collapsed && mobileOpen;

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  return (
    <SidebarContainer $collapsed={isMobileCollapsed} $mobileOpen={mobileOpen}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          {!collapsed && <span className="font-bold text-brand-900">Triple N</span>}
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-brand-700 hover:bg-slate-100 transition md:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:inline-flex p-1 hover:bg-white/50 rounded transition"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {items.map((item) => (
          <SidebarGroup key={item.to}>
            <SidebarItemWrapper>
              {item.items ? (
                <>
                  <SidebarMenuButton
                    onClick={() => toggleExpand(item.label)}
                    isActive={item.isActive}
                    $collapsed={collapsed}
                  >
                    {item.icon && <span className="icon">{item.icon}</span>}
                    {!collapsed && (
                      <>
                        <span className="label">{item.label}</span>
                        <ChevronRight
                          className={`ml-auto w-4 h-4 transition-transform ${
                            expandedItems.includes(item.label) ? 'rotate-90' : ''
                          }`}
                        />
                      </>
                    )}
                  </SidebarMenuButton>
                  {expandedItems.includes(item.label) && !collapsed && (
                    <SidebarSubmenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuButton
                          key={subItem.to}
                          onClick={() => onNavigate?.(subItem.to)}
                          isActive={subItem.isActive}
                          isSubmenu
                          $collapsed={collapsed}
                        >
                          <span className="label">{subItem.label}</span>
                        </SidebarMenuButton>
                      ))}
                    </SidebarSubmenu>
                  )}
                </>
              ) : (
                <SidebarMenuButton
                  onClick={() => onNavigate?.(item.to)}
                  isActive={item.isActive}
                  $collapsed={collapsed}
                >
                  {item.icon && <span className="icon">{item.icon}</span>}
                  {!collapsed && <span className="label">{item.label}</span>}
                </SidebarMenuButton>
              )}
            </SidebarItemWrapper>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {showFooter && user && !collapsed && (
        <SidebarFooter>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            {user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-900 truncate">{user.name}</p>
              {user.email && <p className="text-xs text-brand-700 truncate">{user.email}</p>}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-700 hover:bg-brand-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </SidebarFooter>
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ $collapsed: boolean; $mobileOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-self: flex-start;
  position: sticky;
  top: 0;
  width: ${(props) => (props.$collapsed ? '80px' : '280px')};
  background: rgba(255, 255, 255, 0.96);
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  transition: width 0.3s ease;
  box-shadow: 3px 0 30px rgba(15, 23, 42, 0.08);

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
    height: 100dvh;
    width: min(82vw, 300px);
    max-width: 300px;
    transform: ${(props) => (props.$mobileOpen === false ? 'translateX(-100%)' : 'translateX(0)')};
    transition: transform 0.25s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(42, 163, 105, 0.15);
  background: white;
  font-size: 14px;
  color: #0d2b1c;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(42, 163, 105, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(42, 163, 105, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(42, 163, 105, 0.5);
    }
  }
`;

const SidebarGroup = styled.div`
  padding: 0.25rem 0;
`;

const SidebarItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface SidebarMenuButtonProps {
  isActive?: boolean;
  isSubmenu?: boolean;
  $collapsed?: boolean;
}

const SidebarMenuButton = styled.button<SidebarMenuButtonProps>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: ${(props) => (props.isSubmenu ? '0.5rem 1rem 0.5rem 2.5rem' : '0.75rem 1rem')};
  background: ${(props) =>
    props.isActive ? 'linear-gradient(135deg, #2aa369 0%, #1f7a4a 100%)' : 'transparent'};
  color: ${(props) => (props.isActive ? 'white' : '#0d2b1c')};
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: ${(props) =>
      props.isActive ? 'linear-gradient(135deg, #1f7a4a 0%, #185c39 100%)' : 'rgba(42, 163, 105, 0.1)'};
    color: ${(props) => (props.isActive ? 'white' : '#1f7a4a')};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SidebarSubmenu = styled.div`
  display: flex;
  flex-direction: column;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(42, 163, 105, 0.15);
  background: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
