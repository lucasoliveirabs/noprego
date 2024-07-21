import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
import User from './model/User.js';
import Project from './model/Project.js';
import { userFieldMap, artworkFieldMap } from './utils/FieldMap.js';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const PORT = isNaN(parseInt(process.env.PORT)) ? 3000 : parseInt(process.env.PORT); 

const USER_FIELD_MAP_OPTION = 1;
const ARTWORK_FIELD_MAP_OPTION = 2;
class ContractEnum {
    static ERC1155WRAPPER = 'ERC1155Wrapper.sol';
    static LOCK = 'Lock.sol';
    static NOPREGO = 'NoPrego.sol';
    static NOPREGONFT = 'NoPregoNFT.sol';
}

//web2
app.get('/', (req, res) => {
    res.send('Running API');
});

app.post("/login", async (request, response) => {
    try {
        const fetchedUser = await User.findOne(request.body);
        let user = (fetchedUser) ? fetchedUser : await User.create(request.body);
        let lumixApiKey = await getApiKey();
        
        if(!user.wallet) {
            user.wallet = await createWallet(lumixApiKey);
            user = await user.save();
        }
        response.status(201).send({address: user.wallet.address});
    } catch(error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/user", async (request, response) => {
    try {
        const user = await User.findOne(request.body.form_response.hidden);
            if(!user.userdata){
                user.userdata = {};
            }
            user.userdata = formatTypeformData(request, USER_FIELD_MAP_OPTION);
            await user.save();
            response.status(201).send('User successfully updated');        
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.post("/artwork", async (request, response) => {
    try {
        const user = await User.findOne(request.body.form_response.hidden);
        if(!user.artwork){
            user.artwork = [{}];
        }
        
        const formattedValues = formatTypeformData(request, ARTWORK_FIELD_MAP_OPTION);
        
        if(formattedValues.document_upload){
            const documentUploadResponse = await deployImageIPFS(formattedValues.document_upload);
            formattedValues.document_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + documentUploadResponse.IpfsHash;
        }
        
        if(formattedValues.purchase_proof_upload){
            const purchaseProofUploadResponse = await deployImageIPFS(formattedValues.purchase_proof_upload);
            formattedValues.purchase_proof_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + purchaseProofUploadResponse.IpfsHash;
        }
        
        if(formattedValues.image_upload){
            const imageUploadResponse = await deployImageIPFS(formattedValues.image_upload);
            formattedValues.image_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + imageUploadResponse.IpfsHash;
        }
        
        if(formattedValues.fee_payment_proof_upload){
            const feePaymentProofUploadResponse = await deployImageIPFS(formattedValues.fee_payment_proof_upload);
            formattedValues.fee_payment_proof_upload = 'https://moccasin-bizarre-guanaco-244.mypinata.cloud/ipfs/' + feePaymentProofUploadResponse.IpfsHash;
        }

        user.artwork.push(formattedValues);
        await user.save();     
        response.status(201).send('/artwork');  
    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

const getApiKey = async () => {
    const project = await Project.findOne();
    return project.apiKey;
}

const createWallet = async (lumxApiKey) => {
    const options = {method: 'POST', headers: {Authorization: 'Bearer '+lumxApiKey}};

    try {
        const response = await fetch('https://protocol-sandbox.lumx.io/v2/wallets', options);
        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }
        return await response.json();
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }    
}

const formatTypeformData = (request, fieldMapOption) => {
    const formattedValues = {};
    const fieldMap = fieldMapOption == 1 ? userFieldMap : artworkFieldMap;

    const fieldIdMap = new Map();
    request.body.form_response.definition.fields.forEach(field => {
        fieldIdMap.set(field.id, field.title);
    });

    request.body.form_response.answers.forEach( answer => {
        const fieldId = answer.field.id;
        const fieldTitle = fieldIdMap.get(fieldId);
        const fieldName = fieldMap[fieldTitle];

        let value;
        switch (answer.type) {
        case 'text':
            value = answer.text;
            break;
        case 'date':
            value = answer.date;
            break;
        case 'phone_number':
            value = answer.phone_number;
            break;
        case 'boolean':
            value = answer.boolean;
            break;
        case 'number':
            value = answer.number;
            break;
        case 'file_url':
            value = answer.file_url;
            break;
        case 'choice':
            value = answer.choice.label;
            break;
        default:
            value = '';
        }
        formattedValues[fieldName] = value;
    });
    return formattedValues;
}

const extractFileUrlFromHtml = (html) => {
    const match = html.match(/href="(https:\/\/[^"]+\.(pdf|jpeg|jpg|png|gif))"/);
    return match ? match[1] : null;
};

const deployJSONIPFS = async (json) => {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        body: json,
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_API_SECRET
        }
    });
    const uploadResponse = await response.json();
    return uploadResponse;
};

const deployImageIPFS = async (url) => {
    const urlStream = await fetch(url);
    const contentType = urlStream.headers.get('content-type');

    if (contentType.startsWith('text/html')) {
        const html = await urlStream.text();
        const fileUrl = extractFileUrlFromHtml(html);
        if (!fileUrl) {
            throw new Error('Unable to find a valid file URL in the HTML content');
        }
    }

    const arrayBuffer = await urlStream.arrayBuffer();
    const blob = new Blob([arrayBuffer])
    const file = new File([blob], "file");
    const data = new FormData();
    data.append("file", file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        body: data,
        headers: {
            "pinata_api_key": process.env.PINATA_API_KEY,
            "pinata_secret_api_key": process.env.PINATA_API_SECRET
        }
    });
    const uploadResponse = await response.json();
    return uploadResponse;
}

//web3

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB connection success");
    app.listen(PORT, function(err){
        if (err) console.log("Error - server not listening");
        console.log("Server listening on Port", PORT);
    })
}).catch(() => {
    console.log("MongoDB connection failed")
})