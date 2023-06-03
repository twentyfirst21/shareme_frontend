import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { AiOutlineLogout } from 'react-icons/ai';

const activeBtnStyles = "bg-red-500 text-white font-bold py-2 px-4 outline-none rounded-full";
const notActiveBtnStyles = "bg-primary text-black py-2 px-4 outline-none rounded-full";

const randomImgaeUrl = "https://source.unsplash.com/random/1600x900/?nature,photography,technology";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const logout = () => {
    googleLogout();

    localStorage.clear();

    navigate('/login');
  }

  useEffect(() => {
    const queryUser = userQuery(userId);
    client.fetch(queryUser).then((res) => {
      setUser(res[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (activeBtn === "created") {
      const query = userCreatedPinsQuery(userId);

      client.fetch(query).then((res) => {
        setPins(res);
      });
    } else {
      const query = userSavedPinsQuery(userId);

      client.fetch(query).then((res) => {
        setPins(res);
      });
    }
  }, [activeBtn, userId])



  if (!user) return <Spinner message="Loading profile . . ." />

  return (
    <div className='realtive pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImgaeUrl}
              alt="banner-pic"
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img
              src={user.image}
              alt="user-pic"
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
            />
            <h1 className='font-bold text-3xl text-center my-3'>{user.userName}</h1>
            <div className='absolute z-1 top-0 right-0 p-2'>
              {userId === user._id && (
                <button
                  type='button'
                  className='bg-white p-2 rounded-full outline-none shadow-md'
                  onClick={logout}
                >
                  <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className='flex justify-center items-center gap-2 mb-7'>
            <button
              type='button'
              onClick={() => setActiveBtn('created')}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={() => setActiveBtn('saved')}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>

          {pins.length > 0 ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className='text-center font-bold w-full text-xl mt-2'>
              No Pins Found!
            </div>

          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile