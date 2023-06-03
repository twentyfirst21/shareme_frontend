import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import { categories } from '../utils/data';
import { client } from '../client';
import Spinner from './Spinner';

const typeImageValid = ['png', 'svg', 'jpeg', 'gif', 'tiff']

function CreatePin(props) {
  const { user } = props;
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (typeImageValid.some((item) => `image/${item}` === selectedFile.type)) {
      setWrongImageType(false);
      setLoading(true);
      client
        .assets
        .upload('image', selectedFile, {
          contentType: selectedFile.type, filename: selectedFile.filename
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if (title !== '' && about !== '' && destination !== '' && category !== '') {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        category,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        }
      };

      client.create(doc)
        .then(() => {
          navigate('/')
        });

    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add all fields.</p>
      )}
      {wrongImageType && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">It&apos;s wrong file type.</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        {/* Form upload image */}
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full relative'>
          {!imageAsset ? (
            <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420 cursor-pointer'>
              {loading ? (
                <Spinner message="Uploading file" />
              ) : (
                <label className='cursor-pointer'>
                  <div className='relative flex flex-col justify-center items-center h-full w-full'>
                    <div className='flex flex-col justify-center items-center'>
                      <AiOutlineCloudUpload className="font-bold text-2xl" />
                      <p className='text-lg'>Click to upload</p>
                    </div>
                    <p className='mt-5 text-gray-400 text-center'>Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB</p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={uploadImage}
                    className='w-0 h-0'
                  />
                </label>
              )}
            </div>

          ) : (
            <>
              <img
                src={imageAsset?.url}
                alt="uploaded-pic"
                className="h-full w-full"
              />
              <button
                type="button"
                className="absolute opacity-75 bottom-6 right-6 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:opacity-100 hover:shadow-md transition-all duration-500 ease-in-out"
                onClick={() => setImageAsset(null)}
              >
                <MdDelete />
              </button>
            </>
          )}
        </div>
        {/* Form input */}
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 w-full'>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='p-2 border-b-2 outline-none text-base'
          />
          {user && (
            <div className='flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg'>
              <img src={user.image} alt="user-profile" className='w-10 h-10 rounded-full' />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='Tell everyone what your Pin is about'
            className='p-2 border-b-2 outline-none text-base'
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='p-2 border-b-2 outline-none text-base'
          />
          <div>
            <p className='text-xl mb-2 font-semibold'>Chosee Pin Category</p>
            <select
              className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer capitalize'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="other">Select Category</option>
              {categories.map((item) => {
                return (
                  <option key={item.name} value={item.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{item.name}</option>
                )
              })}
            </select>
          </div>
          <div className='flex justify-end mt-5'>
            <button
              type="submit"
              onClick={savePin}
              className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
            >
              Save Pin
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CreatePin