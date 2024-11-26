import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { saveUserPreferences, loadUserPreferences } from '../firestore'; // Import the functions

const PreferenceSetupPage = () => {
  const [genderPreference, setGenderPreference] = useState('');
  const [customPreferencesVisible, setCustomPreferencesVisible] = useState(false);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [footwear, setFootwear] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [customTops, setCustomTops] = useState('');
  const [customBottoms, setCustomBottoms] = useState('');
  const [customFootwear, setCustomFootwear] = useState('');
  const [customAccessories, setCustomAccessories] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (auth.currentUser) {
        const preferences = await loadUserPreferences(auth.currentUser.uid);
        if (preferences) {
          setGenderPreference(preferences.genderPreference || '');
          setCustomPreferencesVisible(preferences.genderPreference === 'choose my own clothing');
          setTops(preferences.customPreferences?.tops || []);
          setBottoms(preferences.customPreferences?.bottoms || []);
          setFootwear(preferences.customPreferences?.footwear || []);
          setAccessories(preferences.customPreferences?.accessories || []);
        }
      }
    };

    fetchUserPreferences();
  }, []);

  const handleGenderChange = (value) => {
    setGenderPreference(value);
    setCustomPreferencesVisible(value === 'choose my own clothing');
  };

  const handleCheckboxChange = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleSavePreferences = async () => {
    if (!auth.currentUser) {
      console.error('No user is logged in');
      return;
    }

    const preferences = {
      genderPreference,
      customPreferences: customPreferencesVisible
        ? {
            tops: [...tops, customTops].filter(Boolean),
            bottoms: [...bottoms, customBottoms].filter(Boolean),
            footwear: [...footwear, customFootwear].filter(Boolean),
            accessories: [...accessories, customAccessories].filter(Boolean),
          }
        : {},
    };

    await saveUserPreferences(auth.currentUser.uid, preferences);
    navigate('/generator');
  };

  return (
    <Box p={8} mt='80px' maxWidth="500px" mx="auto">
      <Heading mb={6} textAlign="center">
        Set Your Preferences
      </Heading>

      <FormControl mb={4}>
        <FormLabel>Gender Preference</FormLabel>
        <RadioGroup onChange={handleGenderChange} value={genderPreference}>
          <Stack direction="row">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="choose my own clothing">Choose My Own Clothing</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {customPreferencesVisible && (
        <>
          <FormControl mb={4}>
            <FormLabel>Tops</FormLabel>
            <Stack spacing={2}>
              <Checkbox
                value="t-shirt"
                isChecked={tops.includes("t-shirt")}
                onChange={(e) => handleCheckboxChange(e.target.value, tops, setTtops)}
              >
                T-Shirt
              </Checkbox>
              <Checkbox
                value="sweater"
                isChecked={tops.includes("sweater")}
                onChange={(e) => handleCheckboxChange(e.target.value, tops, setTops)}
              >
                Sweater
              </Checkbox>
              <Checkbox
                value="jacket"
                isChecked={tops.includes("jacket")}
                onChange={(e) => handleCheckboxChange(e.target.value, tops, setTops)}
              >
                Jacket
              </Checkbox>
              <Checkbox
                value="hoodie"
                isChecked={tops.includes("hoodie")}
                onChange={(e) => handleCheckboxChange(e.target.value, tops, setTops)}
              >
                Hoodie
              </Checkbox>
              <Checkbox
                value="blouse"
                isChecked={tops.includes("blouse")}
                onChange={(e) => handleCheckboxChange(e.target.value, tops, setTops)}
              >
                Blouse
              </Checkbox>
              <Input
                placeholder="Add custom top"
                value={customTops}
                onChange={(e) => setCustomTops(e.target.value)}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Bottoms</FormLabel>
            <Stack spacing={2}>
              <Checkbox
                value="jeans"
                isChecked={bottoms.includes("jeans")}
                onChange={(e) => handleCheckboxChange(e.target.value, bottoms, setBottoms)}
              >
                Jeans
              </Checkbox>
              <Checkbox
                value="shorts"
                isChecked={bottoms.includes("shorts")}
                onChange={(e) => handleCheckboxChange(e.target.value, bottoms, setBottoms)}
              >
                Shorts
              </Checkbox>
              <Checkbox
                value="skirt"
                isChecked={bottoms.includes("skirt")}
                onChange={(e) => handleCheckboxChange(e.target.value, bottoms, setBottoms)}
              >
                Skirt
              </Checkbox>
              <Checkbox
                value="trousers"
                isChecked={bottoms.includes("trousers")}
                onChange={(e) => handleCheckboxChange(e.target.value, bottoms, setBottoms)}
              >
                Trousers
              </Checkbox>
              <Checkbox
                value="leggings"
                isChecked={bottoms.includes("leggings")}
                onChange={(e) => handleCheckboxChange(e.target.value, bottoms, setBottoms)}
              >
                Leggings
              </Checkbox>
              <Input
                placeholder="Add custom bottoms"
                value={customBottoms}
                onChange={(e) => setCustomBottoms(e.target.value)}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Footwear</FormLabel>
            <Stack spacing={2}>
              <Checkbox
                value="sneakers"
                isChecked={footwear.includes("sneakers")}
                onChange={(e) => handleCheckboxChange(e.target.value, footwear, setFootwear)}
              >
                Sneakers
              </Checkbox>
              <Checkbox
                value="boots"
                isChecked={footwear.includes("boots")}
                onChange={(e) => handleCheckboxChange(e.target.value, footwear, setFootwear)}
              >
                Boots
              </Checkbox>
              <Checkbox
                value="sandals"
                isChecked={footwear.includes("sandals")}
                onChange={(e) => handleCheckboxChange(e.target.value, footwear, setFootwear)}
              >
                Sandals
              </Checkbox>
              <Checkbox
                value="flats"
                isChecked={footwear.includes("flats")}
                onChange={(e) => handleCheckboxChange(e.target.value, footwear, setFootwear)}
              >
                Flats
              </Checkbox>
              <Checkbox
                value="heels"
                isChecked={footwear.includes("heels")}
                onChange={(e) => handleCheckboxChange(e.target.value, footwear, setFootwear)}
              >
                Heels
              </Checkbox>
              <Input
                placeholder="Add custom footwear"
                value={customFootwear}
                onChange={(e) => setCustomFootwear(e.target.value)}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Accessories</FormLabel>
            <Stack spacing={2}>
              <Checkbox
                value="hat"
                isChecked={accessories.includes("hat")}
                onChange={(e) => handleCheckboxChange(e.target.value, accessories, setAccessories)}
              >
                Hat
              </Checkbox>
              <Checkbox
                value="scarf"
                isChecked={accessories.includes("scarf")}
                onChange={(e) => handleCheckboxChange(e.target.value, accessories, setAccessories)}
              >
                Scarf
              </Checkbox>
              <Checkbox
                value="gloves"
                isChecked={accessories.includes("gloves")}
                onChange={(e) => handleCheckboxChange(e.target.value, accessories, setAccessories)}
              >
                Gloves
              </Checkbox>
              <Checkbox
                value="belt"
                isChecked={accessories.includes("belt")}
                onChange={(e) => handleCheckboxChange(e.target.value, accessories, setAccessories)}
              >
                Belt
              </Checkbox>
              <Checkbox
                value="watch"
                isChecked={accessories.includes("watch")}
                onChange={(e) => handleCheckboxChange(e.target.value, accessories, setAccessories)}
              >
                Watch
              </Checkbox>
              <Input
                placeholder="Add custom accessory"
                value={customAccessories}
                onChange={(e) => setCustomAccessories(e.target.value)}
              />
            </Stack>
          </FormControl>
        </>
      )}

      <Button colorScheme="teal" onClick={handleSavePreferences} w="full">
        Save Preferences
      </Button>
    </Box>
  );
};

export default PreferenceSetupPage;
