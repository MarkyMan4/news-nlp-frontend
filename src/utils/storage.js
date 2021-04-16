/*
 * This file should contain methods for interactions with local storage
 * and cookies.
 */

/*
 * Check if user is logged in. Do some additional check instead of just 
 * checking if they have any value for 'token'.
 */
export const isUserAuthenticated = () => {
    if(localStorage.getItem('token') != null) {
      return true;
    }
  
    return false;
}
