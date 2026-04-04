import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop: full sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile: sticky top header */}
        <MobileHeader />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto pb-[64px] md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile: fixed bottom navigation */}
      <BottomNav />
    </div>
  );
}
