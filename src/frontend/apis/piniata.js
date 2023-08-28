const axios = require("axios");

const fetch = require("node-fetch");

const FormData = require('form-data');
// const fs = require('fs')

const key = process.env.REACT_APP_PINIATA_API_KEY;
const secret = process.env.REACT_APP_PINIATA_API_SECRET;
const JWT = process.env.REACT_APP_PINIATA_JWT;

// functions

/*
    export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    // axios upload to ipfs
    try{ 
        const res = await axios.post(url, JSONBody, {
            maxBodyLength: "Infinity",
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });
        console.log(res.data);
    } catch (e) {
        console.log(e)
        return {
            success: false,
            message: e.message,
        }
    } 
    
    //making axios POST request to Pinata
    return axios.post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
        });
    }

    export const uploadFileToIPFS = async(file, name) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: "listdata",
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', pinataOptions);

    return axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               success: true,
               piniataCID: response.data.IpfsHash,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
        });
    }
*/

export async function sendJSONToIPFS (jsonMetadata, name) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    /* ---  --- */
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${JWT}`
        },
        body: JSON.stringify({
            pinataContent: jsonMetadata,
            pinataOptions: {cidVersion: 0, wrapWithDirectory: false},
            pinataMetadata: {name: name}
        })
    }
    
    try{
        const res = await fetch(url, options);
        const resData = await res.json();
        return `ipfs://${resData.IpfsHash}`
    } catch (error) {
        console.log(error);
        return error;
    }
        /* --- --- */
}

export async function sendFileToIPFS(file) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    /* --- --- */
    const form = new FormData();
    form.append('cidVersion', '0');
    form.append('wrapWithDirectory', 'false');
    form.append('file', file);

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${JWT}`
        }
    };
      
    options.body = form;
      
    try{
        const res = await fetch(url, options);
        const resData = await res.json();
        return `ipfs://${resData.IpfsHash}`
    } catch (error) {
        console.log(error);
        return error;
    }
       /* --- --- */

}

// fs not working && axios.post not identifyed