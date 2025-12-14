import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslation } from "react-i18next"
// 5 question people should ask about saas how manage optcien store 
const faqs = [
  {
    question : "Comment démarrer avec OpticFlow ?",
    answer : "Pour démarrer avec OpticFlow, il vous suffit de vous inscrire sur notre plateforme. Une fois inscrit, vous pouvez commencer à ajouter vos produits, gérer vos stocks et vos ventes. Vous pouvez également personnaliser votre boutique en ligne et commencer à vendre vos produits."
  },
  {
    question : "Quels sont les avantages d'OpticFlow ?",
    answer : "OpticFlow est une solution de commerce électronique tout-en-un qui vous permet de gérer votre boutique en ligne de manière efficace. Vous pouvez gérer vos produits, vos stocks, vos ventes et vos clients en un seul endroit. OpticFlow vous permet également de personnaliser votre boutique en ligne pour qu'elle corresponde à votre marque. Avec OpticFlow, vous pouvez vendre vos produits en ligne de manière efficace et rentable."
  },
  {
    question : "Comment OpticFlow peut-il m'aider à développer mon entreprise ?",
    answer : "OpticFlow est une solution de commerce électronique tout-en-un qui vous permet de gérer votre boutique en ligne de manière efficace. Vous pouvez gérer vos produits, vos stocks, vos ventes et vos clients en un seul endroit. OpticFlow vous permet également de personnaliser votre boutique en ligne pour qu'elle corresponde à votre marque. Avec OpticFlow, vous pouvez vendre vos produits en ligne de manière efficace et rentable."
  },
  {
    question : "Comment puis-je personnaliser ma boutique en ligne avec OpticFlow ?",
    answer : "Avec OpticFlow, vous pouvez personnaliser votre boutique en ligne pour qu'elle corresponde à votre marque. Vous pouvez choisir parmi une variété de thèmes et de modèles prédéfinis, ou créer votre propre design personnalisé. Vous pouvez également personnaliser les couleurs, les polices et les images de votre boutique en ligne pour qu'elle corresponde à votre marque. Avec OpticFlow, vous pouvez créer une boutique en ligne unique et professionnelle qui vous aidera à attirer des clients et à développer votre entreprise."
  },
  {
    question : "Comment puis-je vendre mes produits en ligne avec OpticFlow ?",
    answer : "Avec OpticFlow, vous pouvez vendre vos produits en ligne de manière efficace et rentable. Vous pouvez ajouter vos produits à votre boutique en ligne, définir les prix et les descriptions, et gérer vos stocks. Vous pouvez également personnaliser votre boutique en ligne pour qu'elle corresponde à votre marque. Avec OpticFlow, vous pouvez vendre vos produits en ligne de manière professionnelle et attirer des clients potentiels."
 
  }
]

export function FAQ() {
  const { t } = useTranslation()
  return (
    <section id="faq" className="py-16 container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('faq.title')}</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          {t('faq.description')}
        </p>
      </div>
      <div className="max-w-[800px] mx-auto">
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}