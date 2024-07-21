import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    blockExplorerUrl: {
        type: String,
        required: true
    }
});

const UserDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    cpf: {
        type: String,
        required: false
    },
    birth_date: {
        type: Date,
        required: false,
        default: Date.now
    },
    personal_address: {
        type: String,
        required: false
    },
    personal_address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    postcode: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    }
});

const ArtworkSchema = new mongoose.Schema({
    object_type: {
        type: String,
        required: false
    },
    object_title: {
        type: String,
        required: false
    },
    manufacturer_artist_name: {
        type: String,
        required: false
    },
    creation_year: {
        type: Number,
        required: false
    },
    object_dimensions: {
        type: String,
        required: false
    },
    object_description: {
        type: String,
        required: false
    },
    acquisition_conditions: {
        type: String,
        required: false
    },
    acquisition_price: {
        type: Number,
        required: false
    },
    desired_price: {
        type: Number,
        required: false
    },
    document_upload: {
        type: String,
        required: false
    },
    purchase_proof_upload: {
        type: String,
        required: false
    },
    image_upload: {
        type: String,
        required: false
    },
    fee_payment_proof_upload: {
        type: String,
        required: false
    },
    hash_ipfs: {
        type: String,
        required: false
    }
});

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter user gmail"]
    },
    userdata: {
        type: UserDataSchema,
        required: false
    },
    wallet: {
        type: WalletSchema,
        required: false
    },
    artwork: [{
        type: ArtworkSchema,
        required: false
    }]
});

const User = mongoose.model('User', UserSchema);

export default User;