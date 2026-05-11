import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import React from 'react';

// Styled wrappers with sensible defaults matching site design
export const DropdownMenu = RadixDropdown.Root;

export const DropdownMenuTrigger = RadixDropdown.Trigger;

export const DropdownMenuContent = React.forwardRef<HTMLElement, RadixDropdown.DropdownMenuContentProps>(
  ({ className = '', align = 'start', side = 'bottom', sideOffset = 8, children, ...props }, ref) => (
    <RadixDropdown.Content
      ref={ref as any}
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={`min-w-[12rem] rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200 ${className}`}
      {...props}
    >
      {children}
    </RadixDropdown.Content>
  )
);

export const DropdownMenuGroup = RadixDropdown.Group;

export const DropdownMenuItem = React.forwardRef<HTMLElement, RadixDropdown.DropdownMenuItemProps>(
  ({ className = '', children, ...props }, ref) => (
    <RadixDropdown.Item
      ref={ref as any}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 outline-none ${className}`}
      {...props}
    >
      {children}
    </RadixDropdown.Item>
  )
);

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, RadixDropdown.DropdownMenuLabelProps>(
  ({ className = '', children, ...props }, ref) => (
    <RadixDropdown.Label ref={ref as any} className={`px-3 py-1 text-xs font-semibold text-slate-500 ${className}`} {...props}>
      {children}
    </RadixDropdown.Label>
  )
);

export const DropdownMenuSeparator = (props: any) => <RadixDropdown.Separator className="my-1 h-px bg-slate-100" {...props} />;

export const DropdownMenuShortcut = ({ children }: { children?: React.ReactNode }) => (
  <span className="ml-auto text-xs text-slate-400">{children}</span>
);

export const DropdownMenuSub = RadixDropdown.Sub;
export const DropdownMenuSubTrigger = React.forwardRef<HTMLElement, RadixDropdown.DropdownMenuSubTriggerProps>(
  ({ className = '', children, ...props }, ref) => (
    <RadixDropdown.SubTrigger ref={ref as any} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 ${className}`} {...props}>
      {children}
    </RadixDropdown.SubTrigger>
  )
);

export const DropdownMenuSubContent = React.forwardRef<HTMLElement, RadixDropdown.DropdownMenuSubContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <RadixDropdown.SubContent ref={ref as any} className={`min-w-[12rem] rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200 ${className}`} {...props}>
      {children}
    </RadixDropdown.SubContent>
  )
);

export default RadixDropdown;
