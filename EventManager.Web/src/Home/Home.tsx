import { useCallback, useEffect } from 'react';

import { getRegions } from '~Infrastructure/api-requests';

import './Home.css';

export function Home() {
  useEffect(() => {
    document.title = 'Събития | Начало';
  }, []);

  const fetchData = useCallback(async () => {
    const regions = await getRegions();
    /* eslint-disable no-console */
    console.log(regions);
    /* eslint-enable no-console */
  }, []);

  return (
    <div
      style={{ height: '1000px', backgroundColor: 'green' }}
      className="home-wrapper"
    >
      <button onClick={fetchData} type="button" className="btn btn-warning">
        2xaax
      </button>
    </div>
  );
}
