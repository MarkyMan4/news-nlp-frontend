import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api';

export const getArticles = async (pageNo) => {
    return axios.get(
        `${baseUrl}/article?page=${pageNo}`
    ).then(res => res.data)
     .catch(err => console.log(err));
}