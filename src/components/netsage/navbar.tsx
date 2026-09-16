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

interface NavbarProps {
  currentPath?: string;
  activeRoute?: string;
}

export function AppNavbar({ currentPath, activeRoute }: NavbarProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = activeRoute ? `/${activeRoute}` : (currentPath || routerState.location.pathname);
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
    <header className="sticky top-0 z-50 w-full border-b border-sky-500/20 bg-[#07192c]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3 transition-transform active:scale-98">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a2139] border border-sky-500/30 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-orange-400/50">
            <img src="/logo.png" alt="NetSage Logo" className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div>
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              Net<span className="text-sky-400">Sage</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                    : "text-sky-200/70 hover:bg-sky-500/10 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-sky-400" : "text-sky-300/60")} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[17px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2.5">
          {/* AI Engine Status Beacon */}
          <div className="hidden items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400"></span>
            </span>
            <span>4 Vendors Online</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-500/30 bg-[#0a2139] text-sky-200 md:hidden hover:text-white hover:border-orange-400/50"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-sky-500/20 bg-[#07192c]/98 px-4 py-4 backdrop-blur-md md:hidden animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30"
                      : "text-sky-200/70 hover:bg-sky-500/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 text-sky-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
