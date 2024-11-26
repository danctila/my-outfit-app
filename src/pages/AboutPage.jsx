import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { currentUser } = useAuth();

  return (
    <VStack spacing={6} align="center" mt='80px'>
      <Text fontSize="4xl">About My Outfit App</Text>
      <Text fontSize="lg">This app helps you choose outfits based on the current weather and your personal preferences.</Text>
      {currentUser && (
        <Text fontSize="md">You are logged in as: {currentUser.phoneNumber || 'Unknown User'}</Text>
      )}
    </VStack>
  );
};

export default AboutPage;
