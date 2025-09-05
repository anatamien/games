import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const GameStateProvider = window.GameStateProvider;
  const GameScreen = window.GameScreen;
  const UpgradeScreen = window.UpgradeScreen;
  const InventoryScreen = window.InventoryScreen;
  const MenuScreen = window.MenuScreen;
  const useGameState = window.useGameState;

  return (
    <GameStateProvider>
      <GameRouter />
    </GameStateProvider>
  );
}

function GameRouter() {
  const { gameState } = window.useGameState();
  
  const screens = {
    game: window.GameScreen,
    upgrades: window.UpgradeScreen,
    inventory: window.InventoryScreen,
    menu: window.MenuScreen
  };
  
  const CurrentScreen = screens[gameState.currentScreen] || window.GameScreen;
  
  return <CurrentScreen />;
}

// Wait for all components to load
function waitForComponents() {
  const requiredComponents = [
    'GameStateProvider',
    'GameScreen', 
    'UpgradeScreen',
    'InventoryScreen',
    'MenuScreen'
  ];
  
  const checkComponents = () => {
    const allLoaded = requiredComponents.every(comp => window[comp]);
    
    if (allLoaded) {
      createRoot(document.getElementById('renderDiv')).render(<App />);
    } else {
      setTimeout(checkComponents, 100);
    }
  };
  
  checkComponents();
}

waitForComponents();