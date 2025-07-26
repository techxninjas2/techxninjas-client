import React from 'react';
import { Feedback } from '../types';

interface Props {
    feedbacks: Feedback[];
}

const FeedbackList: React.FC<Props> = ({ feedbacks }) => {
    return (
        <div className="mt-10 px-4 max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-brand-primary mb-8">
                Our Results
            </h2>

            {feedbacks.length === 0 ? (
                <p className="text-center">No Results yet!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((fb) => (
                        fb && (
                            <div
                                key={fb.id}
                                className="border border-gray-300 p-5 rounded-lg shadow hover:shadow-lg transition duration-300 bg-white"
                            >
                                <p className="font-semibold">
                                    <span className="text-gray-600">Username:</span> {fb.name}
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium text-gray-600">Message:</span> {fb.message}
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium text-gray-600">Rating:</span> {fb.rating}
                                </p>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
