import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DomainSelector from '../components/DomainSelector';
import DocumentUpload from '../components/DocumentUpload';

export default function Dashboard() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleStartChat = (domainId) => {
    navigate(`/chat/${domainId}`);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>RAG Assistant Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <section>
          <h2>Select Domain</h2>
          <DomainSelector
            domains={domains}
            onSelect={setSelectedDomain}
          />
        </section>

        {selectedDomain && (
          <>
            <section>
              <h2>Upload Documents</h2>
              <DocumentUpload domainId={selectedDomain} />
            </section>

            <section>
              <button onClick={() => handleStartChat(selectedDomain)}>
                Start Chat
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}