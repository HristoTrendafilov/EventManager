import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

export function Home() {
  useEffect(() => {
    document.title = 'Събития | Начало';
  }, []);

  return (
    <div
      style={{ height: '1000px', backgroundColor: 'green' }}
      className="home-wrapper"
    >
      xaxa
      <button type="button" className="btn btn-warning">
        2xaax
      </button>
      <Link to="/login">Вход2</Link>
    </div>
  );
}
