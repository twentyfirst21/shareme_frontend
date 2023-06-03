import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import Spinner from './Spinner';
import { searchQuery } from '../utils/data';

function Search(props) {
  const { searchTerm } = props;
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then((res) => {
        setPins(res);
        setLoading(false);
      })
    }
  }, [searchTerm])


  return (
    <>
      {loading ? (
        < Spinner message="Searching for pins . . ." />
      ) : (
        <>
          {pins?.length > 0 && <MasonryLayout pins={pins} />}
          {pins?.length === 0 && searchTerm !== "" && (
            <div className='text-center w-full text-xl mt-2'>
              No Pin Found
            </div>
          )}
        </>

      )
      }
    </>
  )
}

export default Search