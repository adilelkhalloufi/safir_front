import { useTranslation } from "react-i18next";

export function HowItWorks() {
  interface statsProps {
    quantity: string;
    description: string;
  }
  const { t } = useTranslation()
  const stats: statsProps[] = [
    {
      quantity: "10",
      description: t('number.title1'),
    },
    {
      quantity: "8",
      description: t('number.title2'),
    },
    {
      quantity: "3",
      description: t('number.title3'),
    },
    {
      quantity: "2",
      description: t('number.title4'),

    },
  ];

  return (
    <section id="how-it-works" className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('about.title')}</h2>
        < p className="text-muted-foreground  mx-auto" >
          {t('about.description')}
        </p>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        {stats.map((step, i) => (
          <div
            key={i}
            className="relative animate-fade-up flex justify-center flex-col items-center"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-4xl font-bold text-primary/20 mb-4">{step.quantity}</div>
            <h3 className="text-xl font-semibold mb-2">{step.description}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}