import { IconBrandWhatsapp } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export function Cta() {
  const { t } = useTranslation()

  return (
    <section className="py-16 container scroll-smooth" id="contact">
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4"> {t('contact.title')}</h2>

        <div className="flex gap-4 justify-center">
          {/* when click on whatsuapp button open conversation on this number +212612704187 with message i want ask you about pricing */}
          <Link
            about="_blank"
            className="bg-primary p-3 text-secondary rounded-sm flex items-center gap-2"
            to="https://wa.me/212612704187?text=i%20want%20ask%20you%20about%20pricing"
          >
            <IconBrandWhatsapp />
            {t('button.whatsup')}
          </Link>

        </div>

      </div>
    </section>
  )
}