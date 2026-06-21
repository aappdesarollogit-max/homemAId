import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import DashboardPreview from "../components/DashboardPreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="flex flex-col items-center px-6 py-12">
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
      </div>
    </main>
  );
}