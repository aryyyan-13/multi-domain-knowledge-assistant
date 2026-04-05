import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';

export default function Chat() {
  const { domainId } = useParams();
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleSendQuery = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/chat/query',
        { query, domainId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([
        ...messages,
        {
          type: 'user',
          content: query,
        },
        {
          type: 'assistant',
          content: response.data.response,
          sources: response.data.sources,
          confidence: response.data.confidenceScore,
        },
      ]);
    } catch (error) {
      alert('Failed to process query');
    }
  };

  return (
    <div className="chat-page">
      <header>
        <button onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>Assistant Chat - Domain {domainId}</h1>
      </header>
      <ChatInterface messages={messages} onSendQuery={handleSendQuery} />
    </div>
  );
}