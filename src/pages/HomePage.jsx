import React from 'react';
import { Button, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth.currentUser) {
      navigate('/generator');
    } else {
      navigate('/user');
    }
  };

  return (
    <VStack spacing={6} align="center">
      <Text fontSize="4xl">Welcome to My Outfit App</Text>
      <Text fontSize="lg">Get personalized outfit recommendations based on the weather and your preferences.</Text>
      <Button colorScheme="teal" onClick={handleGetStarted}>
        Get Started
      </Button>
      <Button variant="outline" onClick={() => navigate('/about')}>
        Download App (Recommended)
      </Button>
    </VStack>
  );
};

export default HomePage;
