import React, { useState } from 'react';

function Analaysis() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');

    const handleTextInput = (event) => {
        setInputText(event.target.value);
    }

    const handleAnalyzeBtnClicked = () => {
        setOutputText(inputText);
    }

    return (
        <div className="row w-100">
            <div className="col-md-3"></div>
            <div className="col-md-6 text-center">
                <h3>Enter some text to get NLP analysis</h3>
                <hr />
                <textarea value={inputText} onChange={handleTextInput} className="form-control w-100 mb-5 shadow"></textarea>
                <button onClick={handleAnalyzeBtnClicked} className="btn btn-success">Analyze</button>
                <h4 className="mt-5">You Entered</h4>
                <p>{outputText}</p>
            </div>
        </div>
    );
}

export default Analaysis;
