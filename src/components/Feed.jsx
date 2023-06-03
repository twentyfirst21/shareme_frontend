import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

import { MasonryLayout, Spinner } from '../components';

function Feed() {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);

        if (categoryId) {
            const query = searchQuery(categoryId);

            client.fetch(query)
                .then((data) => {
                    setPins(data);
                    setLoading(false);
                })
        } else {
            client.fetch(feedQuery)
                .then((data) => {
                    setPins(data);
                    setLoading(false);
                })
        }
    }, [categoryId])


    if (loading) return <Spinner message="We are adding new ideas to your feed!" />

    if (!pins?.length) return (
        <div className='text-center w-full text-xl mt-2'>
            No Pin Available
        </div>
    )

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed