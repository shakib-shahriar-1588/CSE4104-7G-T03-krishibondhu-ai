const getWeather = async (req, res) => {
  try {
    // Get city from the URL query (e.g., /api/weather?city=Khulna)
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ message: "Please provide a city name" });
    }

    // Call the OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},BD&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        message: "Failed to fetch weather", 
        error: errorData.message 
      });
    }

    const data = await response.json();

    // Extract only the useful data for the frontend
    const weatherData = {
      city: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      icon: data.weather[0].icon
    };

    res.status(200).json({
      success: true,
      weather: weatherData
    });

  } catch (error) {
    console.error("Weather Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getWeather };