import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    male: {
        label: "Homme",
        color: "hsl(var(--chart-1))",
    },
    Female: {
        label: "Femme",
        color: "hsl(var(--chart-2))",
    },
    Unknown: {
        label: "Inconnu",
        color: "hsl(var(--chart-3))",
    },

} satisfies ChartConfig

export function GenderOrder({ chartData }: any) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Répartition par Genre</CardTitle>
                <CardDescription>Commandes {new Date().getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={chartData} dataKey="visitors" nameKey="browser" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {/* <div className="flex items-center gap-2 font-medium leading-none">
                    Tendance à la hausse de 5.2% ce mois <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Affichage du total des commandes par genre pour cette année
                </div> */}
            </CardFooter>
        </Card>
    )
}
