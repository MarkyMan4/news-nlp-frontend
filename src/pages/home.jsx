import React, { useEffect, useState } from 'react';
import { getArticleCounts, getArticleCountsByTopic, getTopicList, getArticles } from '../api/newsRequests';
import BasicCard from '../components/basicCard';
import NlpModal from '../components/nlpModal';
import { Link } from 'react-router-dom';

function Home() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [topics, setTopics] = useState([]);
    const [topicArticleCounts, setTopicArticleCounts] = useState({});
    const [articlesThisWeek, setArticlesThisWeek] = useState([]);
    const [articlesThisWeekGrouped, setArticlesThisWeekGrouped] = useState({}); // articles this week grouped by topic. this is a object where each key contains a list of articles for certain topic
    const [topicCountsThisWeek, setTopicCountsThisWeek] = useState({});

    useEffect(() => {
        // get the total number of articles in the database
        getArticleCounts()
            .then(res => setTotalArticles(res))
            .catch(err => console.log(err));

        // get the list of topics
        getTopicList()
            .then(res => setTopics(res))
            .catch(err => console.log(err));
        
        // get total counts for each topic
        getArticleCountsByTopic()
            .then(res => setTopicArticleCounts(res))
            .catch(err => console.log(err)); 
    }, []);

    // things that need to be done once topics are populated
    useEffect(() => {
        // get topic counts for articles from the past week
        let date = new Date(Date.now());
        date = new Date(date.setDate(date.getDate() - 7)); // get the date of one week ago
        const formattedDate = formatDate(date);

        getArticles({startDate: formattedDate})
            .then(res => {
                if(!res.error) {
                    setArticlesThisWeek(res);
                    calculateTopicCounts(res);
                    setArticlesThisWeekGrouped(groupArticlesByTopic(res));
                }
            })
            .catch(err => console.log(err));
    }, [topics]);

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
        articles.forEach(article => topicCounts[article.nlp.topic_name] += 1); // this calculates the count for each topic

        // order the topics by count (descending order)
        // TODO: find a better way to do this, this is pretty messy
        let orderedCounts = {};
        
        const keys = Object.keys(topicCounts);
        const values = Object.values(topicCounts);

        let orderedIndices = [];

        while(orderedIndices.length < values.length) {
            let maxIndex = 0;

            // set max index to the first unused index
            for(let i = 0; i < values.length; i++) {
                if(!orderedIndices.includes(i))
                    maxIndex = i;
            }

            for(let i = 0; i < values.length; i++) {
                if(values[i] > values[maxIndex] && !orderedIndices.includes(i)) {
                    maxIndex = i;
                }
            }

            orderedIndices.push(maxIndex);
        }

        orderedIndices.forEach(indx => orderedCounts[keys[indx]] = values[indx]);

        setTopicCountsThisWeek(orderedCounts);
    }

    const groupArticlesByTopic = (articles) => {
        let grouped = {};

        articles.forEach(article => {
            let topic = article.nlp.topic_name;
            // if there is already a group for the topic, add it to that list
            if(topic in grouped)
                grouped[topic].push(article);
            else // otherwise create a new group with a single article
                grouped[topic] = [article];
        });

        return grouped;
    }

    const cardStyle = {
        justifyContent: 'center'
    }

    const tableStyle = {
        borderRadius: '20px'
    }

    return (
        <div className="text-center">
            <h1 className="animate__animated animate__flipInX">News NLP</h1>
            <div className="animate__animated animate__fadeIn">
                <h4 className="mb-5">Browse recent news articles and find trends.</h4>
                <Link to="/articles/1" className="btn btn-outline-success">Browse articles</Link><br />
                <Link to={"/article/" + Math.ceil(Math.random() * totalArticles)} className="btn btn-outline-success mt-3">Random article</Link>
                <hr className="ml-5 mr-5" />
                <h2>Article counts</h2>
                <BasicCard title="Total articles" content={totalArticles} />
                <div className="row w-100" style={cardStyle}>
                    {Object.keys(topicArticleCounts).map((topic, indx) => {
                        return (
                            <BasicCard 
                                key={indx} 
                                title={topic}
                                content={topicArticleCounts[topic]}
                            />
                        )
                    })}
                </div>
                <hr className="ml-5 mr-5 mb-5" />
                {Object.keys(topicCountsThisWeek).length > 0 && Object.keys(articlesThisWeekGrouped).length > 0 ?
                    <div className="animate__animated animate__fadeIn">
                        <h2>Number of articles by topic - this week</h2>
                        <div className="row w-100">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <table className="table table-striped mb-5 shadow" style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th>Topic</th>
                                            <th>No. Articles</th>
                                            <th>Topic Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(topicCountsThisWeek).map((topic, indx) => (
                                                <tr key={indx}>
                                                    <td>{topic}</td>
                                                    <td>{topicCountsThisWeek[topic]}</td>
                                                    <td><NlpModal buttonText={`${topic} details`} topicName={topic} articles={articlesThisWeekGrouped[topic]} /></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                : <div></div>
            }
            </div>
        </div>
    )
}

export default Home;
