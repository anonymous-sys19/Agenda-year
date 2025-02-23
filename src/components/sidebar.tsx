import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, LogOut, X } from "lucide-react"

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
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >


      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">TU AGENDA {new Date().getFullYear()}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
        <div className="flex flex-col space-y-4">
          <Button
            variant="default"
            onClick={onNewEvent}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.avatar_url || undefined} alt={user?.display_name} />
              <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-300">{user?.display_name}</span>
          </div>
          <Button variant="default" onClick={onSignOut} className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

