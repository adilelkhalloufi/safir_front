import { Hero } from "@/components/landing/Hero"
import { Feature } from "@/components/landing/Feature"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Cta } from "@/components/landing/Cta"
import { FAQ } from "@/components/landing/FAQ"
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import { Header } from "@/components/landing/Header"
import Map from "@/components/landing/Map"

import Footer from "@/components/landing/Footer"
import { Benefit } from "@/components/landing/Benefit"
import Pricing from "@/components/landing/Pricing"

const Index = () => {
  useEffect(() => {
    setPageTitle("Optique")
  }, [])
  return (
    <>
      <Header />
      <main>

        <Hero />

        <Map />
        <HowItWorks />
        <Feature />
        <Benefit />
        <Pricing />
        <Cta />
        <FAQ />
      </main>
      <Footer />

    </>



  );
};

export default Index;