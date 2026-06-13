
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingsList from '@/components/BookingsList';
import { useLanguage } from '@/contexts/LanguageContext';

const BookingsPage = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('bookings.title')}
            </h1>
            <p className="text-gray-600">
              {t('bookings.subtitle')}
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/80 p-1 rounded-lg border">
              <TabsTrigger value="all" className="data-[state=active]:text-indigo-700 data-[state=active]:bg-white">{t('bookings.tabs.all')}</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:text-indigo-700 data-[state=active]:bg-white">{t('bookings.tabs.pending')}</TabsTrigger>
              <TabsTrigger value="confirmed" className="data-[state=active]:text-indigo-700 data-[state=active]:bg-white">{t('bookings.tabs.confirmed')}</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:text-indigo-700 data-[state=active]:bg-white">{t('bookings.tabs.completed')}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              <BookingsList filterStatus="all" />
            </TabsContent>

            <TabsContent value="pending" className="space-y-6 mt-6">
              <BookingsList filterStatus="pending" />
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-6 mt-6">
              <BookingsList filterStatus="confirmed" />
            </TabsContent>

            <TabsContent value="completed" className="space-y-6 mt-6">
              <BookingsList filterStatus="completed" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BookingsPage;
