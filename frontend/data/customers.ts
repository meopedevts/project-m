import { createCustomerSchema } from '@/components/customer/customer-post-form'
import { updateCustomerSchema } from '@/components/customer/customer-put-form'
import { Customer } from '@/types/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { z } from 'zod'

export async function getAllCustomers() {
  return await axios
    .get('http://localhost:8080/customers')
    .then((response: AxiosResponse) => {
      const data: Customer[] = response.data
      return data
    })
    .catch((error: AxiosError) => {
      console.log(error)
      return undefined
    })
}

export async function createCustomer(
  payload: z.infer<typeof createCustomerSchema>,
) {
  return await axios
    .post('http://localhost:8080/customers', payload)
    .then((response: AxiosResponse) => {
      const customer: Customer = response.data
      return customer
    })
}

export async function updateCustomer(
  customer: z.infer<typeof updateCustomerSchema>,
) {
  type updateCustomer = Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>
  const customerPayload: updateCustomer = {
    company: customer.company,
    email: customer.email,
    phone: customer.phone,
  }

  return await axios
    .put(
      'http://localhost:8080/customers/' + customer.customerId,
      customerPayload,
    )
    .then((response: AxiosResponse) => {
      const customer: Customer = response.data
      return customer
    })
}

export async function deleteCustomer(customer: Customer) {
  // @ts-expect-error Missing type definition, but component works
  const customerId = customer.customer_id

  return await axios
    .delete('http://localhost:8080/customers/' + customerId)
    .then(() => {
      return customer
    })
}
