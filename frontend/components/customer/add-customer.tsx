import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { buttonVariants } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomerForm from './customer-form'

export default function AddCustomer() {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}
      >
        <PlusCircle size={16} />
        Cadastrar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Cliente</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para cadastro do cliente.
          </DialogDescription>
        </DialogHeader>
        <CustomerForm />
      </DialogContent>
    </Dialog>
  )
}
