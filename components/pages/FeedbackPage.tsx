import React, { useEffect, useState } from 'react';
import FeedbackForm from '../FeedbackForm';
import FeedbackList from '../FeedbackList';
import { Feedback } from '../../types';

function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('feedbacks');
        if (saved) setFeedbacks(JSON.parse(saved));
    }, []);

    const handleNewFeedback = (newFeedback: Feedback) => {
        const updated = [newFeedback, ...feedbacks];
        setFeedbacks(updated);
        localStorage.setItem('feedbacks', JSON.stringify(updated));
    };


    return(
        <div style={{ padding: 20}}>
            <FeedbackForm onSubmit={handleNewFeedback} />
            <FeedbackList feedbacks={feedbacks} />
        </div>
    )
}

export default FeedbackPage;