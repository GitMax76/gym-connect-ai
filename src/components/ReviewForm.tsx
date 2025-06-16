
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  reviewedId: string;
  bookingId?: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ reviewedId, bookingId, onSuccess }: ReviewFormProps) => {
  const { createReview } = useReviews();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Seleziona una valutazione');
      return;
    }

    setLoading(true);

    try {
      const { error } = await createReview({
        reviewed_id: reviewedId,
        booking_id: bookingId,
        rating,
        comment: comment.trim() || undefined
      });

      if (error) {
        toast.error('Errore durante l\'invio della recensione');
      } else {
        toast.success('Recensione inviata con successo!');
        setRating(0);
        setComment('');
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Errore durante l\'invio della recensione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Valutazione</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Commento (opzionale)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Descrivi la tua esperienza..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0} className="w-full">
        {loading ? 'Invio in corso...' : 'Invia Recensione'}
      </Button>
    </form>
  );
};

export default ReviewForm;
