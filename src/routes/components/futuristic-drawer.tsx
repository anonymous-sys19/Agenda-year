
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { X } from "lucide-react"
import THEME_COLORS from '@/lib/theme'

interface Schedule {
  id: number
  description: string
  created_at: string
  slug: string
  user_id: string
  profile: {
    display_name: string
    avatar_url: string
  }
}

interface FuturisticDrawerProps {
  schedule: Schedule | null
  onClose: () => void
}

export const FuturisticDrawer: React.FC<FuturisticDrawerProps> = ({ schedule, onClose }) => {
  if (!schedule) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-[${THEME_COLORS.background}] shadow-2xl border-l ${THEME_COLORS.borders}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background effects */}
          <div className={`absolute inset-0 bg-gradient-to-br ${THEME_COLORS.gradients.background}`}></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

          <div className="relative h-full overflow-y-auto scrollbar-hide p-6">
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 ${THEME_COLORS.text.accent} hover:${THEME_COLORS.text.hover} transition-colors`}
            >
              <X size={24} />
            </button>

            <div className="mb-6 flex items-center space-x-4">
              <div className="relative">
                {schedule.profile?.avatar_url ? (
                  <div className="relative">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${THEME_COLORS.gradients.accent} rounded-full blur-sm opacity-70`}></div>
                    <img
                      src={schedule.profile.avatar_url || "/placeholder.svg"}
                      alt={schedule.profile.display_name}
                      className={`relative w-16 h-16 rounded-full object-cover border-2 ${THEME_COLORS.borders}`}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${THEME_COLORS.gradients.accent} rounded-full blur-sm opacity-70`}></div>
                    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${THEME_COLORS.gradients.button} flex items-center justify-center border-2 ${THEME_COLORS.borders}`}>
                      <span className={`text-2xl font-bold ${THEME_COLORS.text.primary}`}>
                        {(schedule.profile?.display_name || "A")[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${THEME_COLORS.gradients.text}`}>
                  {schedule.profile?.display_name || "Anonymous"}
                </h2>
                <p className={THEME_COLORS.text.accent}>{format(new Date(schedule.created_at), "PPP")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`inline-block px-3 py-1 rounded-full ${THEME_COLORS.glassOverlay} border ${THEME_COLORS.borders} ${THEME_COLORS.text.accent}`}>
                {schedule.slug}
              </div>
              <div className={`prose prose-invert ${THEME_COLORS.glassOverlay} rounded-xl p-4 backdrop-blur-sm border ${THEME_COLORS.borders}`}>
                {schedule.description.split("\n").slice(0, 100).map((line, index) => (
                  <p key={index} className={THEME_COLORS.text.secondary}>
                    {line}
                    <br />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
