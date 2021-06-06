import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

// keywords are a list of semicolon separated values in the database
// this formats them as comma separated to improve readability
const formatKeywords = (keywords) => {
    const keywordsList = keywords.split(';');
    return keywordsList.join(', ');
}

// need to include options for query parameters 
export const getArticlePage = async (pageNo) => {
    return axios.get(`${baseUrl}/article?page=${pageNo}`)
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
