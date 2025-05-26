import { Nav } from "@/components/ui/nav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <a href="/" className="hidden md:block">
              <h1 className="text-xl font-bold">GitHub Analytics</h1>
            </a>
            <Nav />
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Avatar>
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  );
}