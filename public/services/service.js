import router from "../router.js";
import signOut from "../signout.js";

const request = async (url, options) => {
    try {
        if (!url) throw new Error('No URL.');
        if (!options) options = { method: "GET" };

        const req = await fetch(url, options);
        const res = await req.json();

        if (!req.ok) throw new Error(res.error.message);

        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const authorizedRequest = async (url, options) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) throw new Error('No TOKEN.');
        if (!url) throw new Error('No URL.');

        if (!options) options = { method: "GET" };
        if (!options.headers) options.headers = {};

        options.headers['authorization'] = 'Bearer ' + token;

        if (!options['credentials']) options['credentials'] = 'include';

        const req = await fetch(url, options);
        const res = await req.json();

        if (!req.ok) {
            if (req.status === 401) {
                throw new Error('No estás autorizado para realizar esta acción.');
                signOut();
            } else {
                throw new Error(res.error.message);
            };
        };

        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const service = {
    request,
    authorizedRequest
};

export default service;