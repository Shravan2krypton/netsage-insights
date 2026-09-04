import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  UploadCloud,
  Brain,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  LayoutDashboard,
  Sun,
  Moon,
  Plus,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  currentPath?: string;
  activeRoute?: string;
}

export function AppNavbar({ currentPath, activeRoute }: NavbarProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = activeRoute ? `/${activeRoute}` : (currentPath || routerState.location.pathname);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode from DOM
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Audit Hub", href: "/audit", icon: UploadCloud },
    { label: "AI Analysis", href: "/analysis", icon: Brain },
    { label: "Adaptive Learning", href: "/learning", icon: Zap },
    { label: "Results", href: "/results", icon: CheckCircle2 },
    { label: "Reports", href: "/reports", icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3 transition-transform active:scale-98">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-ai p-0.5 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white overflow-hidden">
              <img src="/logosih.png" alt="NetSage Logo" className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pass opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-pass"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold tracking-tight text-foreground">
                Net<span className="text-primary">Sage</span>
              </span>
              <span className="rounded-full border border-ai/30 bg-ai/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-ai">
                v2.4 AI
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Adaptive Compliance Engine
            </p>
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
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 font-semibold"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[17px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2.5">
          {/* AI Engine Status Beacon */}
          <div className="hidden items-center gap-2 rounded-full border border-pass/30 bg-pass/10 px-3 py-1 text-xs font-medium text-pass lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pass opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pass"></span>
            </span>
            <span>4 Vendors Online</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4 text-warn" /> : <Moon className="h-4 w-4 text-primary" />}
          </button>

          {/* Quick Action Button */}
          <button
            onClick={() => navigate({ to: "/audit" })}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 hover:shadow-primary/25 active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Audit</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground md:hidden hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card/95 px-4 py-4 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2">
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
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
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
