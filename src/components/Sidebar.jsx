import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

import { categories } from '../utils/data'
import logo from '../assets/logo.png'

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';

function Sidebar(props) {
    const { closeToogle, user } = props;

    const handleCloseSidebar = () => {
        if (closeToogle) closeToogle(false);
    }

    return (
        <div className='flex flex-col justify-between bg-white min-w-210 overflow-y-scroll hide-scrollbar'>
            <div className='flex flex-col'>
                <Link
                    className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
                    to={'/'}
                >
                    <img src={logo} alt="logo" className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink
                        to={'/'}
                        className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                        onClick={handleCloseSidebar}
                    >
                        <AiFillHome />
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover cateogries</h3>
                    {categories.map(category => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                            key={category.name}
                            onClick={handleCloseSidebar}
                        >
                            <img src={category.image} alt="logo" className="w-8 h-8 rounded-full shadow-sm" />
                            {category.name}
                        </NavLink>
                    )
                    )}
                </div>
            </div>
            {user && (
                <Link
                    to={`/user-profile/${user._id}`}
                    className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                    onClick={handleCloseSidebar}
                >
                    <img src={user?.image} alt="logo" className='w-10 h-10 rounded-full mr-4' />
                    {user?.userName}
                </Link>
            )}

        </div >
    )
}

export default Sidebar