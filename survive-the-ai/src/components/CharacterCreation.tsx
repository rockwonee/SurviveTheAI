import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';

const CharacterCreation: React.FC = () => {
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      // Save character data to localStorage
      localStorage.setItem('characterName', characterName);
      localStorage.setItem('health', '100');
      navigate('/game');
    }
  };

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack spacing={8}>
        <Heading as="h1" size="xl">
          Create Your Character
        </Heading>

        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Character Name</FormLabel>
                <Input
                  placeholder="Enter your character's name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              </FormControl>

              <Text fontSize="sm" color="gray.500">
                Your character starts with 100 health points.
                Choose wisely in the game to survive!
              </Text>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="200px"
                isDisabled={!characterName.trim()}
              >
                Begin Adventure
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};

export default CharacterCreation; 