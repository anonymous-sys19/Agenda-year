import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import React from "react"
import { Button } from "@/components/ui/button"
import { Share2, Eye } from "lucide-react"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FuturisticDrawer } from "./components/futuristic-drawer"
import THEME_COLORS from '@/lib/theme'

export interface Schedule {
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

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true)
      const { data, error } = await supabase
        .from("schedule_available")
        .select("*")
        .order("created_at", { ascending: false })

      if (data) setSchedules(data)
      if (error) console.error(error)
      setLoading(false)
    }

    fetchSchedules()
  }, [])

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/schedule/${slug}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!", {
      icon: "🔗",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    })
  }

  const handleCardClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
  }

  return (
    <div className={`min-h-screen bg-[${THEME_COLORS.background}] overflow-hidden relative p-4 sm:p-8`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${THEME_COLORS.gradients.background}`}></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

        {/* Animated particles */}
        <div className="stars absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className={`star absolute w-1 h-1 ${THEME_COLORS.text.primary} rounded-full`}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          className={`text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r ${THEME_COLORS.gradients.text}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Futuristic Schedules
        </motion.h1>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="w-16 h-16 relative">
                <motion.div
                  className="absolute inset-0 border-4 border-t-cyan-500 border-r-purple-500 border-b-blue-500 border-l-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 border-4 border-t-transparent border-r-cyan-300 border-b-purple-300 border-l-blue-300 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="w-full max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {schedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <Card
                    className={`overflow-hidden border-0 bg-transparent hover:scale-105 transition-all duration-300 cursor-pointer`}
                    onClick={() => handleCardClick(schedule)}
                  >
                    {/* Card background effects */}
                    <div className={`absolute inset-0 ${THEME_COLORS.glassOverlay} backdrop-blur-xl rounded-2xl`}></div>
                    <div className={`absolute inset-0 border ${THEME_COLORS.borders} rounded-2xl`}></div>

                    <CardHeader className="relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {schedule.profile?.avatar_url ? (
                            <div className="relative">
                              <div className={`absolute -inset-1 bg-gradient-to-r ${THEME_COLORS.gradients.accent} rounded-full blur-sm opacity-70`}></div>
                              <img
                                src={schedule.profile.avatar_url || "/placeholder.svg"}
                                alt={schedule.profile.display_name}
                                className={`relative w-12 h-12 rounded-full object-cover border-2 ${THEME_COLORS.borders}`}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className={`absolute -inset-1 bg-gradient-to-r ${THEME_COLORS.gradients.accent} rounded-full blur-sm opacity-70`}></div>
                              <div className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${THEME_COLORS.gradients.button} flex items-center justify-center border-2 ${THEME_COLORS.borders}`}>
                                <span className={`text-xl font-bold ${THEME_COLORS.text.primary}`}>
                                  {(schedule.profile?.display_name || "A")[0].toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <CardTitle className={`text-lg font-semibold ${THEME_COLORS.text.primary}`}>
                            {schedule.profile?.display_name || "Anonymous"}
                          </CardTitle>
                          <CardDescription className={THEME_COLORS.text.accent}>
                            {format(new Date(schedule.created_at), "PPP")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="h-32 overflow-y-auto scrollbar-hide">
                        <p className={`text-sm ${THEME_COLORS.text.secondary} space-y-2`}>
                          {schedule.description
                            .split("\n")
                            .slice(0, 3)
                            .map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          {schedule.description.split("\n").length > 3 && <span className="text-cyan-400">...</span>}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className={`inline-block px-3 py-1 rounded-full ${THEME_COLORS.glassOverlay} ${THEME_COLORS.text.accent}`}>
                          {schedule.slug}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${THEME_COLORS.text.accent} hover:${THEME_COLORS.text.hover} hover:bg-cyan-400/20 transition-colors duration-300`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(schedule.slug)
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${THEME_COLORS.text.accent} hover:${THEME_COLORS.text.hover} hover:bg-purple-400/20 transition-colors duration-300`}
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/schedule/${schedule.slug}`)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FuturisticDrawer schedule={selectedSchedule} onClose={() => setSelectedSchedule(null)} />
    </div>
  )
}

