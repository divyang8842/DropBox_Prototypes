import axios from 'axios';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3004'

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) =>
    fetch(`${api}/signin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
export const doSignUp = (payload) =>
    fetch(`${api}/afterSignUp`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doUpload = (payload) =>
    fetch(`${api}/uploadFile`, {
        method: 'POST',

        body: payload,
        credentials:'include'

    }).then(res => res.json())
        .then(res =>{
            debugger;
            console.log(res);
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doMkdir = (payload) =>

    fetch(`${api}/mkdir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const deleteDir = (payload) =>
    fetch(`${api}/delDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const getChildDirs =(payload) =>

    fetch(`${api}/getDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            debugger;
            console.log(res);
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const doShareFile = (payload) =>
    fetch(`${api}/shareFile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doLogout = (payload) =>
    fetch(`${api}/logout`, {
        method: 'POST',
        headers: {
            ...headers,
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            localStorage.removeItem("token");
            localStorage.removeItem("root");
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const doDownload = (payload) =>
    axios({
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        url: `${api}/download`,
        data: JSON.stringify(payload),
        responseType:'stream'
    })
        .then(function (response) {

            return response
        })
        .catch(function (error) {
            console.log(error);
        });


