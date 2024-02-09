import React, { useState, useEffect } from "react";
import "../Home.css";

function HHome({
    from,
    setfrom,
}) {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [checkoutDate, setCheckoutDate] = useState("");
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const hotelData = await fetchHotelData();
            const extractedCities = extractCitiesFromHotelData(hotelData);
            setCities(extractedCities);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchHotelData = async () => {
        try {
            const response = await fetch(
                `https://academics.newtonschool.co/api/v1/bookingportals/hotel/cities`,
                {
                    headers: {
                        'projectID': 'f104bi07c490',
                    },
                }
            );
            const data = await response.json();
            return data.hotels || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const extractCitiesFromHotelData = (hotelData) => {
        const citiesSet = new Set();
        hotelData.forEach(hotel => {
            const city = getCityFromLocation(hotel.location);
            if (city) {
                citiesSet.add(city);
            }
        });
        return Array.from(citiesSet);
    };

    const getCityFromLocation = (location) => {
        // Assuming location is in the format "City, Region, Country"
        const city = location.split(',')[0].trim();
        return city;
    };

    const handleFromChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleCheckoutDateChange = (event) => {
        setCheckoutDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add logic for handling form submission (e.g., search functionality)
    };

    return (
        <div className='home__container'>
            <div className='home'>
                <p>Search To Stay </p>

                <form onSubmit={handleSubmit}>
                    <div className='inputs'>
                        <div className='from home__input'>
                            <p>CITY</p>
                            <select
                                value={selectedCity}
                                onChange={handleFromChange}
                            >
                                <option value=''>Select City</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='departure home__input'>
                            <p>CHECK-IN</p>
                            <input type="date" min={today}/>
                        </div>
                        <div className='return home__input'>
                            <p>CHECK-OUT</p>
                            <input type="date" value={checkoutDate} min={today} onChange={handleCheckoutDateChange}/>
                        </div>
                    </div>
                    <div>
                        <button className='home__search' type="submit">SEARCH</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HHome;
