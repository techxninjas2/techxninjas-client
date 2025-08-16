export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  image?: string;
  category?: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "AI Revolution in 2025",
    author: "Jane Doe",
    date: "2025-08-01",
    content: "Artificial Intelligence is transforming industries at an unprecedented pace, from healthcare to finance, and beyond.",
    image: "https://picsum.photos/400/250?random=1",
    category: "Technology"
  },
  {
    id: 2,
    title: "The Future of Space Exploration",
    author: "John Smith",
    date: "2025-07-15",
    content: "Private companies and NASA are working together to push human exploration further into the solar system.",
    image: "https://picsum.photos/400/250?random=2",
    category: "Science"
  },
  {
    id: 3,
    title: "Top 10 Healthy Lifestyle Hacks",
    author: "Emily Johnson",
    date: "2025-07-20",
    content: "Staying healthy doesn’t have to be complicated. Here are 10 proven hacks to improve your daily routine.",
    image: "https://picsum.photos/400/250?random=3",
    category: "Health"
  },
  {
    id: 4,
    title: "How to Build Wealth in Your 20s",
    author: "David Lee",
    date: "2025-06-10",
    content: "Smart financial planning early in life can set you up for long-term wealth and freedom.",
    image: "https://picsum.photos/400/250?random=4",
    category: "Finance"
  },
  {
    id: 5,
    title: "The Rise of Electric Vehicles",
    author: "Sophia Brown",
    date: "2025-05-18",
    content: "EVs are not just a trend—they’re the future of sustainable transportation.",
    image: "https://picsum.photos/400/250?random=5",
    category: "Technology"
  },
  {
    id: 6,
    title: "Climate Change and Global Action",
    author: "Michael Green",
    date: "2025-07-01",
    content: "Nations across the globe are uniting to combat climate change with bold policies and green innovations.",
    image: "https://picsum.photos/400/250?random=6",
    category: "Environment"
  },
  {
    id: 7,
    title: "The Art of Minimalist Living",
    author: "Lily Wilson",
    date: "2025-06-28",
    content: "Minimalism is more than decluttering—it's a mindset that leads to a more focused and fulfilling life.",
    image: "https://picsum.photos/400/250?random=7",
    category: "Lifestyle"
  },
  {
    id: 8,
    title: "Top Programming Languages in 2025",
    author: "Chris Martin",
    date: "2025-07-05",
    content: "From Python to Rust, discover the programming languages developers love this year.",
    image: "https://picsum.photos/400/250?random=8",
    category: "Technology"
  },
  {
    id: 9,
    title: "The Psychology of Happiness",
    author: "Hannah Clark",
    date: "2025-07-08",
    content: "Science reveals surprising habits that contribute to long-term happiness.",
    image: "https://picsum.photos/400/250?random=9",
    category: "Health"
  },
  {
    id: 10,
    title: "The Future of Remote Work",
    author: "Daniel White",
    date: "2025-06-30",
    content: "Remote work is here to stay, but how will companies adapt in the next decade?",
    image: "https://picsum.photos/400/250?random=10",
    category: "Business"
  },
  {
    id: 11,
    title: "Breakthroughs in Renewable Energy",
    author: "Olivia Turner",
    date: "2025-07-02",
    content: "Solar, wind, and hydro are becoming more efficient, reducing reliance on fossil fuels.",
    image: "https://picsum.photos/400/250?random=11",
    category: "Science"
  },
  {
    id: 12,
    title: "The Impact of Social Media on Gen Z",
    author: "Jacob Harris",
    date: "2025-07-25",
    content: "Social platforms are shaping how young people interact, learn, and engage with the world.",
    image: "https://picsum.photos/400/250?random=12",
    category: "Culture"
  },
  {
    id: 13,
    title: "Mindfulness and Meditation for Beginners",
    author: "Ella Scott",
    date: "2025-06-22",
    content: "Mindfulness is proven to reduce stress and improve focus. Here’s how to start.",
    image: "https://picsum.photos/400/250?random=13",
    category: "Health"
  },
  {
    id: 14,
    title: "Top Travel Destinations in 2025",
    author: "William Adams",
    date: "2025-06-12",
    content: "From Bali to Iceland, these destinations are must-visits this year.",
    image: "https://picsum.photos/400/250?random=14",
    category: "Travel"
  },
  {
    id: 15,
    title: "The Rise of Indie Gaming",
    author: "Samantha Evans",
    date: "2025-06-08",
    content: "Indie developers are pushing creative boundaries and redefining the gaming industry.",
    image: "https://picsum.photos/400/250?random=15",
    category: "Entertainment"
  },
  {
    id: 16,
    title: "Cybersecurity in the Digital Age",
    author: "James Brown",
    date: "2025-06-03",
    content: "With cyber threats on the rise, protecting data has become more critical than ever.",
    image: "https://picsum.photos/400/250?random=16",
    category: "Technology"
  },
  {
    id: 17,
    title: "The Science of Sleep",
    author: "Charlotte Walker",
    date: "2025-07-11",
    content: "Quality sleep improves memory, focus, and overall health.",
    image: "https://picsum.photos/400/250?random=17",
    category: "Health"
  },
  {
    id: 18,
    title: "The Future of Education: Online Learning",
    author: "Henry Hall",
    date: "2025-07-09",
    content: "Digital learning platforms are reshaping how students access education worldwide.",
    image: "https://picsum.photos/400/250?random=18",
    category: "Education"
  },
  {
    id: 19,
    title: "The Power of Storytelling in Marketing",
    author: "Amelia Allen",
    date: "2025-07-07",
    content: "Brands are leveraging storytelling to connect emotionally with customers.",
    image: "https://picsum.photos/400/250?random=19",
    category: "Business"
  },
  {
    id: 20,
    title: "The Evolution of Smart Homes",
    author: "Benjamin King",
    date: "2025-06-25",
    content: "Smart devices are making homes more efficient, secure, and convenient.",
    image: "https://picsum.photos/400/250?random=20",
    category: "Technology"
  }
];

export default mockArticles;
