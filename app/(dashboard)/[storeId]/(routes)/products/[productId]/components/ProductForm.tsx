"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import ColorCircle from "@/components/ui/color-circle"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Heading from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import AlertModal from "@/components/ui/modals/AlertModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Size, Color, Team, Category, Product, Image } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null
  sizes: Size[]
  colors: Color[]
  categories: Category[]
  teams: Team[]
}

const formSchema = z.object({
  name: z.string().min(1).max(50),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(1),
  description: z.string().min(1).max(250),
  colorId: z.string().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  teamId: z.string().min(1),
  isRetro: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm: React.FC<ProductFormProps> = ({ initialData, sizes, colors, teams, categories }) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? 
    {
      ...initialData,
      price: parseFloat(String(initialData?.price))
    } : {
      name: "",
      images: [],
      price: 0,
      description: "",
      colorId: "",
      categoryId: "",
      sizeId: "",
      teamId: "",
      isRetro: false,
      isArchived: false,
      isFeatured: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.push(`/${params.storeId}/products`)
      router.refresh()
      toast.success("Product deleted")
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
            name="images"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel onClick={() => console.log(field)}>Product images</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => (
                      field.onChange([...field.value, { url }])
                    )}
                    onRemove={(url) => (
                      field.onChange([
                        ...field.value.filter(current => current.url !== url)
                      ])
                    )}
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
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chicago Bulls Jersey..." disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="9.99" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="teamId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a team</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          teams.map((item) => (
                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
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
              name="colorId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
              name="sizeId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a size</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          sizes.map((item) => (
                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
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
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {field.value ? <SelectValue defaultValue={field.value}  /> : <span>Select a category</span>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          categories.map((item) => (
                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
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
              name="isRetro"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Retro</FormLabel>
                    <FormDescription>
                      This product will be classified as retro.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isFeatured"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isArchived"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField 
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel onClick={() => console.log(field)}>Product description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Zach Lavine number 8 red jersey..."
                    className="resize-none"
                    disabled={loading} 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default ProductForm