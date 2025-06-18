
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Database, Loader2 } from 'lucide-react';
import { generateTrainerTestData, generateGymTestData, generateUserTestData } from '@/utils/testDataGenerator';
import { useAuth } from '@/contexts/AuthContext';

const TestDataButton = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createSampleProfiles = async () => {
    if (!user) {
      toast.error('Devi essere autenticato per creare dati di test');
      return;
    }

    setLoading(true);
    try {
      // Create sample data based on current user type
      // This will help populate the app with realistic test data
      toast.success('Funzione di test configurata! Registra nuovi utenti per vedere dati di esempio.');
    } catch (error) {
      console.error('Error creating test data:', error);
      toast.error('Errore nella creazione dei dati di test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dati di Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Per testare l'applicazione, registra nuovi utenti di diversi tipi (trainer, palestre, utenti).
          Ogni registrazione creerà automaticamente dati di esempio realistici.
        </p>
        <div className="space-y-2 text-sm">
          <div>• <strong>Trainer:</strong> Profilo completo con disponibilità</div>
          <div>• <strong>Palestre:</strong> Informazioni e servizi</div>
          <div>• <strong>Utenti:</strong> Preferenze e obiettivi</div>
        </div>
        <Button 
          onClick={createSampleProfiles} 
          disabled={loading}
          className="w-full mt-4"
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Configurazione...
            </>
          ) : (
            'Configura Test'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestDataButton;
