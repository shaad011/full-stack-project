import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function Post({ title, content, author, timestamp }) {
  const [votes, setVotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleUpvote = () => setVotes(votes + 1);
  const handleDownvote = () => setVotes(votes - 1);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments([
      ...comments,
      { text: newComment, author: 'Current User', timestamp: new Date() }
    ]);
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex">
        {/* Voting */}
        <div className="flex flex-col items-center mr-4">
          <button onClick={handleUpvote} className="text-gray-500 hover:text-orange-500">
            <ArrowUpIcon className="h-6 w-6" />
          </button>
          <span className={`text-sm font-bold ${votes > 0 ? 'text-orange-500' : votes < 0 ? 'text-blue-500' : 'text-gray-500'}`}>
            {votes}
          </span>
          <button onClick={handleDownvote} className="text-gray-500 hover:text-blue-500">
            <ArrowDownIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Post Content */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-2">{content}</p>
          <div className="text-sm text-gray-500">
            Posted by {author} • {formatDistanceToNow(timestamp)} ago
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <div className="flex items-center text-gray-500 mb-4">
              <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
              <span>{comments.length} Comments</span>
            </div>

            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What are your thoughts?"
                rows="3"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <div className="text-sm text-gray-500">
                    {comment.author} • {formatDistanceToNow(comment.timestamp)} ago
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}