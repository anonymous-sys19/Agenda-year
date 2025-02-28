import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast";
import { useState, useEffect } from "react";


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

//Obtengo el ID del usuario loggeadoo
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    getUser()
  }, [])


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase
        .from('schedule_available')
        .insert([
          {
            description: values.description,
            slug: values.slug,
            user_id: userId,
          }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 p-6 bg-black/5 backdrop-blur-lg rounded-lg border border-gray-200 dark:border-gray-800">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your schedule description"
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your schedule availability.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Slug</FormLabel>
                <FormControl>
                  <Input placeholder="enter-your-slug" {...field} />
                </FormControl>
                <FormDescription>
                  This will be your schedule's unique identifier.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3">
            Create Schedule
          </Button>
        </div>
      </form>
    </Form>
  )
}