/*
 * This file should contain methods for interactions with local storage
 * and cookies.
 */

import { getUser } from '../api/authRequests';

/*
 * Check if user is logged in.
 * This is done by looking at what is stored in 'token' in localStorage.
 * If it isn't null it will attempt to get the user info. If this succeeds
 * with a 200 status code, they are authenticated. If it fails with a 401
 * status code, they are not authenticated.
 */
export const isUserAuthenticated = async () => {
  return getUser().then(res => {
    if(res.error)
      return false;
    
    return true;
  });
}
