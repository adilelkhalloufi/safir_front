import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowUp, IconEaseIn, IconMoneybag, IconPaint } from "@tabler/icons-react";
import { useTranslation } from "react-i18next"


interface FeatureProps {
  icon: JSX.Element;
  title?: string;
  description?: string;
}


export function Benefit() {
  const { t } = useTranslation()
  const data: FeatureProps[] = [
    {
      icon: <IconArrowUp />,
      title: t('benfit.title1'),
      description: t('benfit.description1')

    },
    {
      icon: <IconEaseIn />,
      title: t('benfit.title2'),
      description: t('benfit.description2')
    },
    {
      icon: <IconMoneybag />,
      title: t('benfit.title3'),
      description: t('benfit.description3')
    },
    {
      icon: <IconPaint />,
      title: t('benfit.title4'),
      description: t('benfit.description4')
    },



  ];
  return (
    <section id="benefits" className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">     {t('benfit.title')}</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">

        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((item, i) => (
          <Card key={i} className="animate-fade-up" style={{
            animationDelay: `${i * 100}ms`
          }}>
            <CardHeader>
              {/* <benfit.icon className="w-10 h-10 text-primary mb-4" /> */}
              {item.icon}
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}