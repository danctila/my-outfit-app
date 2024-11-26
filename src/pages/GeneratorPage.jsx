import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  Text,
  Spinner,
  Center,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const GeneratorPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    warmthPreference: 50,
    stylePreference: 'casual',
    footwearPreference: 'sneakers',
    showAdvancedOptions: false,
    rainPreference: 50,
    windPreference: 50,
    layerPreference: 50,
    genderPreference: '',
  });
  const [outfit, setOutfit] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/user');
    } else {
      const fetchUserPreferences = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserPreferences((prev) => ({
              ...prev,
              ...docSnap.data(),
            }));
          } else {
            console.log('No user preferences found!');
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        }
      };

      fetchUserPreferences();
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchWeatherAndLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`
          );

          const weatherData = weatherResponse.data;

          const currentWeather = {
            description: weatherData.current.weather[0].description,
            temp: Math.round(weatherData.current.temp),
          };

          const laterForecast = weatherData.hourly.find((hour) => {
            const hourDate = new Date(hour.dt * 1000);
            return hourDate.getHours() > new Date().getHours();
          });

          const locationResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
          );

          const locationData = locationResponse.data[0];
          const locationName = `${locationData.name}, ${locationData.country}`;

          setWeatherData({
            location: locationName,
            current: currentWeather,
            forecast: [
              {
                time: new Date(laterForecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: laterForecast.weather[0].description,
                temp: Math.round(laterForecast.temp),
              },
            ],
          });
        });
      } catch (error) {
        console.error('Error fetching weather data or location:', error);
      }
    };

    fetchWeatherAndLocation();
  }, []);

  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;
    setUserPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateOutfit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-outfit', {
        weatherData,
        preferences: {
          warmthPreference: userPreferences.warmthPreference,
          stylePreference: userPreferences.stylePreference,
          footwearPreference: userPreferences.footwearPreference,
          showAdvancedOptions: userPreferences.showAdvancedOptions,
          rainPreference: userPreferences.rainPreference,
          windPreference: userPreferences.windPreference,
          layerPreference: userPreferences.layerPreference,
          genderPreference: userPreferences.genderPreference,
        },
      });

      setOutfit(response.data.outfit);
    } catch (error) {
      console.error('Error generating outfit:', error);
    }
  };

  return (
    <Box p={8} mt="80px">
      <Heading mb={6}>Outfit Generator</Heading>
      <Box mb={6} height="200px" borderWidth="1px" borderRadius="lg" p={4}>
        {!weatherData ? (
          <Center height="100%">
            <Spinner size="xl" label="Weather being fetched..." />
            <Text mt={4}>Weather being fetched...</Text>
          </Center>
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold">Current Location: {weatherData.location}</Text>
            <Text>Current Weather: {weatherData.current.description}</Text>
            <Text>Temperature: {weatherData.current.temp}°F</Text>
            <Text mt={4} fontWeight="bold">Forecast:</Text>
            {weatherData.forecast.map((forecast, index) => (
              <Text key={index}>
                {forecast.time}: {forecast.description}, {forecast.temp}°F
              </Text>
            ))}
          </>
        )}
      </Box>
      <Box mb={6}>
        <FormControl mb={4}>
          <FormLabel>Warmth Preference</FormLabel>
          <HStack justifyContent="space-between">
            <Text>Dislike</Text>
            <Slider
              name="warmthPreference"
              min={0}
              max={100}
              value={userPreferences.warmthPreference}
              onChange={(value) => setUserPreferences((prev) => ({ ...prev, warmthPreference: value }))}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text>Like</Text>
          </HStack>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Style Preference</FormLabel>
          <Select
            name="stylePreference"
            value={userPreferences.stylePreference}
            onChange={handlePreferenceChange}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sporty">Sporty</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Footwear Preference</FormLabel>
          <Select
            name="footwearPreference"
            value={userPreferences.footwearPreference}
            onChange={handlePreferenceChange}
          >
            <option value="sneakers">Sneakers</option>
            <option value="boots">Boots</option>
            <option value="sandals">Sandals</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <Checkbox
            isChecked={userPreferences.showAdvancedOptions}
            onChange={() =>
              setUserPreferences((prev) => ({
                ...prev,
                showAdvancedOptions: !prev.showAdvancedOptions,
              }))
            }
          >
            Show Advanced Options
          </Checkbox>
        </FormControl>

        {userPreferences.showAdvancedOptions && (
          <Box mb={4}>
            <FormControl mb={4}>
              <FormLabel>Rain Preference</FormLabel>
              <Slider
                name="rainPreference"
                min={0}
                max={100}
                value={userPreferences.rainPreference}
                onChange={(value) =>
                  setUserPreferences((prev) => ({ ...prev, rainPreference: value }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Wind Preference</FormLabel>
              <Slider
                name="windPreference"
                min={0}
                max={100}
                value={userPreferences.windPreference}
                onChange={(value) =>
                  setUserPreferences((prev) => ({ ...prev, windPreference: value }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Layer Preference</FormLabel>
              <Slider
                name="layerPreference"
                min={0}
                max={100}
                value={userPreferences.layerPreference}
                onChange={(value) =>
                  setUserPreferences((prev) => ({ ...prev, layerPreference: value }))
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </Box>
        )}

        <Button colorScheme="teal" onClick={handleGenerateOutfit} w="full">
          Generate Outfit
        </Button>
      </Box>

      {outfit && (
        <Box mt={6}>
          <Heading size="md">Recommended Outfit:</Heading>
          <Text>{outfit}</Text>
        </Box>
      )}
    </Box>
  );
};

export default GeneratorPage;
