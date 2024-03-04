import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteCustomer } from '@/data/customers'
import { cn } from '@/lib/utils'
import { Customer } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { buttonVariants } from '../ui/button'
import { Trash2, XCircle } from 'lucide-react'
import { toast } from '../ui/use-toast'

interface DeleteCustomerProps {
  customer: Customer
}

export default function DeleteCustomerDialog({
  customer,
}: DeleteCustomerProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteCustomerFn } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess(variables: Customer) {
      queryClient.setQueryData(['customers'], (customersCached: Customer[]) => {
        return [
          ...customersCached.filter(
            // @ts-expect-error Missing type definition, but component works
            (customer) => customer.customer_id !== variables.customer_id,
          ),
        ]
      })
      toast({
        duration: 3000,
        // @ts-expect-error Missing type definition, but component works
        title: (
          <div className="flex items-center justify-center gap-4 px-2 py-1 text-sm font-semibold text-red-600">
            <XCircle size={24} fill="#DC2626" className="text-red-100" />
            Cliente excluído com sucesso!
          </div>
        ),
        className: 'bg-red-100',
      })
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: 'destructive', size: 'icon' }))}
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja excluir este cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Uma vez o cliente excluído não pode
            ser utilizado em nenhum projeto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCustomerFn(customer)}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
