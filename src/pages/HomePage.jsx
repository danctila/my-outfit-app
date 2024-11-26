import React, { useRef, useEffect, useState } from 'react';
import { Button, VStack, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const lowerSectionRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();  // Chakra UI hook for modal

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleDownloadApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      onOpen();  // Open the modal if the prompt is not available
    }
  };

  const scrollToLowerSection = () => {
    lowerSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContinueOnWeb = () => {
    if (currentUser) {
      navigate('/generator');
    } else {
      navigate('/user');
    }
  };

  return (
    <VStack spacing={6} align="center" mt='80px'>
      <Text fontSize="4xl">Welcome to My Outfit App</Text>
      <Text fontSize="lg">Get personalized outfit recommendations based on the weather and your preferences.</Text>
      <Button colorScheme="teal" onClick={scrollToLowerSection}>
        Get Started
      </Button>

      <div ref={lowerSectionRef} style={{ marginTop: '100px' }}>
        <VStack spacing={4} align="center">
          <Button colorScheme="blue" onClick={handleContinueOnWeb}>
            Continue on Web
          </Button>
          <Button id="download-app" onClick={handleDownloadApp}>
            Download App
          </Button>
        </VStack>
      </div>

      <Button variant="outline" onClick={() => navigate('/about')}>
        Learn More
      </Button>

      {/* Modal for fallback instructions */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Install the App</ModalHeader>
          <ModalBody>
            <Text>Didn't get the install prompt? Follow these steps:</Text>
            <Text mt={4}>
              1. Open the browser menu (usually in the top-right corner).
            </Text>
            <Text mt={2}>
              2. Select "Add to Home Screen" or "Install" option.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default HomePage;
