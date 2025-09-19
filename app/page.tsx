import Browser from "@/components/Browser";
import CuratedArts from "@/components/CuratedArts";
import FeaturedArts from "@/components/FeaturedArts";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HiddenGems from "@/components/HiddenGems";
import Navbar from "@/components/Navbar";
import TrendingArtists from "@/components/TrendingArtists";
import TrendingAuctions from "@/components/TrendingAuctions";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <TrendingAuctions />
      <Browser />
      <FeaturedArts />
      <HiddenGems />
      <CuratedArts />
      <TrendingArtists />
      <Footer />
    </div>
  );
}
