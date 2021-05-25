import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

// need to include options for query parameters 
export const getArticlePage = async (pageNo) => {
    return axios.get(
        `${baseUrl}/article?page=${pageNo}`
    ).then(res => res.data)
     .catch(err => {
         return {'error': 'invalid page'};
     });
}

export const getArticleById = async (id) => {
    return axios.get(
        `${baseUrl}/article/${id}`
    ).then(res => res.data)
     .catch(err => console.log(err));
}
