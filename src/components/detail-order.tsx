 import { FormatPrice } from "@/utils"
 import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table"
import { OrderPurchase, Product } from "@/interfaces/models/admin"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { IconInvoice } from "@tabler/icons-react"

 interface DetailOrderProps {
    open: boolean
    onClose: () => void
    cart?: OrderPurchase | null
}
export default function DetailOrder({open, onClose,cart}: DetailOrderProps) {
 
    const renderCustomerInfo = () => (
      <div className='mb-4 space-y-2 text-sm'>
        {cart?.customer && <span>N°Client : {cart.customer.id}</span>}
        <p>
          Client : {cart?.customer?.first_name + ' ' + cart?.customer?.last_name}
        </p>
        <p>Téléphone : {cart?.customer?.phone}</p>
      </div>
    )
  
    const renderTotals = () => (
      <div className='flex flex-col text-sm font-semibold'>
        <span className='text-blue-700'>Total Net : {FormatPrice(cart?.total_command)}</span>
        <span className='text-gray-700'>Avance : {FormatPrice(cart?.total_payment)}</span>
        <span className='text-red-700'>Remise : - {FormatPrice(cart?.discount)}</span>
        <span className='text-green-700'>Total à payer : {FormatPrice(cart?.rest_a_pay)}</span>
      </div>
    )
  const renderPrescriptionDetails = () => {
    return (
      <>
        <div className='mt-4'>
          <h4 className='mb-2 text-lg font-bold'>Mesure</h4>

          {/* LOIN */}
          {(cart?.prescription?.type_glasse_id == '2' ||
            cart?.prescription?.type_glasse_id == '1') && (
              <div className='space-y-4'>
                {/* Loin Form Group */}
                <div className='space-y-2'>
                  <Badge className='text-md font-bold '>Loin</Badge>
                  <div className='flex justify-between'>
                    <Label></Label>
                    <Label>Sph</Label>
                    <Label>Cyl</Label>
                    <Label>Axe</Label>
                    <Label>ADD</Label>
                  </div>
                </div>
                <div className='space-y-2'>
                  {/* OD Inputs */}
                  <div className='flex items-center justify-between'>
                    <Label>OD</Label>
                    <Label>{cart?.prescription?.loin_od_sph}</Label>
                    <Label>{cart?.prescription?.loin_od_cyl}</Label>
                    <Label>{cart?.prescription?.loin_od_axe}</Label>
                    <Label>{cart?.prescription?.loin_od_add}</Label>
                  </div>
                </div>
                {/* OG Inputs */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label>OG</Label>
                    <Label>{cart?.prescription?.loin_og_sph}</Label>
                    <Label>{cart?.prescription?.loin_og_cyl}</Label>
                    <Label>{cart?.prescription?.loin_og_axe}</Label>
                    <Label>{cart?.prescription?.loin_og_add}</Label>
                  </div>
                </div>
                {/* Extra Fields */}
                <div className='flex justify-center gap-6'>
                  <Label>Eip : {cart?.prescription?.od_ecart}</Label>
                  <Label>H : {cart?.prescription?.od_ht}</Label>
                </div>
              </div>
            )}

          {/* Pres */}
          {(cart?.prescription?.type_glasse_id == '3' ||
            cart?.prescription?.type_glasse_id == '1') && (
              <div className='space-y-4'>
                {/* Pres Form Group */}
                <div className='space-y-2'>
                  <Badge className='text-md font-bold '>Pres</Badge>

                  <div className='flex justify-between'>
                    <Label></Label>
                    <Label>Sph</Label>
                    <Label>Cyl</Label>
                    <Label>Axe</Label>
                    <Label>ADD</Label>
                  </div>
                </div>
                <div className='space-y-2'>
                  {/* OD Inputs */}
                  <div className='flex items-center justify-between'>
                    <Label>OD</Label>
                    <Label>{cart.prescription?.pres_od_sph}</Label>
                    <Label>{cart.prescription?.pres_od_cyl}</Label>
                    <Label>{cart.prescription?.pres_od_axe}</Label>
                    <Label>{cart.prescription?.pres_od_add}</Label>
                  </div>
                </div>
                {/* OG Inputs */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label>OG</Label>
                    <Label>{cart.prescription?.pres_og_sph}</Label>
                    <Label>{cart.prescription?.pres_og_cyl}</Label>
                    <Label>{cart.prescription?.pres_og_axe}</Label>
                    <Label>{cart.prescription?.pres_og_add}</Label>
                  </div>
                </div>
                {/* Extra Fields */}
                <div className='flex justify-center gap-2'>
                  <Label>Eip :{cart.prescription?.og_ecart}</Label>
                  <Label>H :{cart.prescription?.og_ht}</Label>
                </div>
              </div>
            )}
        </div>
      </>
    )
  }

 
  return (
    <Dialog open={open}  >
    <DialogContent
      className='max-h-screen overflow-y-scroll [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2'
    >
      <DialogHeader>
        <DialogTitle className='felx-row flex items-center'>
          <IconInvoice className='mr-2' />
          Vérifier
        </DialogTitle>
      </DialogHeader>
    
           <div className='flex items-center justify-between py-4'>
            <img src={''} className='mb-4 h-auto w-24' />
            <div className='mb-2 text-lg font-bold'>Fiche atelier</div>
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
              <>
                {cart?.details?.map((row: Product, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.qte}</TableCell>
                    <TableCell>{FormatPrice(row.price)}</TableCell>
                    <TableCell>{FormatPrice(row.qte * row.price)}</TableCell>
                  </TableRow>
                ))}
 
              </>
            </TableBody>
          </Table>

          {renderTotals()}

          {renderPrescriptionDetails()}

          <div className= 'mt-12 flex justify-end gap-2 hidden-print'>
            <Button variant='outline' onClick={onClose}>Fermer</Button>
           </div>
          </DialogContent>
    </Dialog>
  )
}
