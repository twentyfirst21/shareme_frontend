import React from 'react';
import { Circles } from 'react-loader-spinner';

function Spinner({ message }) {
    return (
        <div className='flex flex-col justify-center items-center h-full gap-5 m-5'>
            <Circles
                color="#00BFFF"
                height={50}
                width={50}
                ariaLabel="circles-loading"
            />
            <p className='text-lg px-2'>{message}</p>
        </div>
    )
}

export default Spinner