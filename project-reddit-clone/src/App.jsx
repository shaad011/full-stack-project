import Header from './components/Header';
import Post from './components/Post';

const MOCK_POSTS = [
  {
    id: 1,
    title: "Just adopted this cute puppy!",
    content: "Meet Max, my new best friend. He's a 3-month-old Golden Retriever!",
    author: "dogLover123",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: "My first attempt at homemade pizza",
    content: "After months of practice, I finally made a pizza that looks decent. What do you think?",
    author: "amateur_chef",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: "Sunrise at Mount Rainier",
    content: "Woke up at 4AM for this shot. Totally worth it!",
    author: "photography_enthusiast",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {MOCK_POSTS.map(post => (
          <Post key={post.id} {...post} />
        ))}
      </main>
    </div>
  );
}

export default App;