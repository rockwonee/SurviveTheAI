import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  Text,
  useColorMode,
} from '@chakra-ui/react';

const StartMenu: React.FC = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleStart = () => {
    navigate('/character-creation');
  };

  return (
    <Box
      minH="100vh"
      bgImage="url('/forest_1.jpg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
      />
      <Container maxW="container.md" centerContent py={10} position="relative" zIndex="1">
        <VStack spacing={8}>
          <Heading as="h1" size="2xl">
            Survive The AI
          </Heading>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="sound-toggle" mb="0">
                  Sound Effects
                </FormLabel>
                <Switch
                  id="sound-toggle"
                  isChecked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="theme-toggle" mb="0">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="theme-toggle"
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
              </FormControl>
            </VStack>
          </Box>

          <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}>
            <VStack spacing={2} align="stretch">
              <Heading size="md">Controls</Heading>
              <Text>Use mouse to select choices</Text>
              <Text>Press ESC to pause</Text>
            </VStack>
          </Box>

          <Button
            colorScheme="blue"
            size="lg"
            width="200px"
            onClick={handleStart}
          >
            Start Game
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default StartMenu; 