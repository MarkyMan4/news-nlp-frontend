import React, { useEffect, useState } from 'react';
import { getArticleCounts } from '../api/newsRequests';

function Home() {
    const [totalArticles, setTotalArticles] = useState(0);

    useEffect(() => {
        getArticleCounts()
            .then(res => setTotalArticles(res))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>There are {totalArticles} total articles</h1>
        </div>
    )
}

export default Home;
