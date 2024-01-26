// CountryApp.js

import React, { useEffect, useReducer, useState } from 'react';
import CountryList from './CountryList';
import './CountryApp.scss';
import countriesData from '../components/data.json';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_COUNTRIES':
      return { ...state, countries: action.payload, filteredCountries: action.payload, loading: false };
    case 'TOGGLE_THEME':
      return { ...state, darkTheme: !state.darkTheme };
    case 'FILTER_COUNTRIES':
      return { ...state, filteredCountries: action.payload };
    case 'FILTER_BY_REGION':
      const selectedRegion = action.payload;
      const filteredByRegion = selectedRegion
        ? state.countries.filter((country) => country.region === selectedRegion)
        : state.countries;
      return { ...state, filteredCountries: filteredByRegion, selectedRegion };

    default:
      return state;
  }
};

const initialState = {
  countries: [],
  filteredCountries: [],
  loading: true,
  darkTheme: false,
  selectedRegion: null,
};

const CountryApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState('');

  const { countries, filteredCountries, loading, darkTheme, selectedRegion } = state;

  useEffect(() => {
    // Assuming each country entry in data.json has 'region' and 'capital' properties.
    dispatch({ type: 'SET_COUNTRIES', payload: countriesData });
  }, []);

  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch({ type: 'FILTER_COUNTRIES', payload: filtered });
  }, [searchTerm, countries]);

  const handleRegionChange = (selectedRegion) => {
    dispatch({ type: 'FILTER_BY_REGION', payload: selectedRegion });
  };

  const regions = [...new Set(countries.map((country) => country.region))];

  return (
    <div className={`App ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header>
        <h1>Where is the world</h1>
        <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
          Theme
        </button>
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="region-filter">
          <label htmlFor="region">Filter by Region:</label>
          <select
            id="region"
            value={selectedRegion || ''}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <p>Loading...</p>}

      <CountryList countries={filteredCountries} />
    </div>
  );
};

export default CountryApp;

