import { useState } from 'react';

export default function ChatInterface({ messages, onSendQuery }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendQuery(input);
      setInput('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.type}`}>
            <p>{msg.content}</p>
            {msg.sources && (
              <div className="sources">
                <strong>Sources:</strong>
                {msg.sources.map((src, i) => (
                  <div key={i}>
                    {src.title} (Similarity: {(src.similarity * 100).toFixed(2)}%)
                  </div>
                ))}
              </div>
            )}
            {msg.confidence !== undefined && (
              <div className="confidence">
                Confidence: {(msg.confidence * 100).toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={input.length === 0}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}