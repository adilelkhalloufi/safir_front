import { Button } from "@/components/ui/button"
import { webRoutes } from "@/routes/web";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const { t } = useTranslation();
  const navigator = useNavigate();
  return (
    <section className="pt-24 md:pt-32 pb-16 container">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter animate-fade-up">
          {t('website')}  
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] animate-fade-up">
          {t('website.description')}

        </p>
        <p
          className="text-xl text-muted-foreground max-w-[600px] animate-fade-up font-bold">
          {t('website.description2')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
          <Button size="lg" 
          onClick={() => {
            navigator(webRoutes.register)
          }}
          
          >{t('hero.button2')} </Button>
          <Button size="lg" 
          variant="outline"
          onClick={() => {
            navigator(webRoutes.login)
          }}
          >  {t('hero.button1')}</Button>
        </div>
      </div>
    </section>
  )
}