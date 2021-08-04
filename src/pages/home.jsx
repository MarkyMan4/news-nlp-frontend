import React, { useEffect, useState } from 'react';
import { getArticleCounts, getTopicList, getArticles } from '../api/newsRequests';
import BasicCard from '../components/basicCard';
import { Link } from 'react-router-dom';

function Home() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [topics, setTopics] = useState([]);
    const [topicArticleCounts, setTopicArticleCounts] = useState([]);
    const [articlesThisWeek, setArticlesThisWeek] = useState([]);
    const [topicCountsThisWeek, setTopicCountsThisWeek] = useState({});

    // format a date as yyyy-mm-dd
    const formatDate = (date) => {
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString(); // note adding one to month because months are 0-indexed
        let day = date.getDate().toString();

        if(month.length === 1)
            month = '0' + month;

        return `${year}-${month}-${day}`;
    }

    // calculate how topic counts for articles
    const calculateTopicCounts = (articles) => {
        let topicCounts = {};

        // initialize counts for each topic to 0
        topics.forEach(topic => topicCounts[topic.topic_name] = 0);
        articles.forEach(article => topicCounts[article.nlp.topic_name] += 1);

        setTopicCountsThisWeek(topicCounts);
    }

    useEffect(() => {
        getArticleCounts()
            .then(res => setTotalArticles(res))
            .catch(err => console.log(err));

        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
    }, []);

    // things that need to be done once topics are populated
    useEffect(() => {
        // get total counts for each topic
        getArticleCountsByTopic()
            .then(res => setTopicArticleCounts(res))
            .catch(err => console.log(err)); 
            
        // get topic counts for articles from the past week
        let date = new Date(Date.now());
        date = new Date(date.setDate(date.getDate() - 7)); // get the date of one week ago
        const formattedDate = formatDate(date);

        getArticles({startDate: formattedDate})
            .then(res => {
                if(!res.error) {
                    setArticlesThisWeek(res);
                    calculateTopicCounts(res);
                }
            })
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
                <hr className="ml-5 mr-5" />
                <h2>Article counts</h2>
                <BasicCard title="Total articles" content={totalArticles} />
                <div className="row w-100" style={cardStyle}>
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
                <hr className="ml-5 mr-5" />
                <h2>Popular topics this week</h2>
                {Object.keys(topicCountsThisWeek).map((topic, indx) => <p key={indx}>{topic} - {topicCountsThisWeek[topic]}</p>)}
            </div>
        </div>
    )
}

export default Home;
