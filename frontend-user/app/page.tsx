"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Films from "@/components/films"
import WhyCome from "@/components/why-come"
import Pricing from "@/components/pricing"
import Atmosphere from "@/components/atmosphere"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"
import SpecialEditionPopup from "@/components/special-edition-popup"

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <SpecialEditionPopup />
      <Header />

      <section className="flex-1">
        <Hero />
        {/* Films avant "Pourquoi venir" pour mettre en avant les stars en premier */}
        <Films />
        <WhyCome />
        <Pricing />
        <Atmosphere />
        <Testimonials />
      </section>

      <Footer />
    </main>
  )
}
