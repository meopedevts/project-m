'use client'

import AddCustomer from '@/components/customer/add-customer'
import CustomerTable from '@/components/customer/customer-table'
import { getAllCustomers } from '@/data/customers'
import { Customer } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export default function CustomerContainer() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getAllCustomers,
  })
  const notCustomers: Customer[] = []

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-semibold">Clientes</div>
        {isLoading && <Loader2 className="animate-spin" />}
      </div>
      <div className="flex items-center justify-end">
        <AddCustomer />
      </div>
      {customers && <CustomerTable data={customers} />}
      {!customers && <CustomerTable data={notCustomers} />}
    </div>
  )
}
