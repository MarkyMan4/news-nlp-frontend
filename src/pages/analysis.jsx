import React, { useState } from 'react';
import { getTextAnalysis, getKeywordsInText, getTopicProbabilities } from '../api/newsRequests';

function Analaysis() {
    const [inputText, setInputText] = useState('');
    const [analysisResult, setAnalysisResult] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [topicProbabilities, setTopicProbabilities] = useState([]);

    const handleTextInput = (event) => {
        setInputText(event.target.value);
    }

    const handleAnalyzeBtnClicked = () => {
        getTextAnalysis(inputText)
            .then(res => setAnalysisResult(res))
            .catch(err => console.log(err));

        getKeywordsInText(inputText)
            .then(res => setKeywords(res))
            .catch(err => console.log(err));

        getTopicProbabilities(inputText)
            .then(res => setTopicProbabilities(res))
            .catch(err => console.log(err));
    }

    return (
        <div className="row w-100 animate__animated animate__fadeIn">
            <div className="col-md-3"></div>
            <div className="col-md-6 text-center">
                <h3>Enter some text to get NLP analysis</h3>
                <hr />
                <textarea value={inputText} onChange={handleTextInput} className="form-control w-100 mb-5 shadow"></textarea>
                <button onClick={handleAnalyzeBtnClicked} className="btn btn-success mb-5">Analyze</button>

                {/* only show results if text has been entered */}
                { 
                    Object.keys(analysisResult).length === 0 
                    ? <div></div> 
                    : <div>
                        <h4>Sentiment</h4>
                        <p>{Math.round(analysisResult.sentiment * 100) / 100}</p>
                        <h4>Subjectivity</h4>
                        <p>{Math.round(analysisResult.subjectivity * 100) / 100}</p>
                        <h4>Key words</h4>
                        <p>{keywords.join(', ')}</p>
                        <h4>Topic probabilities</h4>
                        {topicProbabilities.map(item => <p>{item.topic_name}: {Math.round(item.probability * 100) / 100}</p>)}
                    </div> 
                }
            </div>
        </div>
    );
}

export default Analaysis;
