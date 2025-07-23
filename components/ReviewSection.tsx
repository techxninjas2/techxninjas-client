import React, { useState, useEffect } from 'react';
import { Star, Edit3, Trash2, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  submitReview, 
  updateReview, 
  getUserReview, 
  getEventReviews, 
  getReviewStats, 
  deleteReview,
  EventReview,
  ReviewStats 
} from '../services/reviewService';

interface ReviewSectionProps {
  eventId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ eventId }) => {
  const { user } = useAuth();
  const [userReview, setUserReview] = useState<EventReview | null>(null);
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    loadReviewData();
  }, [eventId, user]);

  const loadReviewData = async () => {
    try {
      const [statsData, reviewsData] = await Promise.all([
        getReviewStats(eventId),
        getEventReviews(eventId, 10)
      ]);
      
      setStats(statsData);
      setReviews(reviewsData);

      if (user) {
        const userReviewData = await getUserReview(eventId, user.id);
        setUserReview(userReviewData);
        if (userReviewData) {
          setRating(userReviewData.rating);
          setReviewText(userReviewData.review_text || '');
        }
      }
    } catch (error) {
      console.error('Error loading review data:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      if (userReview) {
        const updatedReview = await updateReview(userReview.id, rating, reviewText);
        setUserReview(updatedReview);
      } else {
        const newReview = await submitReview(eventId, rating, reviewText);
        setUserReview(newReview);
      }
      
      setIsEditing(false);
      await loadReviewData();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    if (confirm('Are you sure you want to delete your review?')) {
      try {
        await deleteReview(userReview.id);
        setUserReview(null);
        setRating(0);
        setReviewText('');
        setIsEditing(false);
        await loadReviewData();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoveredStar(star)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star 
            className={`w-5 h-5 ${
              star <= (interactive ? (hoveredStar || rating) : currentRating)
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        </button>
      ))}
    </div>
  );

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <div className="space-y-2 mb-6">
        {[5, 4, 3, 2, 1].map((starCount) => (
          <div key={starCount} className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-2">{starCount}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full" 
                style={{ 
                  width: `${stats.total_reviews > 0 ? ((stats.rating_distribution[starCount] || 0) / stats.total_reviews) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 w-6">
              {stats.rating_distribution[starCount] || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Feedback & Rating</h2>
      
      {stats && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.average_rating.toFixed(1)}
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(Math.round(stats.average_rating))}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {stats.total_reviews} rating{stats.total_reviews !== 1 ? 's' : ''} in total
          </div>
        </div>
      )}

      {renderRatingDistribution()}

      {user ? (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {userReview ? 'Your Review' : 'Write a Review'}
          </h3>
          
          {!isEditing && userReview ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {renderStars(userReview.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(userReview.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {userReview.review_text && (
                <p className="text-gray-700 dark:text-gray-300">{userReview.review_text}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                {renderStars(rating, true)}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this event..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || isSubmitting}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-ninja-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                </button>
                
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (userReview) {
                        setRating(userReview.rating);
                        setReviewText(userReview.review_text || '');
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Please log in to write a review
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.user_profiles?.username || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{review.review_text}</p>
                )}
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({review.helpful_count})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;