import React, { useEffect, useState } from 'react'
import './Cuisine.scss'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { makeRequest } from '../../axi';
import RecipesList from '../../components/recipes_list/RecipesList';
import Pagination from '../../components/pagination/Pagination';

export default function Cuisine() {
  const recipesPerPage = 10;

  const [cuisine, setCuisine] = useState([])
  const [recipes, setRecipes] = useState([])

  const [searchParams] = useSearchParams();
  const params = useParams();

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
    fetchCuisine();
    fetchRecipes();
  }, [])

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchCuisine = async () => {
    try {
      const response = await makeRequest.get('/cuisines/one', {
        params: {
          cuisineId: params.cuisineId,
        }
      });
      console.log(response.data)
      setCuisine(response.data[0])

    } catch (error) {
      console.error('Failed to fetch cuisines:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await makeRequest.get('/recipes/filter', {
        params: {
          cuisine: params.cuisineId,
          page: searchParams.get('page') || 1,
          pageSize: searchParams.get('pageSize') || recipesPerPage,
        }
      });
      console.log(response.data)
      setRecipes(response.data.data)
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error('Failed to fetch cuisines:', error);
    }
  };

  const splitTextIntoParagraphs = () => {
    if (cuisine.text) {
      return cuisine.text.split('\\n').map((line, index) => (
        <div key={index}>{line}</div>
      ));
    }

  };


  return (
    <div className='cuisine_page inter-regular'>
      {cuisine &&
        <>
          <div className='img_section'>
            <img src={cuisine.img ?'/upload/'+ cuisine.img : '/images/cake1.webp'} alt='' />
          </div>
          <div className='cuisine_section'>
            <div className='page_header'>
              <span className='montserrat-alternates-medium header1'>{cuisine.name}</span>
              <div className='line' />
            </div>

            <div className='text'>{splitTextIntoParagraphs()}</div>
          </div>
          <div className='section'>
            {recipes && <RecipesList recipes={recipes} />}
            <Pagination totalPages={totalPages}/>
          </div>
        </>}
    </div>
  )
}
