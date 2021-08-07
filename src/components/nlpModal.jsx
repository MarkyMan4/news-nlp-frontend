import { useState } from 'react';

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
                    <h3>Topic: {props.topicName}</h3>
                    <div className="text-center">
                        {/* Just dumping a bunch of json for now, this will be replaced by the analysis */}
                        <p>{JSON.stringify(props.articles[0])}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NlpModal;
