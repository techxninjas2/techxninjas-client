
import React, { useState, useCallback, useMemo } from 'react';
import { generateTechFact } from '../services/geminiService';
import { SparklesIcon } from './icons';
import techFacts from "./localTechFacts.json";
const TechFactGenerator: React.FC = () => {
  const [fact, setFact] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const localTechFacts = useMemo(() => techFacts.facts, []);
  const fetchFact = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const getLocalFact = ()=> {
      const randomIndex = Math.floor(Math.random()*localTechFacts.length);
      return localTechFacts[randomIndex];
  }
    try {
      // Ensure API_KEY is handled by the environment as per guidelines
      // The service will use process.env.API_KEY
      if (!process.env.API_KEY){
        console.warn("API_KEY environment variable is not set. Gemini API calls will likely fail.");
        // To make it clear in UI, if not set.    
        setFact(getLocalFact());
        setIsLoading(false);
        return;
      }
      const newFact = await generateTechFact();
      setFact(newFact);
    } catch (err: any) {
      console.error(err.message || "Could not fetch a tech fact at this time. Please try again later.");
      setError("Unable to fetch from Gemini API, showing a local tech fact instead");
      setFact(getLocalFact());
    } finally {
      setIsLoading(false);
    }
  }, [localTechFacts]);

  return (
    <div className="p-6 md:p-8 rounded-lg text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-text dark:text-dark-text">
        <SparklesIcon className="w-8 h-8 inline-block mr-2 text-ninja-gold" />
        Get a Quick Tech Fact!
      </h2>
      <button
        onClick={fetchFact}
        disabled={isLoading}
        className="bg-brand-primary hover:bg-ninja-gold text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? 'Loading...' : fact ? 'Discover another Fact':'Discover Fact'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {fact  && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md ">
          <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed">{fact}</p>
        </div>
      )}
      
      {!fact && !isLoading && !error && (
         <p className="text-gray-500 dark:text-gray-400">Click the button to get a fascinating tech fact!</p>
      )}
    </div>
  );
};

export default TechFactGenerator;
