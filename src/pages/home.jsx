import React, { useEffect, useState } from 'react';
import { getArticleCounts, getTopicList } from '../api/newsRequests';
import BasicCard from '../components/basicCard';
import { Link } from 'react-router-dom';

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

    const cardStyle = {
        justifyContent: 'center'
    }

    return (
        <div className="text-center">
            <h1 className="animate__animated animate__flipInX">News NLP</h1>
            <div className="animate__animated animate__fadeIn">
                <h4 className="mb-5">Browse recent news articles and find trends.</h4>
                <Link to="/articles/1">Browse articles</Link><br />
                <Link to={"/article/" + Math.ceil(Math.random() * totalArticles)}>Random article</Link>
                <hr />
                <h2>Article counts</h2>
                <BasicCard title="Total articles" content={totalArticles} />
                <div className="row" style={cardStyle}>
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
        </div>
    )
}

export default Home;
