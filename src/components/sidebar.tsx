import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, LogOut, X, Home, Calendar, BarChart3, Settings, Sparkles, LucideBadgeCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { List, PlusCircle, Share2 } from "lucide-react" // Añade estos imports

export interface SidebarProps {
  user: {
    display_name: string
    avatar_url: string
  }
  onNewEvent: () => void
  onSignOut: () => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ user, onNewEvent, onSignOut, isOpen, onClose }: SidebarProps) {



  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-hidden`}
    >
      {/* Futuristic background with animated gradient */}
      <div className="absolute inset-0 bg-[#0f0f1e] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

        {/* Animated accent lines with glow effect */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-glow"></div>
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-500 shadow-glow"></div>
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-500 via-blue-500 to-purple-600 shadow-glow"></div>
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-purple-600 via-blue-500 to-cyan-500 shadow-glow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Header with enhanced glow */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 group">
            <Sparkles className="h-5 w-5 text-cyan-400 group-hover:animate-pulse" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
              TU AGENDA {new Date().getFullYear()}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-colors duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile with enhanced hover effects */}
        <div className="relative mb-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group hover:bg-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 animate-pulse"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <Avatar className="h-12 w-12 ring-2 ring-cyan-500/70">
              <AvatarImage src={user?.avatar_url || undefined} alt={user?.display_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {user?.display_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user?.display_name}</span>
              <span className="text-xs text-cyan-400 flex items-center"> <LucideBadgeCheck className="w-4 text-cyan-600 mr-3" />   Active Now</span>
            </div>
          </div>
        </div>

        {/* Add Task Button with enhanced hover effect */}
        <Button
          variant="default"
          onClick={onNewEvent}
          className="w-full mb-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none relative overflow-hidden group shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          <span> Create Task</span>
        </Button>

        {/* Navigation with enhanced active state */}

        <nav className="flex-1 space-y-2">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={Calendar} label="Calendar" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-12 px-4 transition-all duration-300 text-gray-300 hover:bg-white/5 hover:text-cyan-400"
              >
                <BarChart3 className="h-5 w-5 mr-3 text-gray-400" />
                <span>Schedules Information</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-[#0f0f1e] backdrop-blur-xl border rounded-xl border-white/10 text-white p-2"
              align="end"
              side="bottom"
            >
              <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer px-3 py-2 rounded-lg">
                  <a href="schedule" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors w-full">
                    <List className="w-5 h-5 mr-3" />
                    <span>Schedule</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer px-3 py-2 rounded-lg">
                  <a href="/form-schedule" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors w-full">
                    <PlusCircle className="w-5 h-5 mr-3" />
                    <span>Create Schedule</span>
                  </a>
                </DropdownMenuItem>
               
                <DropdownMenuItem  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer px-3 py-2 rounded-lg">
                  <a href={`/schedule/slugds`} className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors w-full">
                    <Share2 className="w-5 h-5 mr-3" />
                    <span>Shared Schedule</span>
                  </a>
                </DropdownMenuItem>
              
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavItem icon={Settings} label="Settings" />
        </nav>



        {/* Sign Out Button with danger hover effect */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <Button
            variant="default"
            onClick={onSignOut}
            className="w-full bg-transparent hover:bg-red-500/10 text-white border border-white/10 group transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:text-red-400 transition-colors" />
            <span className="group-hover:text-red-400 transition-colors">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// NavItem component with enhanced active state
function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start text-left h-12 px-4 transition-all duration-300 ${active
        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-2 border-cyan-400 shadow-lg shadow-blue-500/10"
        : "text-gray-300 hover:bg-white/5 hover:text-cyan-400"
        }`}
    >
      <Icon className={`h-5 w-5 mr-3 transition-colors duration-300 ${active ? "text-cyan-400" : "text-gray-400"}`} />
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>}
    </Button>
  )
}

