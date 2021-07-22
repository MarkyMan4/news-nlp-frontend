import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

// keywords are a list of semicolon separated values in the database
// this formats them as comma separated to improve readability
const formatKeywords = (keywords) => {
    const keywordsList = keywords.split(';');
    return keywordsList.join(', ');
}

// need to include options for query parameters 
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
    if(topic)
        url += `?topic=${topic}`;

    return axios.get(url)
        .then(res => res.data.count) // object only contains count attribute
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

    return axios.get(`${baseUrl}/savearticle`, {}, headers)
        .then(res => res)
        .catch(err => console.log(err));

}
