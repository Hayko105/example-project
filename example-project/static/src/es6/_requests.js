import { handleErrors } from "./_validation";
import { getCookie } from './_getcookie';


export const Request = {
    start: () => { window.isLoading = true; },
    stop: () => { window.isLoading = false; }
};

export const sendRequest = (url, requestData) => {
    const options = {
        method: requestData ? 'POST' : 'GET',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie('csrftoken')
        }
    };
    if (requestData) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(requestData);
    }
    Request.start();
    return fetch(url, options)
        .then(handleErrors)
};

export const waitResponse = callback => {
    const timer = () => {
        setTimeout(() => {
            if (window.isLoading) {
                timer();
            } else {
                clearTimeout(timer);
                callback();
            }
        }, 100);
    };
    timer();
};

export class Loader {
    constructor(selector = '.spinner') {
        this.spinner = document.querySelector(selector);
        this.state = false;
    }
    getLoading() {
        return this.state;
    }
    isLoading(state) {
        this.state = state;
        this.state ? this.spinner.classList.add('active') : this.spinner.classList.remove('active');
    }
}