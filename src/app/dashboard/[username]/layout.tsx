import { Suspense } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

export default function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading user data...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}