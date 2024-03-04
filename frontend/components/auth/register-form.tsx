'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Loader2 } from 'lucide-react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({
    message: 'Preencha um email válido.',
  }),
})

const RegisterForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    await axios
      .post('http://localhost:8080/auth/register', values)
      .then((response: AxiosResponse) => {
        if (response.status === 204) {
          toast({
            duration: 3000,
            // @ts-expect-error Missing type definition, but component works
            title: (
              <div className="flex items-center justify-center gap-4 px-2 py-1 text-sm font-semibold text-emerald-600">
                <CheckCircle2
                  size={24}
                  fill="#059669"
                  className="text-emerald-100"
                />
                Conta criada com sucesso!
              </div>
            ),
            className: 'bg-emerald-100',
          })
        }
        setTimeout(() => router.push('/auth/login'), 4000)
      })
      .catch((error: AxiosError) => {
        const err: string = error.response?.data as string
        if (error.response?.status === 422) {
          form.setError('email', {
            type: 'custom',
            message: err,
          })
        }
      })
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[28rem] space-y-8"
        >
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      type="text"
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isSubmitSuccessful
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sobrenome"
                      type="text"
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isSubmitSuccessful
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    disabled={
                      form.formState.isSubmitting ||
                      form.formState.isSubmitSuccessful
                    }
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage className="text-red-700" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting || form.formState.isSubmitSuccessful
            }
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Criar conta</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm
