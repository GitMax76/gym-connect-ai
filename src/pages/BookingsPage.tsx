
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingsList from '@/components/BookingsList';
import { Calendar, Clock, User } from 'lucide-react';

const BookingsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Le Mie Prenotazioni
            </h1>
            <p className="text-gray-600">
              Gestisci le tue sessioni di allenamento
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tutte</TabsTrigger>
              <TabsTrigger value="pending">In attesa</TabsTrigger>
              <TabsTrigger value="confirmed">Confermate</TabsTrigger>
              <TabsTrigger value="completed">Completate</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <BookingsList filterStatus="all" />
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <BookingsList filterStatus="pending" />
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-6">
              <BookingsList filterStatus="confirmed" />
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <BookingsList filterStatus="completed" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default BookingsPage;
