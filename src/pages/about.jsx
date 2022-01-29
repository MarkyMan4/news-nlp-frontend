function About() {
    return (
        <div className="row w-100 mb-5 animate__animated animate__fadeIn">
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
                    a value between 0 and 1 inclusive, where 0 is no subjectivity (no opinions, only facts) and 1 is very subjective (very opinionated).
                    For example, a sentence like "I think dogs are good pets." would be subjective because this is an opinion, so it would have score closer to 1. 
                    The sentence "The sky is blue." is not subjective since it is just stating a fact, so it would have a score closer to 0.
                </p>

                <h1 className="mt-5">Keyword Analysis</h1>
                <hr />
                <p>
                    Keywords are used to tell us how relevant a word is to an article. On the Articles page, there are keywords associated with
                    every article. This gives a rough idea of what that article might be talking about. Also, when looking at the topic details on
                    the Home page, it shows keywords across articles from that time frame. This can help identify trends among articles from that
                    time frame based on what keywords showed up a lot.
                </p>
                <p>Keywords are found using TF-IDF (term frequency, inverse document frequency).</p>
                <ul>
                    <li><b>Term Frequency</b> = (# of times a term appears) / (total # of terms in the article)</li>
                    <li><b>Inverse Document Frequency</b> = log(# of sentences / # of sentences with the term)</li>
                    <li><b>TF-IDF</b> = term frequency * inverse document frequency</li>
                </ul>
                <p>
                    A higher TF-IDF score means the term is more important. This site shows 10 keywords for each article. These are the 10 words
                    with the highest TF-IDF score for that article.
                </p>

                <h1 className="mt-5">Topic Modeling</h1>
                <hr />
                <p>
                    Topic modeling helps with assigning a category to an article so that articles can be grouped. All articles on this site fall into 
                    one of four topics:
                </p>
                <ul>
                    <li>Coronavirus</li>
                    <li>Social</li>
                    <li>Government/Politics</li>
                    <li>Science/Tech</li>
                </ul>
                <p>
                    All these topics were inferred based on the text that shows up in the articles. This isn't necessarily the topic that the author 
                    had in mind when writing the article, but this site interacts with a model in the background that scans the content of the articles 
                    and assigns them one of these categories. This model is not perfect, and may assign topics to articles that don't completely fit, but 
                    the model is reevaluated from time to time to continue improving its accuracy.
                </p>

                <h1 className="mt-5">Text Similarity Metrics</h1>
                <hr />
                <p>
                    When looking at the details of an article on this site, it shows a list of similar articles. An article's similarity to another article is 
                    determined by comparing their headlines. Each headline is converted to a vector and then compared to other headlines using cosine similarity. 
                    Articles with a high cosine simliarity mean that they contain similar text.
                </p>
                
            </div>
        </div>
    );
}

export default About;