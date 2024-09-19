import React, { useEffect, useState } from 'react'
import "./Cuisines.scss"
import BannerSignUp from '../../components/banners/banner_signup/BannerSignUp'
import { makeRequest } from '../../axi'
import CuisinesList from '../../components/cuisines_list/CuisinesList'
import Sort from '../../components/sort/Sort'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function Cuisines() {

  const [cuisines, setCuisines] = useState()

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const opts = [
    {
      value: "name asc",
      name: "Назва (А-Я)"
    },
    {
      value: "name desc",
      name: "Назва (Я-А)"
    },

  ]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
    fetchCuisines()
  }, [])

  useEffect(() => {
    fetchCuisines();
  }, [searchParams]);

  const fetchCuisines = async () => {
    try {
      const response = await makeRequest.get('/cuisines/getall',{
        params: {
          sort: searchParams.get('sort') || '',
        }
      });
      setCuisines(response.data)

    } catch (error) {
      console.error('Failed to fetch cuisines:', error);
    }
  };


  const handleSortChange = (e) => {
    const { name, value } = e.target;
    const params = new URLSearchParams([...searchParams]);
    params.set(name, value);
    console.log(name, value)
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <div className="cuisines_page inter-regular">
      <div className='page_header'>
        <span className='montserrat-alternates-medium header1'>Кухні світу</span>
        <div className='line' />
      </div>
      <div className='section_sort'>
        {opts && <Sort opts={opts} handleSortChange={handleSortChange}/>}
      </div>
      <div className='section'>
        {cuisines && <CuisinesList cuisines={cuisines} />}
      </div>
      <BannerSignUp />
    </div>
  )
}
