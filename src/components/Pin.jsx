import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fecthUser } from '../utils/fetchUser';

function Pin(props) {
  const { pin } = props;
  const { postedBy, image, _id, destination, save } = pin;

  const [postHovered, setPostHovered] = useState(() => false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();

  const user = fecthUser();

  const alreadySaved = save?.some((item) => item?.postedBy?._id === user?.sub);

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub
          }
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        })
    }
  }

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      })
  }

  return (
    <div className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img
          className='rounded-lg w-full'
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
        {postHovered && (
          <div
            className='absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2'
            style={{ height: '100%' }}
          >
            <div className='flex justify-center items-center justify-between'>
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white opacity-75 w-8 h-8 rounded-full flex justify-center items-center text-xl text-dark outline-none hover:opacity-100 hover:shadow-md'
              >
                <MdDownloadForOffline />
              </a>
              {alreadySaved ? (
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none h-8'
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type='button'
                  onClick={
                    (e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }
                  }
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none h-8'
                >
                  {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className={`flex items-center w-full ${destination ? 'justify-between' : 'justify-end'}`}>
              {destination && (
                <a
                  href={destination}
                  target='_blank'
                  rel="noreferrer"
                  className='bg-white flex items-center gap-2 h-8 text-black font-bold p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'>
                  <BsFillArrowUpRightCircleFill />
                  {destination.slice(0, 14)}...
                </a>
              )}
              {postedBy?._id === user?.sub && (
                <button
                  type='button'
                  onClick={
                    (e) => {
                      e.stopPropagation();
                      deletePin(_id);
                    }
                  }
                  className='bg-white rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none hover:shadow-md'
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className='flex gap-2 items-center mt-2 w-100'>
        <img src={postedBy?.image} alt="user-post" className='w-8 h-8 rounded-full object-fit' />
        <p className='font-medium capitalize text-ellipsis whitespace-nowrap overflow-hidden'>{postedBy?.userName}</p>
      </Link>
    </div>
  )
}

export default Pin