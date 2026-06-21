import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <Hero />
      <Features />
      <HowItWorks/>
    </main>
  );
}