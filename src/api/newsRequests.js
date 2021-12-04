import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

// keywords are a list of semicolon separated values in the database
// this formats them as comma separated to improve readability
const formatKeywords = (keywords) => {
    const keywordsList = keywords.split(';');
    return keywordsList.join(', ');
}

// gets paginated articles with any specified filters
export const getArticlePage = async (pageNo, filters) => {
    return axios.get(`${baseUrl}/article?page=${pageNo}`, {params: filters})
        .then(res => {
            let data = res.data;

            // apply keyword formatting to each article
            for(let i = 0; i < data.articles.length; i++) {
                data.articles[i].nlp.keywords = formatKeywords(data.articles[i].nlp.keywords);
            }

            return data;
        })
        .catch(err => {
            return {'error': 'invalid page'};
        });
}

// gets non-paginated articles with an specified filters
// TODO: consolidate this method and getArticlePage into one method by making pageno optional,
//       or include pageno with the other filters
export const getArticles = async (filters) => {
    return axios.get(`${baseUrl}/article`, {params: filters})
        .then(res => {
            let articles = res.data;

            // apply keyword formatting to each article
            for(let i = 0; i < articles.length; i++) {
                articles[i].nlp.keywords = formatKeywords(articles[i].nlp.keywords);
            }

            return articles;
        })
        .catch(err => {
            return {'error': 'failed to retrieve articles'};
        });
}

export const getArticleById = async (id) => {
    return axios.get(`${baseUrl}/article/${id}`)
        .then(res => {
            let article = res.data;
            article.nlp.keywords = formatKeywords(article.nlp.keywords);

            return article;
        })
        .catch(err => console.log(err));
}

export const getSimilarArticles = async (id, numResults) => {
    return axios.get(`${baseUrl}/article/${id}/get_similar?numResults=${numResults}`)
        .then(res => {
            let data = res.data;

            // apply keyword formatting to each article
            for(let i = 0; i < data.length; i++) {
                data[i].nlp.keywords = formatKeywords(data[i].nlp.keywords);
            }

            return data;
        })
        .catch(err => console.log(err));
}

export const getTopicList = async () => {
    return axios.get(`${baseUrl}/topics`)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getArticleCounts = async (topic=null) => {
    let url = `${baseUrl}/article/get_article_count`;

    // topic is an optional parameter
    if(topic !== null)
        url += `?topic=${topic}`;

    return axios.get(url)
        .then(res => res.data.count) // object only contains count attribute
        .catch(err => console.log(err));
}

export const getArticleCountsByTopic = async (timeFrame, topic) => {
    let url = `${baseUrl}/topics/counts`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getArticleCountsBySentiment = async (timeFrame, topic) => {
    let url = `${baseUrl}/article/count_by_sentiment`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

// bookmark an article for the current user
export const saveArticle = async (articleId) => {
    const body = {
        article: articleId
    };

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.post(`${baseUrl}/savearticle`, body, headers)
        .then(() => {
            return {'result': 'success'}
        })
        .catch(() => {
            return {'result': 'failed to save article'}
        });
}

// list all bookmarked articles for the current user
export const listSavedArticles = async () => {
    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(`${baseUrl}/savearticle`, headers)
        .then(res => res.data)
        .catch(err => console.log(err));

}

// check if an article is saved for the current user
export const isArticleSaved = async (articleId) => {
    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(`${baseUrl}/savearticle/${articleId}/is_saved`, headers)
        .then(res => res.data.result)
        .catch(err => console.log(err));
}

// deletes a saved article for the current user.
// returns true if the article was successfully deleted, otherwise returns false
export const removeSavedArticle = async (articleId) => {
    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.delete(`${baseUrl}/savearticle/${articleId}`, headers)
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        });
}

// gets sentiment and subjectivity data used for graphing
export const getSentimentAndSubjectivity = async (timeFrame, topic) => {
    let url = `${baseUrl}/article/subjectivity_by_sentiment`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getCountByTopicAndDate = async (timeFrame, topic) => {
    let url = `${baseUrl}/article/count_by_topic_date`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    return axios.get(url)
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getTextAnalysis = async (text) => {
    let url = `${baseUrl}/analysis/get_sentiment`;

    return axios.post(url, {text: text})
        .then(res => res.data)
        .catch(err => console.log(err));
}

export const getKeywordsInText = async (text) => {
    let url = `${baseUrl}/analysis/get_keywords`;

    return axios.post(url, {text: text})
        .then(res => res.data.keywords) // only return keywords, not the whole JSON object
        .catch(err => console.log(err));
}

export const getTopicProbabilities = async (text) => {
    let url = `${baseUrl}/analysis/get_topic_probability`;

    return axios.post(url, {text: text})
        .then(res => res.data)
        .catch(err => console.log(err));
}

// get counts by topic for the users saved articles
export const getSavedArticleCountsByTopic = async (timeFrame, topic) => {
    let url = `${baseUrl}/savearticle/count_by_topic`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(url, headers)
        .then(res => res.data)
        .catch(err => console.log(err));

}

// get counts by sentiment for the users saved articles
export const getSavedArticleCountsBySentiment = async (timeFrame, topic) => {
    let url = `${baseUrl}/savearticle/count_by_sentiment`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(url, headers)
        .then(res => res.data)
        .catch(err => console.log(err));

}

// get counts by sentiment for the users saved articles
export const getSavedArticleSentimentAndSubjectivity = async (timeFrame, topic) => {
    let url = `${baseUrl}/savearticle/subjectivity_by_sentiment`;
    let queryParams = [];

    if(timeFrame && timeFrame !== '')
        queryParams.push(`timeFrame=${timeFrame}`);

    if(topic && topic !== 'all')
        queryParams.push(`topic=${topic}`);

    if(queryParams.length > 0)
        url += '?' + queryParams.join('&');

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(url, headers)
        .then(res => res.data)
        .catch(err => console.log(err));

}

// get counts by sentiment for the users saved articles
export const getSavedArticleCountByTopicAndDate = async (timeFrame) => {
    let url = `${baseUrl}/savearticle/count_by_topic_date`;

    if(timeFrame && timeFrame !== '') {
        url += `?timeFrame=${timeFrame}`;
    }

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.get(url, headers)
        .then(res => res.data)
        .catch(err => console.log(err));

}

export const clearAllSavedArticles = async () => {
    let url = `${baseUrl}/savearticle/clear_saved_articles`;

    const headers = {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    };

    return axios.post(url, {}, headers)
        .then(res => res.data)
        .catch(err => console.log(err));
}
