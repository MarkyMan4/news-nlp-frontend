import { useState } from 'react';

/*
    The NlpModal component contains a button which will display a modal.

    This component is a proof of concept for displaying a modal/popup window when a button is clicked.
    This will need to take props which will be info about articles that should be displayed in this modal.
    The props passed in should contain info like stats about the articles.
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
        // <div className="modal">
        <div>
            <button onClick={toggleModal}>{props.buttonText}</button>
            <div className="modal" style={modalDisplay}>
                <div className="modal-content">
                    <div className="text-right">
                        <button onClick={toggleModal} class="btn btn-outline-danger">&times;</button>
                    </div>
                    <div className="text-center">
                        <p>this is a test modal</p>
                        <p>this is a test modal</p>
                        <p>this is a test modal</p>
                        <p>this is a test modal</p>
                        <p>this is a test modal</p>
                        <p>this is a test modal</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NlpModal;
