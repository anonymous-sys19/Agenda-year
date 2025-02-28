import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import React from "react"
import { Button } from "@/components/ui/button"
import { Share2, Eye } from "lucide-react"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

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

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchSchedules() {
            const { data, error } = await supabase
                .from('schedule_available')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setSchedules(data)

            if (error) console.error(error)
        }

        fetchSchedules()
    }, [])

    const handleShare = (slug: string) => {
        const url = `${window.location.origin}/schedule/${slug}`
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-xl">
                    <div className="grid gap-4">
                        {schedules.map((schedule) => (
                            <Card key={schedule.id} className="backdrop-blur-md bg-white/10 border-none text-white hover:bg-white/20 transition-all">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        {schedule.profile?.avatar_url && (
                                            <img
                                                src={schedule.profile.avatar_url}
                                                alt={schedule.profile.display_name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        )}
                                        <div>
                                            <CardTitle className="text-xl">
                                                {schedule.profile?.display_name || 'Anonymous'}
                                            </CardTitle>
                                            <CardDescription className="text-gray-300">
                                                {format(new Date(schedule.created_at), 'PPP')}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-300 space-y-3 w-auto max-h-[400px] overflow-auto scrollbar-hide">
                                        {schedule.description.split("\n").map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="inline-block px-3 py-1 rounded-full bg-purple-500/30 text-sm">
                                            {schedule.slug}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-white hover:text-purple-300"
                                                onClick={() => handleShare(schedule.slug)}
                                            >
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Share
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-white hover:text-purple-300"
                                                onClick={() => navigate(`/schedule/${schedule.slug}`)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Preview
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}