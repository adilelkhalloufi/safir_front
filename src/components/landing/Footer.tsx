 import { Button } from "@/components/ui/button"
  
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {  Linkedin } from "lucide-react"
import { useTranslation } from "react-i18next"
 import { ScrollToTop } from "./ScrollToTop"
import logo from '../../assets/favicon.png';

export default function Footer() {
  const { t } = useTranslation()

  const routeList = [
    {
      href: '#benefits',
       label: t("menu2"),
    },
    {
      href: '#features',
       label: t("menu1"),
    },
  
    {
      href: '#pricing',
       label: t("menu3"),
    },
    {
      href: "#contact",
      label: t("menu4"),
     },

   
  ];


  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative ">
            <div className="flex items-center">

            <img src={logo} alt="OpticFlow Logo" width={50}  />

            <h2 className="mb-4 text-3xl font-bold tracking-tight">{t('website')}</h2>
            </div>
            <p className="mb-6 text-muted-foreground">
              {t('website.description')}
            </p>
        
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              {routeList.map((route) => (
                   <a href="#" className="block transition-colors hover:text-primary">
                   {route.label}
                 </a>
                 
              ))}


           
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>+212612704187</p>
             
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
            
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
           
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 OpticFlow. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
      <ScrollToTop/>
 
    </footer>
  )
}