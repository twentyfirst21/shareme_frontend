import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import axios from "axios";
import { client } from '../client';

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

const Login = () => {
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: async response => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        "Authorization": `Bearer ${response.access_token}`
                    }
                })

                // save into localStorage
                localStorage.setItem('user', JSON.stringify(res.data));
                const { name, sub, picture } = res.data;
                // prepare variable for save into sanity
                const doc = {
                    _id: sub,
                    _type: 'user',
                    userName: name,
                    image: picture
                }

                client.createIfNotExists(doc)
                    .then(() => {
                        navigate('/', { replace: true })
                    })

            } catch (err) {
                console.log(err)
            }
        }
    });

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='h-full w-full'>
                <video
                    src={shareVideo}
                    type='video/mp4'
                    controls={false}
                    loop
                    muted
                    autoPlay
                    className='h-full w-full object-cover'
                />
            </div>

            <div className='absolute flex flex-col justify-center items-center h-full w-full bg-blackOverlay'>
                <div className='p-5'>
                    <img src={logo} alt="logo" width='130px' />
                </div>
                <div className='shadow-2xl'>
                    <button className='flex justify-center items-center p-3 bg-mainColor rounded-lg' onClick={login}>
                        <FcGoogle className='mr-4' />
                        Sign In with Google
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Login