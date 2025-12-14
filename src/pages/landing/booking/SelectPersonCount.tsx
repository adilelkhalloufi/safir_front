import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Users, CheckCircle2, ChevronRight } from 'lucide-react'

interface SelectPersonCountProps {
    count: number
    onSelect: (count: number) => void
    onNext: () => void
    onPrev: () => void
}

export function SelectPersonCount({ count, onSelect, onNext, onPrev }: SelectPersonCountProps) {
    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Nombre de personnes</CardTitle>
                <p className="text-sm text-muted-foreground">Pour combien de personnes souhaitez-vous réserver ?</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((num) => (
                        <button
                            key={num}
                            onClick={() => onSelect(num)}
                            className={cn(
                                'group relative rounded-xl border-2 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                                count === num
                                    ? 'border-[#E09900] bg-gradient-to-br from-orange-50 to-blue-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-[#E09900]/30'
                            )}
                        >
                            <div className={cn(
                                'mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full transition-all',
                                count === num ? 'bg-gradient-to-r from-[#020F44] to-[#E09900]' : 'bg-gray-100 group-hover:bg-orange-100'
                            )}>
                                <Users className={cn('h-8 w-8', count === num ? 'text-white' : 'text-gray-600 group-hover:text-[#E09900]')} />
                            </div>
                            <div className="text-3xl font-bold mb-1">{num}</div>
                            <div className="text-sm text-muted-foreground">
                                {num === 1 ? 'Personne' : 'Personnes'}
                            </div>
                            {count === num && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle2 className="h-6 w-6 text-[#E09900]" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                    <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-[#020F44] to-[#E09900] hover:from-[#020F44]/90 hover:to-[#E09900]/90">
                        Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
