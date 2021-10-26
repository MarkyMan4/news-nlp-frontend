import React from 'react';

// basic card component that contains a title and content
function BasicCard({title, titleColor="black", content}) {
    return (
        <div className="basic-card shadow">
            <div className = "text-center">
                <h3 style={{color: titleColor}}><b>{title}</b></h3>
                <div className="card-content">{content}</div>
            </div>
        </div>
    );
}

export default BasicCard;
