'use client'

import { Customer } from '@/types/types'
import { ColumnDef } from '@tanstack/react-table'
import { buttonVariants } from '@/components/ui/button'
import { SquarePen } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CustomerPutForm from './customer-put-form'
import DeleteCustomerDialog from './delete-customer-dialog'

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'customer_id',
    header: 'Id',
  },
  {
    accessorKey: 'company',
    header: 'Empresa',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original

      return (
        <div className="flex items-center justify-end gap-4">
          <Dialog>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                '',
              )}
            >
              <SquarePen />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atualizar Cliente</DialogTitle>
                <DialogDescription>
                  Preencha o formulário abaixo para atualizar o cadastro do
                  cliente.
                </DialogDescription>
              </DialogHeader>
              <CustomerPutForm customer={customer} />
            </DialogContent>
          </Dialog>
          <DeleteCustomerDialog customer={customer} />
        </div>
      )
    },
  },
]
