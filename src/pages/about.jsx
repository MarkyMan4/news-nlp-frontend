function About() {
    return (
        <div className="row w-100">
            <div className="col-md-3"></div>
            <div className="col-md-6">
                <h1>What is NLP?</h1>
                <hr />
                <p>
                    NLP stands for natural language processing. It is the process of analyzing textual and finding trends.
                    NLP is a broad term which can cover many methods of text analysis. The ways text is analyzed on this site
                    is through the following methods:
                </p>
                <ul>
                    <li>sentiment & subjectivity analysis</li>
                    <li>keyword analysis</li>
                    <li>topic modeling</li>
                    <li>using text similarity metrics</li>
                    <li>using textual data to create visuals for further analysis</li>
                </ul>

                <h1 className="mt-5">Sentiment & Subjectivity</h1>
                <hr />
                <p>
                    <b>Sentiment</b> tells us whether words are used in a positive or negative manner. The sentiment scores on this site are 
                    given as a value between -1 and 1, where -1 is the most negative and 1 is the most positive. For example, "I liked the movie."
                    could be considered positive, so it would have a positive sentiment. Whereas "I think the movie was bad." would be negative.
                </p>
                <p>
                    <b>Subjectivity</b> tells us how opinionated an author was when they were writing an article. Subjectivity scores are given as 
                    a value between 0 and 1 inclusive, where 0 is no subjecitivity (no opinions, only facts) and 1 is very subjective (very opinionated).
                    For example, a sentence like "I think dogs are good pets." would be subjective because this is an opinion, so it would have score closer to 1. 
                    The sentence "The sky is blue." is not subjective since it is just stating a fact, so it would have a score closer to 0.
                </p>

                <h1 className="mt-5">Keyword Analysis</h1>
                <hr />


                <h1 className="mt-5">Topic Modeling</h1>
                <hr />
                

                <h1 className="mt-5">Text Similarity Metrics</h1>
                <hr />
                
            </div>
        </div>
    );
}

export default About;