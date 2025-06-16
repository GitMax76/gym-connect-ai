
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: {
    first_name: string;
    last_name: string;
  };
}

export const useReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviewsForProfile = async (profileId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id (first_name, last_name)
        `)
        .eq('reviewed_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: {
    reviewed_id: string;
    booking_id?: string;
    rating: number;
    comment?: string;
  }) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          reviewer_id: user.id
        });

      return { error };
    } catch (error: any) {
      console.error('Error creating review:', error);
      return { error };
    }
  };

  const getAverageRating = (profileId: string) => {
    return reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
  };

  return {
    reviews,
    loading,
    fetchReviewsForProfile,
    createReview,
    getAverageRating
  };
};
