// Base URL

let BASE_URL = "http://localhost:8080/api/1.0.0/";

/**
 * Define the base url for the API
 * @default 'http://localhost:8080/api/1.0.0/'
 * @param {string} base_url 
 */
const setBaseURL = (base_url) => {
    BASE_URL = base_url;
};

// Types
    // User

/**
 * @typedef {Object} UserInformations
 * @property {string} _id
 * @property {string} email
 * @property {string} pass
 * @property {string} firstname
 * @property {string} lastname
 * @property {Array<string>} roles 
 */

/**
 * @typedef {Object} UserRegistrationResult
 * @property {boolean} success
 * @property {string | null} message Only if success is false
 * @property {object | null} error Only if error occured
 */

/**
 * @typedef {Object} UserLoginResult
 * @property {boolean} success
 * @property {string | null} token String if success is true
 * @property {object | null} error Only if error occured
 */

/**
 * @typedef {Object} UserGetResult
 * @property {boolean} success
 * @property {UserInformations | null} user UserInformations if success is true
 * @property {object | null} error Only if error occured
 */

    // Offer

/**
 * @typedef {Object} OfferInformations
 * @property {string} _id
 * @property {string} location Planet name
 * @property {string} title Name of the offer
 * @property {string} short_description Short description of the offer (for cards)
 * @property {string} description Long description of the offer
 * @property {Number} price Price of the offer per day
 * @property {Number} people_max_count Maximum number of people that can be accomodated
 * @property {Number} people_period_count Number of people that already booked on the asked period
 */

/**
 * @typedef {Object} OfferSearchResult
 * @property {Array<OfferInformations>} offers Array of offers that match the search
 */

/**
 * @typedef {Object} OfferReservationResult
 * @property {boolean} success
 * @property {string | null} message Only if success is false
 * @property {object | null} error Only if error occured
 */

// Classes

/**
 * Class for Users interactions
 */
class User {
    /**
     * Register a new user
     * @param {string} email 
     * @param {string} pass 
     * @param {string} firstname 
     * @param {string} lastname 
     * @param {Array<string>} roles 
     * @returns {Promise<UserRegistrationResult>}
     */
    static register(email, pass, firstname, lastname, roles) {
        return new Promise(function(resolve, reject) {
            var createHeader = new Headers();
            createHeader.append('Content-Type', 'application/json');
            var initData = {
                method: 'POST',
                headers: createHeader,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({email, pass, firstname, lastname, roles})
            };
            fetch(BASE_URL+"auth/register",initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    /**
     * Login into user account
     * @param {string} email 
     * @param {string} pass 
     * @returns {Promise<UserLoginResult>}
     */
    static login(email, pass) {
        return new Promise((resolve, reject) => {
            var createHeader = new Headers();
            createHeader.append('Content-Type', 'application/json');
            var initData = {
                method: 'POST',
                headers: createHeader,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({email: email, pass: pass})
            }; 
            fetch(BASE_URL+"auth/login",initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    /**
     * Get informations about the user
     * @param {string} token Given upon login
     * @returns {Promise<UserGetResult>}
     */
    static get(token) {
        return new Promise((resolve, reject) => {
            var getHeader = new Headers();
            getHeader.append('Authorization', token);
            var initData = {
                method: "GET",
                headers: getHeader,
                mode: "cors",
                cache: "default",
            };
            fetch(BASE_URL+'auth/login',initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

/**
 * Class for Offers interactions
 */
class Offer {
    /**
     * Search for offers with filters
     * @param {Number} people_count 
     * @param {string} date_start Format : YYYY-MM-DD
     * @param {string} date_end Format : YYYY-MM-DD
     * @param {string | null} location
     * @returns {Array<object>} Array of offers
     */
    static search(people_count,date_start,date_end,location = null){
        return new Promise((resolve, reject) => {
            var initData = {
                method: "GET",
                mode: "cors",
                cache: "default",
            };
            fetch(`${BASE_URL}offers?people_count=${people_count}&date_start=${date_start}&date_end=${date_end}${location ? `&location=${location}` : ''}`,initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    /**
     * Get informations about the offer
     * @param {string} offer_id 
     * @param {Number} people_count 
     * @param {string} date_start Format : YYYY-MM-DD
     * @param {string} date_end Format : YYYY-MM-DD
     * @returns {Promise<OfferInformations>}
     */
    static select(offer_id, people_count, date_start, date_end){
        return new Promise((resolve, reject) => {
            var initData = {
                method: "GET",
                mode: "cors",
                cache: "default",
            };
            fetch(`${BASE_URL}offers/${offer_id}?people_count=${people_count}&date_start=${date_start}&date_end=${date_end}`,initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    /**
     * Reserve an offer
     * @param {string} offer_id 
     * @param {Number} people_count 
     * @param {string} date_start Format : YYYY-MM-DD
     * @param {string} date_end Format : YYYY-MM-DD
     * @param {string} token Given upon login
     * @returns {Promise<OfferReservationResult>}
     */
    static reserve(offer_id, people_count, date_start, date_end, token){
        return new Promise((resolve, reject) => {
            var getHeader = new Headers();
            getHeader.append('Authorization', token);
            getHeader.append('Content-Type', 'application/json');
            var initData = {
                method: "POST",
                headers: getHeader,
                mode: "cors",
                cache: "default",
                body: JSON.stringify({people_count:people_count,date_start:date_start,date_end:date_end})
            };
            fetch(BASE_URL+"offers/"+offer_id,initData)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

export {User, Offer, setBaseURL};