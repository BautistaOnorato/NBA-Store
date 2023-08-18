"use client"

import { Button } from "@/components/ui/button"
import ColorCircle from "@/components/ui/color-circle"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import AlertModal from "@/components/ui/modals/AlertModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Color, Team } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface TeamFormProps {
  initialData: Team | null
  billboards: Billboard[]
  colors: Color[]
}

const formSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  billboardId: z.string().min(1),
  primaryColorId: z.string().min(1),
  secondaryColorId: z.string().min(1),
  conference: z.string().min(4).max(4)
})

type TeamFormValues = z.infer<typeof formSchema>

const TeamForm: React.FC<TeamFormProps> = ({ initialData, billboards, colors }) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit team" : "Create team";
  const description = initialData ? "Edit a team" : "Add a new team";
  const toastMessage = initialData ? "Team updated" : "Team created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      imageUrl: "",
      billboardId: "",
      primaryColorId: "",
      secondaryColorId: "",
      conference: ""
    },
  });

  const onSubmit = async (data: TeamFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/teams/${params.teamId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/teams`, data)
      }
      router.push(`/${params.storeId}/teams`)
      router.refresh()
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/teams/${params.teamId}`)
      router.push(`/${params.storeId}/teams`)
      router.refresh()
      toast.success("Team deleted")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={() => onDelete()}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {
          initialData && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
              disabled={loading}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )
        }
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField 
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel onClick={() => console.log(field)}>Team logo</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chicago Bulls..." disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billboardId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a billboard</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          billboards.map((item) => (
                            <SelectItem value={item.id} key={item.id}>{item.label}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="primaryColorId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary color</FormLabel>
                  <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a color</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          colors.map((item) => (
                              <SelectItem value={item.id} key={item.id}>
                                <div className="flex items-center gap-x-2">
                                  <ColorCircle value={item.value} className="p-0 h-4 w-4 ml-auto" />
                                  {item.name}
                                </div>
                              </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="secondaryColorId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary color</FormLabel>
                  <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a color</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          colors.map((item) => (
                              <SelectItem value={item.id} key={item.id}>
                                <div className="flex items-center gap-x-2">
                                  <ColorCircle value={item.value} className="p-0 h-4 w-4 ml-auto" />
                                  {item.name}
                                </div>
                              </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="conference"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conference</FormLabel>
                  <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a conference</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"West"}>Western conference</SelectItem>
                        <SelectItem value={"East"}>Eastern conference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default TeamForm