import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestDataButton from '@/components/TestDataButton';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <HeroSection />

      <HowItWorksSection />

      {/* Show test data helper only for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-8">
          <TestDataButton />
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
