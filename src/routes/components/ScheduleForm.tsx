import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import THEME_COLORS from '@/lib/theme'

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
})

export function ScheduleForm() {
  const [userId, setUserId] = useState<string | undefined>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      slug: "",
    },
  })

  // Get the logged in user ID
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    getUser()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.from("schedule_available").insert([
        {
          description: values.description,
          slug: values.slug,
          user_id: userId,
        },
      ])

      if (error) throw error
      if (!data) throw new Error("No data returned from Supabase.")

      toast.success("Schedule created: Your schedule has been successfully created.")

      form.reset()
    } catch {
      toast.error("Error: Something went wrong. Please try again.")
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-8 `} >
      
        {/* Background effects using theme colors */}
        <div className={`absolute inset-0 bg-[${THEME_COLORS.background}]`}></div>
        {/* <div className={`absolute inset-0 bg-gradient-to-br ${THEME_COLORS.gradients.background}`}></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-8">
            <div className={`space-y-6 p-8 ${THEME_COLORS.glassOverlay} backdrop-blur-xl rounded-2xl ${THEME_COLORS.borders} shadow-2xl overflow-hidden`}>
              {/* Decorative elements */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-r ${THEME_COLORS.gradients.button} opacity-20 rounded-full blur-3xl -z-10`}></div>
              <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r ${THEME_COLORS.gradients.accent} opacity-20 rounded-full blur-3xl -z-10`}></div>

              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${THEME_COLORS.gradients.text}`}>
                  Create Your Schedule
                </h2>
                <div className={`h-1 w-20 bg-gradient-to-r ${THEME_COLORS.gradients.text} rounded-full mt-2 sm:mt-0`} />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className={THEME_COLORS.text.accent}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* <div className={`absolute -inset-0.5 bg-gradient-to-r ${THEME_COLORS.gradients.button} rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-300`}></div> */}
                        <Textarea
                          placeholder="Enter your schedule description"
                          className={`resize-none h-32 ${THEME_COLORS.glassOverlay} backdrop-blur-sm ${THEME_COLORS.borders} rounded-xl relative focus:${THEME_COLORS.effects.glow} focus:border-transparent transition-all duration-300 ${THEME_COLORS.text.primary} placeholder-gray-400`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className={`text-sm ${THEME_COLORS.text.accent} opacity-70`}>
                      Describe your schedule availability in detail.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className={THEME_COLORS.text.accent}>
                      Slug
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* <div className={`absolute -inset-0.5 bg-gradient-to-r ${THEME_COLORS.gradients.button} rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-300`}></div> */}
                        <Input
                          placeholder="enter-your-slug"
                          className={`${THEME_COLORS.glassOverlay} backdrop-blur-sm ${THEME_COLORS.borders} rounded-xl relative focus:${THEME_COLORS.effects.glow} focus:border-transparent transition-all duration-300 ${THEME_COLORS.text.primary} placeholder-gray-400`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className={`text-sm ${THEME_COLORS.text.accent} opacity-70`}>
                      This will be your schedule's unique identifier.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

                <Button
                  type="submit"
                  className={`w-full relative overflow-hidden group bg-gradient-to-r ${THEME_COLORS.gradients.button} hover:bg-gradient-to-r hover:${THEME_COLORS.gradients.buttonHover} ${THEME_COLORS.text.primary} font-medium py-4 rounded-xl ${THEME_COLORS.effects.shadow} hover:shadow-blue-500/40 transition-all duration-300`}
                >
                  <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Schedule
                  </span>
                </Button>
             
            </div>
          </form>
        </Form>
     
    </div>
  )
}

