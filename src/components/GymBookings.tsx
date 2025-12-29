import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';

const GymBookings = () => {
    // Currently, bookings are linked to Trainers. 
    // Gym-level bookings will be available in the next update.
    const bookings: any[] = [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Prenotazioni</h2>
                    <p className="text-slate-500">Calendario delle attività e ingressi.</p>
                </div>
                <Button variant="outline" disabled>Vedi Calendario (Presto)</Button>
            </div>

            <div className="space-y-4">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{booking.activity}</h4>
                                        <div className="flex items-center text-sm text-slate-500 gap-3">
                                            <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {booking.user}</span>
                                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {booking.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                        {booking.status === 'confirmed' ? 'Confermata' : 'In Attesa'}
                                    </Badge>
                                    <Button variant="ghost" size="sm">Gestisci</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="bg-yellow-100 p-3 rounded-full mb-4">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-800">Nessuna prenotazione attiva</h3>
                            <p className="text-slate-500 max-w-md mt-2">
                                Al momento questa sezione mostra solo le prenotazioni dirette.
                                La visualizzazione delle prenotazioni per i Trainer della palestra sarà disponibile a breve.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default GymBookings;
