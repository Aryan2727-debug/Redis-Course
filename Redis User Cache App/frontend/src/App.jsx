import { useState } from 'react';
import './App.css';

function App () {
  const [users, setUsers] = useState([]);
  const [source, setSource] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      setUsers(data.users);
      setSource(data.source);
      await fetchCount();

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const response = await fetch('http://localhost:3001/count');
      const data = await response.json();
      setRequestCount(data.requestCount);

    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  return (
    <div className="container">

      <h1>Redis Cache Demo</h1>

      <button onClick={fetchUsers}>
        Fetch Users
      </button>

      <h3>
        Data Source:
        {' '}
        {source}
      </h3>

      <h3>
        Requests Served:
        {' '}
        {requestCount}
      </h3>

      {loading && (
        <p>Loading...</p>
      )}

      {
        users.map((user) => (
          <div
              key={user.id}
              className="card"
          >
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.company.name}</p>
          </div>
        ))
      }
    </div>
    );
}

export default App;