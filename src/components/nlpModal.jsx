import { useEffect, useState } from 'react';
import BasicCard from '../components/basicCard';
import { TagCloud } from 'react-tagcloud';
import { Link } from 'react-router-dom';

/*
    The NlpModal component contains a button which will display a modal.
    The purpose of this modal is to show detailed NLP information about a topic.

    props should contain the following:
        buttonText - text to display on the button that toggles the modal
        topicName - name of the topic 
        articles - list of articles to analyze. The analysis will happen inside this component
                   so that it doesn't slow down the home page. It's better to have a little load 
                   time when waiting for the modal to appear than on the home page itself.
*/
function NlpModal({buttonText, topicName, articles}) {
    const [display, setDisplay] = useState('none'); // this is the CSS property to show/hide the modal, defaults to hidden
    const [keywordDisplay, setKeywordDisplay] = useState('none'); // CSS property for showing and hiding keywords
    const [avgSentiment, setAvgSentiment] = useState(0.0);
    const [avgSubjectivity, setAvgSubjectivity] = useState(0.0);
    const [wordcloudData, setWordcloudData] = useState([]); // this needs to be a list of objects with attributes "value" and "count"

    useEffect(() => {
        // find the average sentiment and subjectivity of the articles
        let totalSentiment = 0.0;
        let totalSubjectivity = 0.0;

        articles.forEach(article => {
            totalSentiment += parseFloat(article.nlp.sentiment);
            totalSubjectivity += parseFloat(article.nlp.subjectivity);
        });

        setAvgSentiment(totalSentiment / articles.length);
        setAvgSubjectivity(totalSubjectivity / articles.length);

        // construct the data for the wordcloud
        // first create a list of all the keywords
        let keywords = [];
        articles.forEach(article => keywords = keywords.concat(article.nlp.keywords.split(',')));
        
        // find the count of each word
        let counts = {};
        keywords.forEach(word => {
            if(word in counts)
                counts[word] += 1;
            else
                counts[word] = 1;
        });

        // construct the data how it's needed for the TagCloud component
        let cloudData = [];
        Object.keys(counts).forEach(word => {
            cloudData.push({value: word, count: counts[word]});
        });

        setWordcloudData(cloudData);
    }, [])

    const toggleModal = () => {
        if(display === 'none')
            setDisplay('flex');
        else
            setDisplay('none');
    }

    const toggleKeywords = () => {
        if(keywordDisplay === 'none')
            setKeywordDisplay('flex');
        else
            setKeywordDisplay('none');
    }

    let modalDisplay = {
        display: display
    }

    let keywordStyle = {
        display: keywordDisplay
    }

    return (
        <div>
            <button onClick={toggleModal} className="btn btn-primary">{buttonText}</button>
            <div className="modal" style={modalDisplay}>
                <div className="modal-content">
                    <div className="text-right">
                        <button onClick={toggleModal} className="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>
                    <h3>Details about the topic "{topicName}" from the past week</h3>
                    <div className="row w-100 justify-content-center">
                        {/* converting these to strings and only showing two decimals for display */}
                        <BasicCard title="Avg. Sentiment" content={avgSentiment.toFixed(2)} />
                        <BasicCard title="Avg. Subjectivity" content={avgSubjectivity.toFixed(2)} />
                    </div>
                    <h2>Keywords</h2>
                    <div className="mt-3 mb-3">
                        <button onClick={toggleKeywords} className="btn btn-primary">
                            {
                                keywordDisplay === 'none'
                                    ? "Show keywords"
                                    : "Hide keywords" 
                            }
                        </button>
                    </div>
                    <div style={keywordStyle}>
                        <TagCloud tags={wordcloudData} minSize={12} maxSize={35} onClick={tag => alert(`'${tag.count}' articles have this keyword`)} />
                    </div>
                    <Link to={'/articles/1?topic=' + topicName} className="mt-4">Browse articles with this topic</Link>
                </div>
            </div>
        </div>
    )
}

export default NlpModal;
