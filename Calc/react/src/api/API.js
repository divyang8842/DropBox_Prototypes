const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const doCompute = (payload) =>
    fetch(`${api}/calc/doCompute`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });
