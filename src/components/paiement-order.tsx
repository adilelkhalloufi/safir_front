import { FormatPrice } from "@/utils"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table"
import { OrderPurchase, Payment } from "@/interfaces/models/admin"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { IconInvoice } from "@tabler/icons-react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { apiRoutes } from "@/routes/api"
import http from "@/utils/http"

interface DetailOrderProps {
    open: boolean
    onClose: () => void
    cart?: OrderPurchase | null
}

export default function PaiementOrder({ open, onClose, cart }: DetailOrderProps) {
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Define form schema
    const paymentFormSchema = z.object({
        payment_method: z.string().min(1, "La méthode de paiement est requise"),
        amount: z.number().min(1, "Le montant doit être supérieur à 0")
    })

    // Initialize form
    const form = useForm<z.infer<typeof paymentFormSchema>>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            payment_method: "Espece",
            amount: 0
        }
    })

    const handleAddPayment = (data: z.infer<typeof paymentFormSchema>) => {
        console.log("Payment data:", data)
        setIsSubmitting(true)

        http.post(apiRoutes.addPaymentToOrder + "/" + cart?.id, {
            amount: data.amount
        }).then(() => {
            toast.success("Paiement ajouté avec succès")
            setShowPaymentForm(false)
            onClose()
        }).catch(() => {
            toast.error("Erreur lors de l'ajout du paiement")
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

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

    const PaymentForm = () => (
        <Dialog 
            open={showPaymentForm} 
            onOpenChange={(open) => {
                // Only allow closing the dialog when not submitting
                // Don't update state if it's already matching the requested state
                if (!isSubmitting && showPaymentForm !== open) {
                    setShowPaymentForm(open);
                }
            }}
        >
            <DialogContent onPointerDownOutside={e => {
                // Prevent closing when clicking outside while typing
                if (isSubmitting) {
                    e.preventDefault();
                }
            }}>
                <DialogHeader>
                    <DialogTitle>Ajouter un paiement</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddPayment)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="payment_method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Méthode de paiement</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une méthode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Espece">Espèce</SelectItem>
                                            <SelectItem value="Carte">Carte bancaire</SelectItem>
                                            <SelectItem value="Cheque">Chèque</SelectItem>
                                            <SelectItem value="Virement">Virement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(Number(e.target.value));
                                                // Make sure form changing doesn't affect dialog state
                                                e.stopPropagation();
                                            }}
                                            placeholder="0.00"
                                            onBlur={field.onBlur} // Make sure to keep this
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Traitement..." : "Enregistrer"}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowPaymentForm(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

    return (
        <Dialog open={open}>
            <DialogContent
                className='max-h-screen overflow-y-scroll [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2'
            >
                <DialogHeader>
                    <DialogTitle className='felx-row flex items-center'>
                        <IconInvoice className='mr-2' />
                        Paiement
                    </DialogTitle>
                </DialogHeader>

                {renderCustomerInfo()}

                <Table className='mb-4 w-full border-collapse'>
                    <TableHeader>
                        <TableCell className='border p-2'>Method</TableCell>
                        <TableCell className='border p-2'>Montant</TableCell>
                    </TableHeader>
                    <TableBody className='text-sm'>
                        <>
                            {cart?.payments?.map((row: Payment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.payment_method || "Especie"}</TableCell>
                                    <TableCell>{FormatPrice(row.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </>
                    </TableBody>
                </Table>

                {renderTotals()}

                {/* Payment form dialog */}
                <PaymentForm />

                <div className='mt-12 flex justify-end gap-2 hidden-print'>
                    <Button
                        variant='default'
                        onClick={() => setShowPaymentForm(true)}
                        disabled={(cart?.rest_a_pay ?? 0) <= 0}
                        className="mr-2"
                    >
                        {(cart?.rest_a_pay ?? 0) > 0 ? "Ajouter un paiement" : "Paiement complet"}
                    </Button>
                    <Button variant='outline' onClick={onClose}>Fermer</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
