import React, { useState } from 'react';
import {
  HStack,
  IconButton,
  Link as ChakraLink,
  Box,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/user');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isWideScreen = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <HStack
        h="80px"
        w="100%"
        pos="fixed"
        zIndex={200}
        justifyContent="space-between"
        px="15px"
        bg="gray.800"
        color="white"
      >
        <ChakraLink as={Link} to="/" fontSize="2xl">
          My Outfit App
        </ChakraLink>

        {isWideScreen ? (
          <HStack spacing="24px">
            {currentUser ? (
              <>
                <ChakraLink as={Link} to="/generator">
                  Outfit Generator
                </ChakraLink>
                <ChakraLink as={Link} to="/user/preferences">
                  Settings
                </ChakraLink>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <ChakraLink as={Link} to="/user">
                Login / Sign Up
              </ChakraLink>
            )}
          </HStack>
        ) : (
          <IconButton
            size={'lg'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            onClick={toggleMenu}
          />
        )}
      </HStack>

      {isOpen && !isWideScreen && (
        <Box
          display={{ lg: 'none' }}
          pos="absolute"
          top="80px"
          left="0"
          right="0"
          bg="gray.800"
          zIndex={199}
          py={4}
        >
          <VStack spacing={4} align="start" pl={4} color="white">
            {currentUser ? (
              <>
                <ChakraLink as={Link} to="/generator">
                  Outfit Generator
                </ChakraLink>
                <ChakraLink as={Link} to="/user/preferences">
                  Settings
                </ChakraLink>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <ChakraLink as={Link} to="/user">
                Login / Sign Up
              </ChakraLink>
            )}
          </VStack>
        </Box>
      )}
    </>
  );
};

export default Header;
