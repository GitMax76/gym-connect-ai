
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import TestDataButton from '@/components/TestDataButton';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <HeroSection />
      
      {/* Show test data helper only for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-8">
          <TestDataButton />
        </div>
      )}

      {/* Rest of home page content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Come Funziona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Registrati</h3>
              <p className="text-gray-600">
                Crea il tuo profilo scegliendo se sei un utente, trainer o proprietario di palestra
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cerca</h3>
              <p className="text-gray-600">
                Trova trainer e palestre che corrispondono ai tuoi obiettivi e preferenze
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prenota</h3>
              <p className="text-gray-600">
                Prenota le tue sessioni di allenamento e raggiungi i tuoi obiettivi
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
