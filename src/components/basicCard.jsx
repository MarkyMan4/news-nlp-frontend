import React from 'react';

// basic card component that contains a title and content
function BasicCard(props) {
    return (
        <div className="basic-card shadow">
            <div className = "text-center">
                <h3><b>{props.title}</b></h3>
                <div className="card-content">{props.content}</div>
            </div>
        </div>
    );
}

export default BasicCard;
