import { FormatPrice } from "@/utils"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table"
import { OrderPurchase } from "@/interfaces/models/admin"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { IconFileInvoice } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { apiRoutes } from "@/routes/api"
import http from "@/utils/http"

interface DetailOrderProps {
    open: boolean
    onClose: () => void
    cart?: OrderPurchase | null
}

export default function InvoiceBlack({ open, onClose, cart }: DetailOrderProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Initialize product data when cart changes
    useEffect(() => {
        if (cart && cart.details) {
            const initialProducts = cart.details.map((detail: any) => ({
                id: detail.id,
                product_id: detail.id,
                name: detail.name || "Produit inconnu",
                quantity: detail.qte,
                price: detail.price,
                invoice_price: detail?.invoice_price || detail.price, // Default to price if invoice_price is not set
            }));

            setProducts(initialProducts);



            setTotalAmount(cart?.invoice_total ?? 0);
        }
    }, [cart]);



    const handleinvoice_priceChange = (index: number, newinvoice_price: number) => {
        const updatedProducts = [...products];
        updatedProducts[index].invoice_price = newinvoice_price;

        setProducts(updatedProducts);
    };

    const handleTotalChange = (newTotal: number) => {
        setTotalAmount(newTotal);
    };

    const handleSubmit = () => {
        if (!cart) return;

        setIsSubmitting(true);

        // Prepare data for submission
        const updatedDetails = products.map(product => ({
            id: product.id,
            price: product.price,
            invoice_price: product.invoice_price
        }));
        console.log("updatedDetails", updatedDetails)
        // Example API call - replace with your actual endpoint
        http.post(apiRoutes.updateToInvoice + "/" + cart.id, {
            details: updatedDetails,
            total: totalAmount
        })
            .then(() => {
                toast.success("Facture mise à jour avec succès");
                setShowResults(true);
            })
            .catch((error) => {
                toast.error("Erreur lors de la mise à jour de la facture");
                console.error("Error updating invoice:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderCustomerInfo = () => (
        <div className='mb-4 space-y-2 text-sm'>
            {cart?.customer && <span>N°Client : {cart.customer.id}</span>}
            <p>
                Client : {cart?.customer?.first_name + ' ' + cart?.customer?.last_name}
            </p>
            <p>Téléphone : {cart?.customer?.phone}</p>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={(value) => {
            if (!isSubmitting && !value) onClose();
        }}>
            <DialogContent
                className='max-h-screen overflow-y-scroll [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2'
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center'>
                        <IconFileInvoice className='mr-2' />
                        Détails de la facture
                    </DialogTitle>
                </DialogHeader>

                {renderCustomerInfo()}

                {!showResults ? (
                    <>
                        <Table className='mb-4 w-full border-collapse'>
                            <TableHeader>
                                <TableRow>
                                    <TableCell className='border p-2'>Produit</TableCell>
                                    <TableCell className='border p-2'>Quantité</TableCell>
                                    <TableCell className='border p-2'>Prix</TableCell>
                                    <TableCell className='border p-2'>Prix Facture                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='text-sm'>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            <TableCell>{product.price}</TableCell>


                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={product.invoice_price}
                                                onChange={(e) => handleinvoice_priceChange(index, Number(e.target.value))}
                                                className="w-24 text-right"
                                                min={0}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex justify-end items-center space-x-2 mb-4'>
                            <span className='font-semibold'>Total Facture:</span>
                            <Input
                                type="number"
                                value={totalAmount}
                                onChange={(e) => handleTotalChange(Number(e.target.value))}
                                className="w-32 text-right"
                                min={0}
                            />
                        </div>

                        <div className='mt-8 flex justify-end gap-2'>
                            <Button
                                variant='default'
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Traitement..." : "Enregistrer les modifications"}
                            </Button>
                            <Button
                                variant='outline'
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className='font-semibold mb-4'>Résultat des modifications</h3>
                        <Table className='mb-4 w-full border-collapse'>
                            <TableHeader>
                                <TableRow>
                                    <TableCell className='border p-2'>Produit</TableCell>
                                    <TableCell className='border p-2'>Quantité</TableCell>
                                    <TableCell className='border p-2'>Prix</TableCell>
                                    <TableCell className='border p-2'>Prix Facture</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='text-sm'>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{FormatPrice(product.price)}</TableCell>
                                        <TableCell>{FormatPrice(product.invoice_price)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className='flex justify-end items-center space-x-2 mb-4'>
                            <span className='font-semibold'>Total Facture: {FormatPrice(totalAmount)}</span>
                        </div>
                        <div className='mt-8 flex justify-end gap-2'>
                            <Button
                                variant='outline'
                                onClick={onClose}
                            >
                                Fermer
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
