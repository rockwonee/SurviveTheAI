import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Progress,
  useToast,
  HStack,
  Center,
} from '@chakra-ui/react';
import OpenAI from 'openai';

interface Choice {
  text: string;
  isBad: boolean;
}

interface StoryState {
  scenario: string;
  choices: Choice[];
  previousChoices: string[];
  decisionsThisDay: number;
  currentDay: number;
}

const Game: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [health, setHealth] = useState(100);
  const [storyState, setStoryState] = useState<StoryState>({
    scenario: '',
    choices: [],
    previousChoices: [],
    decisionsThisDay: 0,
    currentDay: 1
  });
  const [loading, setLoading] = useState(false);

  // Initialize OpenAI client with direct API key
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleHomeClick = () => {
    localStorage.removeItem('health');
    localStorage.removeItem('characterName');
    navigate('/');
  };

  const generateScenario = async (previousChoice?: string) => {
    setLoading(true);
    try {
      const context = previousChoice 
        ? `Previous scenario: ${storyState.scenario}\nPrevious choice: ${previousChoice}\n\nContinue the story based on this choice and create a new scenario with 5 choices. 2 of these choices should be bad decisions that would lead to health loss.`
        : "Generate an initial survival scenario with 5 choices. 2 of these choices should be bad decisions that would lead to health loss.";

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a fantasy/medieval survival scenario generator. Format the response as JSON with a 'scenario' field and a 'choices' array containing objects with 'text' and 'isBad' fields. Make the story continuous and engaging."
          },
          {
            role: "user",
            content: context
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      const parsedContent = JSON.parse(content);
      
      if (!parsedContent.scenario || !Array.isArray(parsedContent.choices)) {
        throw new Error('Invalid response format from OpenAI');
      }

      setStoryState(prev => ({
        scenario: parsedContent.scenario,
        choices: parsedContent.choices,
        previousChoices: previousChoice 
          ? [...prev.previousChoices, previousChoice]
          : prev.previousChoices,
        decisionsThisDay: previousChoice ? prev.decisionsThisDay + 1 : prev.decisionsThisDay,
        currentDay: prev.currentDay
      }));
    } catch (error) {
      console.error('Error generating scenario:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate scenario. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      setStoryState(prev => ({
        scenario: "You find yourself in a mysterious situation...",
        choices: [
          { text: "Try again", isBad: false },
          { text: "Look around", isBad: false },
          { text: "Stay still", isBad: false },
          { text: "Run away", isBad: false },
          { text: "Call for help", isBad: false }
        ],
        previousChoices: prev.previousChoices,
        decisionsThisDay: prev.decisionsThisDay,
        currentDay: prev.currentDay
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedHealth = localStorage.getItem('health');
    if (savedHealth) {
      setHealth(parseInt(savedHealth));
    }
    generateScenario();
  }, []);

  const handleChoice = (choice: Choice) => {
    if (choice.isBad) {
      const newHealth = Math.max(0, health - 20);
      setHealth(newHealth);
      localStorage.setItem('health', newHealth.toString());
      
      toast({
        title: "Bad Choice!",
        description: "You lost 20 health points!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      if (newHealth <= 0) {
        toast({
          title: "Game Over",
          description: "You didn't survive!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }
    }

    // Check if we need to advance to the next day
    if (storyState.decisionsThisDay + 1 >= 5) {
      setStoryState(prev => ({
        ...prev,
        currentDay: prev.currentDay + 1,
        decisionsThisDay: 0
      }));
      
      toast({
        title: "Day Complete!",
        description: `You've survived Day ${storyState.currentDay}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    generateScenario(choice.text);
  };

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack spacing={8} w="100%">
        <Center w="100%" py={4}>
          <Heading size="2xl" color="blue.500">
            Day {storyState.currentDay}
          </Heading>
        </Center>

        <HStack w="100%" justify="space-between">
          <Box w="100%">
            <Heading size="md" mb={2}>Health</Heading>
            <Progress value={health} colorScheme={health > 50 ? "green" : "red"} />
            <Text mt={2}>{health} HP</Text>
          </Box>
          <Button
            colorScheme="gray"
            onClick={handleHomeClick}
            size="md"
          >
            Home
          </Button>
        </HStack>

        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <VStack spacing={4}>
            <Heading size="md">Current Scenario</Heading>
            <Text>{loading ? "Loading..." : storyState.scenario}</Text>
          </VStack>
        </Box>

        <VStack spacing={4} w="100%">
          {storyState.choices.map((choice, index) => (
            <Button
              key={index}
              w="100%"
              onClick={() => handleChoice(choice)}
              isLoading={loading}
              colorScheme="blue"
              variant="ghost"
            >
              {choice.text}
            </Button>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Game; 