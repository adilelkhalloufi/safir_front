import { OrderPurchase } from '@/interfaces/models/admin'
import { FormatPrice } from '@/utils'
import { format } from 'date-fns'
import { Button } from './ui/button'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { IconReceipt } from "@tabler/icons-react"

interface DetailOrderProps {
  open: boolean
  onClose: () => void
  cart?: OrderPurchase | any
}
export default function PrintInvoice({
  open,
  onClose,
  cart,
}: DetailOrderProps) {

  const renderCustomerInfo = () => (
    <div className='mb-4 space-y-2 text-sm'>
      {cart?.customer && <span>N°Client : {cart?.customer.id}</span>}
      <p>
        Client : {cart?.customer?.first_name + ' ' + cart?.customer?.last_name}
      </p>
      <p>Téléphone : {cart?.customer?.phone}</p>
    </div>
  )

  const renderTotals = () => (
    <div className='flex flex-col text-sm font-semibold'>

      <span className=''>
        Total Net : {FormatPrice(cart?.invoice_total)}
      </span>
    </div>
  )
  const receiptRef = useRef(null);

  const printReceipt = useReactToPrint({
    contentRef: receiptRef,
    onAfterPrint: () => {
      onClose()
    }
  });

  return (
    <Dialog open={open}>
      <DialogContent
        className='max-h-screen overflow-y-scroll [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2'
      >
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <IconReceipt className='mr-2' />
            Facture N° {cart?.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4' ref={receiptRef}>
          <div className='flex items-center justify-between py-4'>
            <img src={''} className='mb-4 h-auto w-24' />
            <div className='mb-2 text-lg font-bold'>Facture  N° {cart?.order_number}</div>
            <div className='mb-4 text-sm'>{format(new Date(), 'dd/MM/yyyy')}</div>
          </div>

          {renderCustomerInfo()}

          <Table className='mb-4 w-full border-collapse'>
            <TableHeader>
              <TableCell className='border p-2'>Produit</TableCell>
              <TableCell className='border p-2'>Qte</TableCell>
              <TableCell className='border p-2'>Prix</TableCell>
              <TableCell className='border p-2'>Total</TableCell>
            </TableHeader>
            <TableBody className='text-sm'>

              {cart?.details?.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.qte}</TableCell>
                  <TableCell>{FormatPrice(row.invoice_price)}</TableCell>
                  <TableCell>{FormatPrice(row.qte * row.invoice_price)}</TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
          {renderTotals()}
        </div>

        <div className='mt-12 flex justify-end gap-2 hidden-print'>
          <Button
            onClick={() => printReceipt()}
            className="mr-2"
          >
            Imprimer le reçu
          </Button>
          <Button variant='outline' onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
