
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useReviews } from '@/hooks/useReviews';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface ReviewsListProps {
  profileId: string;
}

const ReviewsList = ({ profileId }: ReviewsListProps) => {
  const { reviews, loading, fetchReviewsForProfile, getAverageRating } = useReviews();

  useEffect(() => {
    fetchReviewsForProfile(profileId);
  }, [profileId]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento recensioni...</div>;
  }

  const averageRating = getAverageRating(profileId);

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating))}
              <div className="text-sm text-gray-500">
                ({reviews.length} recensioni)
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nessuna recensione disponibile</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">
                      {review.reviewer?.first_name} {review.reviewer?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: it })}
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
