import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard"; // adjust path
import { Event } from "../types";

const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Replace this with real endpoint later
        const res = await fetch("/events.json");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No upcoming events</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsSection;
