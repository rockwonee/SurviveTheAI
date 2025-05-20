import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartMenu from './components/StartMenu';
import CharacterCreation from './components/CharacterCreation';
import Game from './components/Game';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/character-creation" element={<CharacterCreation />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
