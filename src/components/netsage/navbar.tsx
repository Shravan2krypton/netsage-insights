import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  UploadCloud,
  Brain,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./theme-selector";

interface NavbarProps {
  currentPath?: string;
  activeRoute?: string;
}

export function AppNavbar({ currentPath, activeRoute }: NavbarProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = activeRoute ? `/${activeRoute}` : currentPath || routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Audit Hub", href: "/audit", icon: UploadCloud },
    { label: "AI Analysis", href: "/analysis", icon: Brain },
    { label: "Adaptive Learning", href: "/learning", icon: Zap },
    { label: "Results", href: "/results", icon: CheckCircle2 },
    { label: "Reports", href: "/reports", icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)]/60 bg-[var(--background)]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3 transition-transform active:scale-98">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)]/60 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[var(--primary)]/50">
            <img
              src="/logo.png"
              alt="NetSage Logo"
              className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <span className="font-sans text-lg font-bold tracking-tight text-[var(--foreground)]">
              Net<span className="text-[var(--primary)]">Sage</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--primary)]/15 text-[var(--primary)] font-semibold border border-[var(--primary)]/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)]",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]/60",
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[17px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status Beacon */}
          <div className="hidden items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)] lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
            </span>
            <span>4 Vendors Online</span>
          </div>

          {/* Theme Selector */}
          <div className="relative group">
            <ThemeSelector />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-[10px] font-medium text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Toggle Theme
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]/60 bg-[var(--surface)] text-[var(--muted-foreground)] md:hidden hover:text-[var(--foreground)] hover:border-[var(--primary)]/50"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--border)]/60 bg-[var(--background)]/98 px-4 py-4 backdrop-blur-md md:hidden animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--primary)]/15 text-[var(--primary)] font-semibold border border-[var(--primary)]/30"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* Mobile Theme Selector */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">Theme</span>
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
