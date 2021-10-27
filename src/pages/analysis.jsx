import React, { useState } from 'react';
import { getTextAnalysis } from '../api/newsRequests';

function Analaysis() {
    const [inputText, setInputText] = useState('');
    const [analysisResult, setAnalysisResult] = useState({});

    const handleTextInput = (event) => {
        setInputText(event.target.value);
    }

    const handleAnalyzeBtnClicked = () => {
        getTextAnalysis(inputText)
            .then(res => setAnalysisResult(res))
            .catch(err => console.log(err));
    }

    return (
        <div className="row w-100">
            <div className="col-md-3"></div>
            <div className="col-md-6 text-center">
                <h3>Enter some text to get NLP analysis</h3>
                <hr />
                <textarea value={inputText} onChange={handleTextInput} className="form-control w-100 mb-5 shadow"></textarea>
                <button onClick={handleAnalyzeBtnClicked} className="btn btn-success">Analyze</button>

                {/* only show results if text has been entered */}
                { 
                    Object.keys(analysisResult).length === 0 
                    ? <div></div> 
                    : <div>
                        <h3 className="mt-5 mb-4">Results</h3>
                        <h5>Sentiment</h5>
                        <p>{Math.round(analysisResult.sentiment * 100) / 100}</p>
                        <h5>Subjectivity</h5>
                        <p>{Math.round(analysisResult.subjectivity * 100) / 100}</p>
                    </div> 
                }
            </div>
        </div>
    );
}

export default Analaysis;
