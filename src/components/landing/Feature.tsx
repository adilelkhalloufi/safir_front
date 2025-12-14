import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBuildingStore, IconCalendar, IconInvoice, IconReport, IconSettings } from "@tabler/icons-react";
import {  MapIcon } from "lucide-react"
import { useTranslation } from "react-i18next"


interface FeatureProps {
  icon: JSX.Element;
  title?: string;
  description?: string;
}


export function Feature() {
  const { t } = useTranslation()
  const features: FeatureProps[] = [
    {
      icon: <IconBuildingStore />,
      title: t('feature.title1'),
      description: t('feature.description1')

    },
    {
      icon: <MapIcon />,
      title: t('feature.title2'),
      description: t('feature.description2')
    },
    {
      icon: <IconInvoice />,
      title: t('feature.title3'),
      description: t('feature.description3')
    },
    {
      icon: <IconCalendar />,
      title: t('feature.title4'),
      description: t('feature.description4')
    },
    {
      icon: <IconSettings />,
      title: t('feature.title5'),
      description: t('feature.description5')
    },
    {
      icon: <IconReport />,
      title: t('feature.title6'),
      description: t('feature.description6')
    },

  ];
  return (
    <section id="features" className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">     {t('feature.title')}</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">

        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Card key={i} className="animate-fade-up" style={{
            animationDelay: `${i * 100}ms`
          }}>
            <CardHeader>
              {/* <feature.icon className="w-10 h-10 text-primary mb-4" /> */}
              {feature.icon}
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}