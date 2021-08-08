import { useEffect, useState } from 'react';
import BasicCard from '../components/basicCard';
import { TagCloud } from 'react-tagcloud';

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
function NlpModal(props) {
    const [display, setDisplay] = useState('none'); // this is the CSS property to show/hide the modal, defaults to hidden
    const [avgSentiment, setAvgSentiment] = useState(0.0);
    const [avgSubjectivity, setAvgSubjectivity] = useState(0.0);
    const [wordcloudData, setWordcloudData] = useState([]); // this needs to be a list of objects with attributes "value" and "count"

    useEffect(() => {
        // find the average sentiment and subjectivity of the articles
        let totalSentiment = 0.0;
        let totalSubjectivity = 0.0;

        props.articles.forEach(article => {
            totalSentiment += parseFloat(article.nlp.sentiment);
            totalSubjectivity += parseFloat(article.nlp.subjectivity);
        });

        setAvgSentiment(totalSentiment / props.articles.length);
        setAvgSubjectivity(totalSubjectivity / props.articles.length);

        // construct the data for the wordcloud
        // first create a list of all the keywords
        let keywords = [];
        props.articles.forEach(article => keywords = keywords.concat(article.nlp.keywords.split(',')));
        
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

    let modalDisplay = {
        display: display
    }

    return (
        <div>
            <button onClick={toggleModal} className="btn btn-info">{props.buttonText}</button>
            <div className="modal" style={modalDisplay}>
                <div className="modal-content">
                    <div className="text-right">
                        <button onClick={toggleModal} class="btn btn-outline-danger pb-0 pt-0 pl-2 pr-2">&times;</button>
                    </div>
                    <h3>Details about the topic "{props.topicName}" from the past week</h3>
                    <div className="row w-100 justify-content-center">
                        {/* converting these to strings and only showing two decimals for display */}
                        <BasicCard title="Avg. Sentiment" content={avgSentiment.toFixed(2)} />
                        <BasicCard title="Avg. Subjectivity" content={avgSubjectivity.toFixed(2)} />
                    </div>
                    <h2>Keywords</h2>
                    <TagCloud tags={wordcloudData} minSize={12} maxSize={35} onClick={tag => alert(`'${tag.count}' was selected!`)} />
                    <p className="mt-5">down here I'll display some fun stuff like keywords and a link to the articles page with the topic filter applied</p>
                </div>
            </div>
        </div>
    )
}

export default NlpModal;
