/**
 * Utility functions to generate structured data for SEO
 * These functions create JSON-LD schema markup for different content types
 */

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechXNinjas",
    "url": "https://techxninjas.com",
    "logo": "https://techxninjas.com/icons/icon-512x512.png",
    "sameAs": [
      "https://www.youtube.com/@techxninjas",
      "https://www.linkedin.com/company/techxninjas",
      "https://www.instagram.com/cipherschools",
      "https://t.me/thetechxninjas"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-91229-85472",
      "contactType": "customer service",
      "email": "thetechxninjas@gmail.com",
      "availableLanguage": "English"
    },
    "description": "Your gateway to hackathons, tech challenges, inspiring speakers, and innovation. We empower tech enthusiasts across India."
  };
};

export const generateEventSchema = (event: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": event.start_date,
    "endDate": event.end_date || event.start_date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.mode === "online" 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : event.mode === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    "location": event.mode === "online" 
      ? {
          "@type": "VirtualLocation",
          "url": `https://techxninjas.com/events/${event.slug}`
        }
      : {
          "@type": "Place",
          "name": event.location || "TBD",
          "address": event.location || "TBD"
        },
    "image": event.image_url || `https://techxninjas.com/images/events/${event.slug}.jpg`,
    "description": event.description,
    "offers": {
      "@type": "Offer",
      "url": `https://techxninjas.com/events/${event.slug}`,
      "price": event.event_fee || "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": event.registration_start_date
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer_name || "TechXNinjas",
      "url": "https://techxninjas.com"
    }
  };
};

export const generateArticleSchema = (article: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": article.featured_image || `https://techxninjas.com/images/articles/${article.slug}.jpg`,
    "author": {
      "@type": "Person",
      "name": article.author_name
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechXNinjas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://techxninjas.com/icons/icon-512x512.png"
      }
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at,
    "description": article.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://techxninjas.com/articles/${article.slug}`
    }
  };
};

export const generateCourseSchema = (course: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "TechXNinjas",
      "sameAs": "https://techxninjas.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `${Math.ceil(course.total_duration_minutes / 60)} hours total`,
      "educationalCredentialAwarded": course.certificate_available ? "Certificate of Completion" : null,
      "instructor": {
        "@type": "Person",
        "name": course.creator?.creator_name || "TechXNinjas Instructor"
      }
    }
  };
};

export const generateProfileSchema = (profile: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.i_am_a?.value || profile.username,
    "description": profile.about_me,
    "url": `https://techxninjas.com/profile/${profile.username}`,
    "affiliation": profile.college_name,
    "knowsAbout": profile.skills?.map((skill: any) => skill.skill_name) || [],
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": profile.location_city_town,
        "addressRegion": profile.location_state,
        "addressCountry": profile.location_country
      }
    }
  };
};

export const generateFAQSchema = (faqs: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};