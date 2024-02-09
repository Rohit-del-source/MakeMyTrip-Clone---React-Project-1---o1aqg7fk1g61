// FHome.jsx
import React, { useState, useEffect } from 'react';

import FCard from './FCard';

function FHome({ from, setfrom, to, setTo }) {
  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);
  const [departureDate, setDepartureDate] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchCities = async () => {
    setLoading(true);
    const url = `https://academics.newtonschool.co/api/v1/bookingportals/airport`;

    const headers = {
      projectID: '{{f104bi07c490}}', 
    };

    try {
      const response = await fetch(url, { method: 'GET', headers });
      const data = await response.json();
      const airportData = data.data.airports;
      const uniqueCities = [...new Set(airportData.map((airport) => airport.city))];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    const url = `https://academics.newtonschool.co/api/v1/bookingportals/flight?search={"source":"${from}","destination":"${to}"}&day=Mon`; // Default day 'Mon', you can change it as needed

    const headers = {
      projectID: '{{f104bi07c490}}', 
    };

    try {
      const response = await fetch(url, { method: 'GET', headers });
      const data = await response.json();
      setFlights(data.results ? data.data.flights : []); 
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlights([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchFlights();
  };

  const handleFromChange = (event) => {
    setfrom(event.target.value);
  };

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleDepartureDateChange = (event) => {
    setDepartureDate(event.target.value);
  };

  return (
    <div className="home__container">
      <div className="home">
        <p>Book International and Domestic Flights</p>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="from home__input">
              <p>FROM</p>
              <select onChange={handleFromChange} value={from}>
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="to home__input">
              <p>TO</p>
              <select onChange={handleToChange} value={to}>
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="departure home__input">
              <p>DEPARTURE DATE</p>
              <input
                type="date"
                min={today}
                value={departureDate}
                onChange={handleDepartureDateChange}
              />
            </div>
          </div>
          <div>
            <button className="home__search" type="submit">
              {loading ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </div>
        </form>
        <FCard flights={flights} />
      </div>
    </div>
  );
}

export default FHome;
