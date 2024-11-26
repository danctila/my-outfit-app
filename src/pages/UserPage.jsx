// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// const UserPage = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [error, setError] = useState('');
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (auth.currentUser) {
//       navigate('/user/preferences');
//     }
//   }, [navigate]);

//   const setUpRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth, // Auth object should be the first argument
//         'recaptcha-container',
//         {
//           size: 'invisible',
//           callback: () => {
//             console.log("reCAPTCHA solved");
//           },
//           'expired-callback': () => {
//             setError('reCAPTCHA expired. Please try again.');
//           },
//         }
//       );
//     }
//   };
  

//   const handleSendCode = async () => {
//     setError('');
//     setUpRecaptcha();

//     try {
//       const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
//       setConfirmationResult(result);
//       alert('Verification code sent to your phone');
//     } catch (error) {
//       console.error('Error details:', error);
//       setError(error.message);
//     }
//   };

//   const handleVerifyCode = async () => {
//     if (confirmationResult) {
//       try {
//         await confirmationResult.confirm(verificationCode);
//         navigate('/generator');
//       } catch (error) {
//         setError(error.message);
//       }
//     } else {
//       setError('Please request a verification code first.');
//     }
//   };

//   return (
//     <div>
//       <h1>Sign Up or Sign In with Phone</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {!confirmationResult && (
//         <div>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             placeholder="+1234567890"
//           />
//           <button onClick={handleSendCode}>Send Verification Code</button>
//         </div>
//       )}
//       {confirmationResult && (
//         <div>
//           <input
//             type="text"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             placeholder="Verification Code"
//           />
//           <button onClick={handleVerifyCode}>Verify Code</button>
//         </div>
//       )}
//       <div id="recaptcha-container"></div>
//     </div>
//   );
// };

// export default UserPage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const UserPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/user/preferences');
    }
  }, [navigate]);

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // Auth object should be the first argument
        'recaptcha-container', // The ID of the container element where the reCAPTCHA will be rendered
        {
          size: 'invisible',
          callback: () => {
            console.log("reCAPTCHA solved");
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          },
        }
      );
    }
  };
  
  const handleSendCode = async () => {
    setError('');
    setUpRecaptcha();

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert('Verification code sent to your phone');
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(verificationCode);
        navigate('/generator');
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please request a verification code first.');
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto" mt='80px'>
      <Heading mb={6} textAlign="center">
        Sign Up or Sign In with Phone
      </Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {!confirmationResult && (
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSendCode}>
            Send Verification Code
          </Button>
        </VStack>
      )}
      {confirmationResult && (
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Verification Code</FormLabel>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleVerifyCode}>
            Verify Code
          </Button>
        </VStack>
      )}
      <Box id="recaptcha-container" mt={4}></Box>
    </Box>
  );
};

export default UserPage;
