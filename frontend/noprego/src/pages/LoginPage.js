import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useSession } from './../SessionContext.js'; 

export default function LoginPage() {
    const navigate = useNavigate();
    const { address, setAddress } = useSession();

    const login = async (credential) => {
        const decodedToken = jwtDecode(credential);

        axios.post('https://localhost:3001/login', {
            email: decodedToken.email
        })
        .then(function (response) {
            console.log('Data sent successfully: ', response);
            if(response.data.userdata){
                setAddress(response.data.address);
                navigate('/home/'+address);
            } else {
                window.location.replace('https://g7v0scf2v0s.typeform.com/to/WFJHQOvh#email='+decodedToken.email);    
            }
        })
        .catch(function (error) {
            console.log("Connection error: "+error);
        });
    }

    return (
        <GoogleLogin
          onSuccess = {response => {
              login(response.credential);
          }}
          onError={() => {
              console.log('Login Failed');
          }}
        />
      );
}