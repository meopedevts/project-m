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
import { toast } from '@/components/ui/use-toast'
import { ResponseError } from '@/types/types'

const formSchema = z.object({
  company: z.string(),
  email: z.string().email({
    message: 'Preencha um email válido.',
  }),
  phone: z.string(),
})

export default function CustomerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: '',
      email: '',
      phone: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios
      .post('http://localhost:8080/customers', values)
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
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
                Cliente cadastrado com sucesso!
              </div>
            ),
            className: 'bg-emerald-100',
          })
          setTimeout(() => {
            form.reset()
          }, 3500)
        }
      })
      .catch((error: AxiosError) => {
        const err: ResponseError = error.response?.data as ResponseError
        if (
          err.status === 400 &&
          (err.cause === 'payload' || err.cause === 'insert')
        ) {
          form.setError('email', {
            type: 'custom',
            message: err.message,
          })
        }
        if (err.status === 400 && err.cause === 'email') {
          form.setError('email', {
            type: 'custom',
            message: err.message,
          })
        }
        if (err.status === 400 && err.cause === 'company') {
          form.setError('company', {
            type: 'custom',
            message: err.message,
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
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Empresa"
                    type="text"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700" />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Telefone"
                    type="text"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Cadastrar</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
