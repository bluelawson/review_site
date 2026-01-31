'use client';
import AccessPanel from '@/components/AccessPanel';
import CTASection from '@/components/CTASection';
import Hero from '@/components/Hero';
import TopRatedReviewList from '@/components/TopRatedReviewList';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <AccessPanel />
      <TopRatedReviewList />
      <CTASection />
    </div>
  );
}
