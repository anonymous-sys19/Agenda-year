import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Helmet } from 'react-helmet-async'

interface ScheduleData {
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

            const { data, error } = await supabase
                .from('schedule_available')
                .select(`*`)
                .eq('slug', slug)
                .single()

            if (error) {
                console.error('Error fetching schedule:', error)
                return
            }
            if (data) setSchedule(data)
            setLoading(false)
        }

        fetchSchedule()
    }, [slug])

    if (loading) return <div>Loading...</div>
    if (!schedule) return <div>Schedule not found</div>

    return (
        <>
            <Helmet>
                <meta property="og:image" content={`https://tu-agenda-dev.vercel.app/api/og?description=${encodeURIComponent(schedule.description.substring(0, 100))}`} />
                <meta name="twitter:image" content={`https://tu-agenda-dev.vercel.app/api/og?description=${encodeURIComponent(schedule.description.substring(0, 100))}`} />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900 p-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="backdrop-blur-md bg-white/10 border-none text-white">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                {schedule.profiles?.avatar_url && (
                                    <img
                                        src={schedule.profiles.avatar_url}
                                        alt={schedule.profiles.display_name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div>
                                    <CardTitle className="text-2xl">
                                        {schedule.profiles?.display_name || 'Anonymous'}'s Schedule
                                    </CardTitle>
                                    <CardDescription className="text-gray-300">
                                        Last updated: {format(new Date(schedule.created_at), 'PPP')}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none">
                                <div className="text-lg space-y-4 leading-relaxed">
                                    {schedule.description.split("\n").map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}