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
import { Loader2, MailCheck } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  email: z.string().email({
    message: 'Preencha um email válido.',
  }),
})

const LoginForm = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios
      .post('http://localhost:8080/auth/login', values)
      .then(() => {
        toast({
          duration: 4500,
          title: (
            <div className="flex items-center justify-center gap-4 px-2 py-1 text-base font-semibold text-emerald-900">
              <MailCheck size={28} /> Link de acesso enviado com sucesso!
            </div>
          ),
          className: 'bg-emerald-500',
        })
        form.reset()
      })
      .catch((error: AxiosError) => {
        const err: string = error.response?.data as string
        if (error.response?.status === 404) {
          form.setError('email', {
            type: 'custom',
            message: err,
          })
        } else {
          console.log(err)
        }
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[28rem] space-y-8"
      >
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
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-700" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full dark:text-secondary-foreground"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Entrar</>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
