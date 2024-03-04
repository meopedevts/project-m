'use client'

import { customerColumns } from '@/components/customer/customer-columns'
import { CustomerDataTable } from '@/components/customer/customer-data-table'
import { Customer } from '@/types/types'

interface props {
  data: Customer[]
}

export default function CustomerTable({ data }: props) {
  return <CustomerDataTable columns={customerColumns} data={data} />
}
