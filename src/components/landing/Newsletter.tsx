import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next";

export function Newsletter() {
 
  const { t } = useTranslation();
  return (
    <section className="py-16 container">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{t('newsletter.title')}</h2>
        <p className="text-muted-foreground mb-8">
          {t('newsletter.description')}
        </p>
        <form className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="info@khordaad.com"
            className="flex-1"
          />
          <Button type="submit">{t('button.subscribe')}</Button>
        </form>
      </div>
    </section>
  )
}