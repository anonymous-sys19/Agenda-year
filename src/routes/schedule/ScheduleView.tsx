import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import THEME_COLORS from '@/lib/theme'

export interface ScheduleData {
  id: number
  description: string
  created_at: string
  slug: string
  profiles: {
    display_name: string
    avatar_url: string
  }
}

export default function PublicSchedule() {
  const { slug } = useParams()
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchedule() {
      if (!slug) return

      const { data, error } = await supabase.from("schedule_available").select(`*`).eq("slug", slug).single()

      if (error) {
        console.error("Error fetching schedule:", error)
        return
      }
      if (data) setSchedule(data)
      setLoading(false)
    }

    fetchSchedule()
  }, [slug])

  return (
    <>
      <Helmet>
        <meta
          property="og:image"
          content={`https://tu-agenda-dev.vercel.app/api/og?description=${encodeURIComponent(schedule?.description?.substring(0, 100) || "")}`}
        />
        <meta
          name="twitter:image"
          content={`https://tu-agenda-dev.vercel.app/api/og?description=${encodeURIComponent(schedule?.description?.substring(0, 100) || "")}`}
        />
      </Helmet>

      <div className={`min-h-screen bg-[${THEME_COLORS.background}] overflow-hidden relative flex items-center justify-center p-4 sm:p-8`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${THEME_COLORS.gradients.background}`}></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

          {/* Animated particles */}
          <div className="stars absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`star absolute w-1 h-1 ${THEME_COLORS.text.primary} rounded-full`}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
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

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 relative">
                <motion.div
                  className={`absolute inset-0 border-4 border-t-cyan-500 border-r-purple-500 border-b-blue-500 border-l-transparent rounded-full`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className={`absolute inset-2 border-4 border-t-transparent border-r-cyan-300 border-b-purple-300 border-l-blue-300 rounded-full`}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
              <p className={`mt-4 ${THEME_COLORS.text.accent} font-light tracking-wider text-lg`}>LOADING SCHEDULE</p>
            </motion.div>
          ) : !schedule ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`relative z-10 ${THEME_COLORS.glassOverlay} backdrop-blur-lg p-8 rounded-2xl border border-red-500/30 max-w-md text-center`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Schedule Not Found</h2>
              <p className="text-gray-300">The schedule you're looking for doesn't exist or has been removed.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 w-full max-w-4xl"
            >
              <Card className="overflow-hidden border-0 bg-transparent">
                {/* Card background effects */}
                <div className={`absolute inset-0 ${THEME_COLORS.glassOverlay} backdrop-blur-xl rounded-3xl`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${THEME_COLORS.gradients.background} rounded-3xl opacity-30`}></div>
                <div className={`absolute inset-0 border ${THEME_COLORS.borders} rounded-3xl`}></div>

                {/* Glowing border effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${THEME_COLORS.gradients.accent} rounded-3xl opacity-20 blur-sm group-hover:opacity-30 transition duration-1000`}></div>

                <CardHeader className="relative z-10 pb-6">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${THEME_COLORS.gradients.button} opacity-20 rounded-bl-3xl`}></div>
                  <div className={`absolute top-0 left-0 w-16 h-1 bg-gradient-to-r ${THEME_COLORS.gradients.accent}`}></div>

                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      {schedule.profiles?.avatar_url ? (
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-70"></div>
                          <img
                            src={schedule.profiles.avatar_url || "/placeholder.svg"}
                            alt={schedule.profiles.display_name}
                            className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-70"></div>
                          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-800 to-purple-800 flex items-center justify-center border-2 border-white/20">
                            <span className="text-2xl font-bold text-white">
                              {(schedule.profiles?.display_name || "A")[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <CardTitle className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${THEME_COLORS.gradients.text}`}>
                        {schedule.profiles?.display_name || "Anonymous"}'s Schedule
                      </CardTitle>
                      <CardDescription className={`${THEME_COLORS.text.accent} flex items-center mt-1`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-cyan-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Last updated: {format(new Date(schedule.created_at), "PPP")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-4">
                  <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`}></div>
                  <div className={`absolute -left-3 top-1/2 w-6 h-20 bg-gradient-to-b ${THEME_COLORS.gradients.accent} rounded-r-full blur-sm opacity-30`}></div>

                  <div className="prose prose-invert max-w-none">
                    <div className={`text-lg space-y-4 leading-relaxed ${THEME_COLORS.text.secondary}`}>
                      {schedule.description.split("\n").map((line, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.2 + index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-8 flex justify-between items-center border-t ${THEME_COLORS.borders} pt-4`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${THEME_COLORS.gradients.accent} animate-pulse`}></div>
                      <span className={`text-xs ${THEME_COLORS.text.accent} font-mono`}>
                        ID: {schedule.id.toString().padStart(6, "0")}
                      </span>
                    </div>
                    <div className={`text-xs ${THEME_COLORS.text.secondary} font-mono`}>/{schedule.slug}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

