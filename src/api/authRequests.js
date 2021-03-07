import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000';

export const getUser = async () => {
    return axios.get(
        baseUrl + '/api/auth/user',
        {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
        }
    ).then(res => {
        return res.data.username;
    }).catch(err => {
        return 'Error retrieving user info';
    });
}

/*
 * Attempt to authenticate a user given their username and password
 */
export const authenticateUser = async (username, password) => {
    return axios.post(
        baseUrl + '/api/auth/login',
        {
            username: username,
            password: password
        }
    ).then(res => {
        localStorage.setItem('token', res.data.token);

        return true;
    }).catch(err => {
        return false;
    });
}

/*
 * Attempt to register a new user with a username, email and password
 */
export const registerUser = async (username, email, password) => {
    const headers = {
        header: {
            'Content-Type': 'application/json'
        }
    };

    return axios.post(
        baseUrl + '/api/auth/register',
        {
            username: username,
            email: email,
            password: password
        },
        headers
    ).then(res => {
        localStorage.setItem('token', res.data.token);

        return 'success';
    }).catch(err => {
        // default error message
        let registrationError = 'Error registering new user';
        
        // if the response has a regristration error, return the message 
        // from the response on screen
        if(err.response) {
            if(err.response.data.username) {
                registrationError = err.response.data.username[0];
            }
            else if(err.response.data.email) {
                registrationError = err.response.data.email[0];
            }
            else if (err.response.data.password) {
                registrationError = err.response.data.email[0];
            }
        }

        return registrationError;
    });
}

/*
 * Logout the user by calling the /api/auth/logout endpoint which logs out the user
 * from the backend. Then remove the token from storage.
 */
export const logoutUser = async () => {
    return axios.post(
        baseUrl + '/api/auth/logout',
        {},
        {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
        }
    ).then(res => {
        localStorage.removeItem('token');
        return true;
    }).catch(err => {
        console.log(err);
        return false;
    });
}
