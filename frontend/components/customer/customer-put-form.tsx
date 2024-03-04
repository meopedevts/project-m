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
import { toast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCustomer } from '@/data/customers'
import { Customer, ResponseError } from '@/types/types'
import { AxiosError } from 'axios'

export const updateCustomerSchema = z.object({
  customerId: z.number(),
  company: z.string(),
  email: z.string().email({
    message: 'Preencha um email válido.',
  }),
  phone: z.string(),
})

interface CustomerPutProps {
  customer: Customer
}

export default function CustomerPutForm({ customer }: CustomerPutProps) {
  const form = useForm<z.infer<typeof updateCustomerSchema>>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      // @ts-expect-error Not existing definition, but response api returns customer_id
      customerId: customer.customer_id,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: updateCustomerFn } = useMutation({
    mutationFn: updateCustomer,
    onSuccess(variables: Customer) {
      queryClient.setQueryData(['customers'], (customersCached: Customer[]) => {
        return [
          ...customersCached.filter(
            // @ts-expect-error Missing type definition, but component works
            (customer) => customer.customer_id !== variables.customer_id,
          ),
          variables,
        ].toSorted((a, b) => a.customerId - b.customerId)
      })
    },
  })

  async function onSubmit(values: z.infer<typeof updateCustomerSchema>) {
    console.log(values)
    try {
      await updateCustomerFn(values)
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
            Cliente atualizado com sucesso!
          </div>
        ),
        className: 'bg-emerald-100',
      })
    } catch (error) {
      const axiosError = error as AxiosError
      const err: ResponseError = axiosError.response?.data as ResponseError
      if (
        err.status === 400 &&
        (err.cause === 'payload' || err.cause === 'update')
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
    }
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
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID"
                    type="string"
                    disabled={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700" />
              </FormItem>
            )}
          />
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
              <>Salvar</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
