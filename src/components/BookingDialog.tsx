import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookingForm from './BookingForm';

interface BookingDialogProps {
    trainerId: string;
    trainerName: string;
}

const BookingDialog = ({ trainerId, trainerName }: BookingDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                    Prenota Sessione
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Prenota Sessione con {trainerName}</DialogTitle>
                </DialogHeader>
                <BookingForm
                    trainerId={trainerId}
                    trainerName={trainerName}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
};

export default BookingDialog;
