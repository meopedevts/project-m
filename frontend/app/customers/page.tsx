import AddCustomer from '@/components/customer/add-customer'

export default function App() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <div className="flex-1 text-3xl font-semibold">Clientes</div>
        <AddCustomer />
      </div>
    </div>
  )
}
