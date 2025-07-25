import React, { useState } from 'react';
import { Feedback, Rating } from "../types";
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSubmit: (feedback: Feedback) => void;
}

const FeedbackForm: React.FC<Props> = ({ onSubmit }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
        rating: Rating.RateUs,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const feedback: Feedback = {
            ...form,
            id: uuidv4(),
            rating: form.rating as Rating,
        };

        onSubmit(feedback);
        setForm({ name: '', email: '', message: '', rating: Rating.RateUs });
        console.log("onSubmit is", onSubmit);
        alert('Thank you for your feedback!');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md max-w-md w-full mx-auto mt-10 mb-10"
        >
            <h2 className="text-3xl font-extrabold text-center text-brand-primary mb-6">
                Rate Our Community
            </h2>

            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Give your Feedback"
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
                {Object.values(Rating).map((rate) => (
                    <option key={rate} value={rate}>
                        {rate}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                className="w-full bg-brand-primary text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
            >
                Submit
            </button>
        </form>

    );
};

export default FeedbackForm;
