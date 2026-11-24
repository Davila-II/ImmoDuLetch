import EstimationSection from '../components/home/EstimationSection';
import HeroSearch from '../components/home/HeroSearch';
import PropertyTypes from '../components/home/PropertyTypes';
import RecentProperties from '../components/home/RecentProperties';
import HeroBannerCarousel from '../components/HeroBannerCarousel';
import { useScrollToHash } from '../hooks/useScrollToHash';

export default function HomePage() {
  useScrollToHash();

  return (
    <div className="space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroBannerCarousel />
      </section>

      <HeroSearch />
      <PropertyTypes />
      <RecentProperties />
      <EstimationSection />
    </div>
  );
}