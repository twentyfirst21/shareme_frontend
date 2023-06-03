import React, { useEffect, useState, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

import { Sidebar, UserProfile } from '../components';
import { userQuery } from '../utils/data';
import Pins from './Pins';
import { client } from '../client';
import logo from '../assets/logo.png';
import { fecthUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState();
  const scrollRef = useRef(null);

  const userInfo = fecthUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className='bg-secondaryColor h-screen transition-height duration-75 ease-out flex md:flex-row flex-col'>
      <div className='hidden md:flex h-screen flex-initial overflow-y-auto'>
        <Sidebar user={user && user} />
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to={'/'}>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-9 h-9 rounded-full' />
          </Link>
        </div>
        {toggleSidebar &&
          <div className='absolute fixed bg-slate-500/25 h-screen w-screen backdrop-blur-sm z-10' onClick={() => setToggleSidebar(false)} />
        }
        <div className={` overflow-y-auto absolute fixed bg-white h-screen w-[250px] left-0 top-0 duration-500 transition-all ease-in -translate-x-full z-10 ${toggleSidebar && "translate-x-0"}`}>
          <Sidebar user={user && user} closeToogle={setToggleSidebar} />
        </div>
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home