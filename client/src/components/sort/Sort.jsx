import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Sort.scss';
import useAuthStore from '../../stores/authStore';

export default function Sort({ opts, handleSortChange }) {
    const [searchParams] = useSearchParams();


    return (
        <div className='sort_container'>
                <select
                    name="sort"
                    id=""
                    onChange={handleSortChange}
                    defaultValue={searchParams.get('sort') || ''}
                >
                    <option value="">Сортування</option>
                    {opts.map((opt,index) => (
                        <option key={index} value={opt.value}>{opt.name}</option>
                    ))}

                </select>
        </div>
    );
};