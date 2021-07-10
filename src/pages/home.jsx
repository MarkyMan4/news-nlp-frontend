import React, { useEffect, useState } from 'react';
import { getArticleCounts, getTopicList } from '../api/newsRequests';
import BasicCard from '../components/basicCard';

function Home() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [topics, setTopics] = useState([]);
    const [topicArticleCounts, setTopicArticleCounts] = useState([]);

    useEffect(() => {
        getArticleCounts()
            .then(res => setTotalArticles(res))
            .catch(err => console.log(err));

        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
    }, []);

    // get counts for each topic when value for topics state changes
    useEffect(() => {
        getArticleCountsByTopic()
            .then(res => setTopicArticleCounts(res))
            .catch(err => console.log(err));   
    }, [topics]);

    // async function to get article counts for each topic
    // this way the useEffect can wait for all counts to be retrieved and then set the state
    const getArticleCountsByTopic = async () => {
        let topicCounts = [];

        for(let i = 0; i < topics.length; i++) {
            const count = await getArticleCounts(topics[i].topic_id);
            topicCounts.push({'topic': topics[i].topic_name, 'count': count});
        }

        return topicCounts;
    }

    return (
        <div className="text-center">
            <BasicCard title="Total articles" content={totalArticles} />
            <h1>Article counts by topic</h1>
            <hr />
            <div className="row">
                {topicArticleCounts.map((topic, indx) => {
                    return (
                        <BasicCard 
                            key={indx} 
                            title={topic.topic}
                            content={topic.count}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Home;
