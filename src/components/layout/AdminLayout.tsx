
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

// Import icons
import { 
  Users, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Home, 
  Settings, 
  HelpCircle,
  Menu,
  LogOut,
  BarChart
} from 'lucide-react';

type MenuItem = {
  name: string;
  path: string;
  icon: JSX.Element;
  requiredRoles?: string[];
};

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user } = useUser();
  const role = user?.role || 'user';

  const menuItems: MenuItem[] = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Policies', 
      path: '/admin/policies', 
      icon: <FileText className="w-5 h-5" />,
      requiredRoles: ['admin', 'underwriter', 'manager'] 
    },
    { 
      name: 'Claims', 
      path: '/admin/claims', 
      icon: <CheckCircle className="w-5 h-5" />,
      requiredRoles: ['admin', 'manager'] 
    },
    { 
      name: 'Customers', 
      path: '/admin/customers', 
      icon: <Users className="w-5 h-5" />,
      requiredRoles: ['admin', 'underwriter', 'support', 'manager'] 
    },
    { 
      name: 'Payments', 
      path: '/admin/payments', 
      icon: <DollarSign className="w-5 h-5" />,
      requiredRoles: ['admin', 'manager'] 
    },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: <BarChart className="w-5 h-5" />,
      requiredRoles: ['admin', 'underwriter', 'manager'] 
    },
    { 
      name: 'Support', 
      path: '/admin/support', 
      icon: <HelpCircle className="w-5 h-5" />,
      requiredRoles: ['admin', 'support', 'manager'] 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" />,
      requiredRoles: ['admin'] 
    }
  ];

  const filteredItems = menuItems.filter(item => {
    // If no required roles are specified, show to everyone
    if (!item.requiredRoles) return true;
    
    // Otherwise, check if the user has the required role
    return item.requiredRoles.includes(role);
  });

  return (
    <aside className={cn("pb-12 w-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Admin Portal
          </h2>
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.path ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const location = useLocation();
  const { logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  
  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    return path.split('/').pop()?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Dashboard';
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMobileNav}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/admin" className="font-bold text-xl">
              InsureMojo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
        {isMobile ? (
          isMobileNavOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed left-0 top-0 z-50 h-full w-3/4 border-r bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold">InsureMojo</h2>
                  <Button variant="ghost" size="icon" onClick={toggleMobileNav}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
                <Sidebar />
              </div>
            </div>
          )
        ) : (
          <Sidebar className="hidden md:block" />
        )}
        <main className="flex w-full flex-col p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {getCurrentPageTitle()}
            </h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
