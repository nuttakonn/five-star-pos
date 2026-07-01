import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  History, 
  Package, 
  BarChart3, 
  Menu,
  X,
  Store,
  LogOut,
  ShieldCheck,
  Eye,
  KeyRound,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import versionInfo from "../version.json"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'viewer'] },
  { name: 'Sales History', href: '/history', icon: History, roles: ['admin', 'viewer'] },
  { name: 'Inventory', href: '/products', icon: Package, roles: ['admin'] },
  { name: 'Movements', href: '/stock', icon: BarChart3, roles: ['admin'] },
  { name: 'Staff', href: '/users', icon: Users, roles: ['admin'] },
  { name: 'Security', href: '/change-password', icon: KeyRound, roles: ['admin', 'viewer'] },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Admin'
  const userRole = localStorage.getItem('user_role') || 'viewer'

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('username')
    localStorage.removeItem('user_role')
    navigate('/login')
  }

  const visibleNavigation = navigation.filter(item => item.roles.includes(userRole))

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Store className="h-6 w-6 text-primary" />
            <span>Five Star POS</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* System Version Info at bottom of Sidebar */}
        <div className="mt-auto p-4 border-t">
          <div className="bg-muted/50 rounded-lg p-2 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">System Version</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-primary">v{versionInfo.version}</span>
              <span className="text-[10px] text-muted-foreground">{versionInfo.commit}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center pt-1 border-t border-muted/50">
              Deployed: {versionInfo.deployedAt}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full hidden sm:flex">
              {userRole === 'admin' ? (
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              ) : (
                <Eye className="h-3.5 w-3.5 text-orange-600" />
              )}
              <span className="text-[10px] uppercase font-bold text-muted-foreground">{userRole}</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Logged in as</p>
              <p className="text-sm font-bold">{username}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
