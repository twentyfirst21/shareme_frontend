import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch, IoMdAdd } from 'react-icons/io';

function Navbar(props) {
  const { user, searchTerm, setSearchTerm } = props;

  const navigate = useNavigate();

  if (user) {
    return (
      <div className='flex items-center w-full mt-5 mb-7 gap-2 md:gap-5'>
        <div className='flex items-center h-12 w-full bg-white rounded-md p-2 gap-2 focus-within:shadow-sm'>
          <IoMdSearch fontSize={21} />
          <input
            type="text"
            onChange={(e) => (setSearchTerm(e.target.value))}
            placeholder='Search'
            value={searchTerm}
            onFocus={() => navigate('/search')}
            className='w-full bg-white outline-none'
          />
        </div>
        <div className='flex gap-3'>
          <Link
            to={`/user-profile/${user?._id}`}
            className='hidden md:block'
          >
            <img src={user?.image} alt="user-pic" className='w-14 h-12 rounded-lg object-fit' />
          </Link>
          <Link
            to={"/create-pin"}
            className='rounded-lg bg-black h-12 w-12 md:w-14 md:h-12 text-white flex justify-center items-center'
          >
            <IoMdAdd fontSize={30} />
          </Link>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Navbar