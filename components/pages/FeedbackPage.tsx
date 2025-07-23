import React, { useState } from 'react'
import CodingBackground from '../CodingBackground'
import usePageTitle from '../usePageTitle'

type FormData = {
  name: string
  email: string
  message: string
  rating?: number
}

const FeedbackPage: React.FC = () => {
  usePageTitle('User Feedback')
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // TODO: swap console.log for real API/Supabase call
      console.log('Feedback submitted:', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('idle')
      alert('Submission failed—please try again.')
    }
  }

  return (
    <div className="relative min-h-[80vh]">
      {/* subtle animated code background */}
      <CodingBackground intensity="low" style="code" className="absolute inset-0" />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-2">
              We Value Your Feedback
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Tell us about your experience, suggestions, or any bugs you’ve spotted.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback
                </label>
                <textarea
                  name="message"
                  placeholder="Your thoughts…"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating (optional)
                </label>
                <select
                  name="rating"
                  value={form.rating ?? ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">— Select —</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 && 's'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition"
              >
                {status === 'sending' ? 'Sending…' : 'Submit Feedback'}
              </button>
            </form>

            {status === 'sent' && (
              <p className="mt-6 text-center text-green-600 dark:text-green-400 font-medium">
                🎉 Thanks for your feedback!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage