import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext();

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};

const initialState = {
  // Resources
  fish: 0,
  pearls: 0,
  artifacts: 0,
  energy: 100,
  
  // Zone progression
  currentZone: 0, // 0: Тихая отмель, 1: Песнь рифов, 2: Свет медуз, 3: Молчаливая бездна
  
  // Upgrades
  upgrades: {
    nets: { level: 1, fishPerClick: 1 },
    pearlOysters: { level: 0, pearlChance: 0 },
    depthLanterns: { level: 0, zonesUnlocked: 1 },
    boat: { level: 1, capacity: 100, idleSpeed: 5000 }, // milliseconds
    oceanSpirit: { level: 0, multiplier: 1 }
  },
  
  // Inventory
  inventory: {
    commonFish: 0,
    rareFish: 0,
    legendaryFish: 0,
    corals: 0,
    seashells: 0
  },
  
  // Statistics
  stats: {
    totalFishCaught: 0,
    totalClicks: 0,
    gameStartTime: Date.now(),
    lastPlayTime: Date.now(),
    timeOffline: 0
  },
  
  // Events
  activeEvent: null,
  eventTimeRemaining: 0,
  
  // Settings
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    language: 'ru'
  },
  
  // Achievements
  achievements: [],
  
  // UI State
  currentScreen: 'game' // game, upgrades, inventory, menu
};

const zones = [
  { 
    name: 'Тихая отмель', 
    color: '#87CEEB',
    requiredLevel: 0,
    fishTypes: ['commonFish'],
    description: 'Спокойные воды. Здесь начинается путь.'
  },
  { 
    name: 'Песнь рифов', 
    color: '#40E0D0',
    requiredLevel: 5,
    fishTypes: ['commonFish', 'rareFish', 'corals'],
    description: 'Кораллы шепчут древние тайны.'
  },
  { 
    name: 'Свет медуз', 
    color: '#FF69B4',
    requiredLevel: 15,
    fishTypes: ['rareFish', 'legendaryFish'],
    description: 'Медузы светятся в глубине.'
  },
  { 
    name: 'Молчаливая бездна', 
    color: '#191970',
    requiredLevel: 30,
    fishTypes: ['legendaryFish', 'artifacts'],
    description: 'Где молчание становится мудростью.'
  }
];

const events = [
  {
    name: 'Стая рыб',
    description: 'Большая стая проплывает мимо!',
    duration: 30000, // 30 seconds
    effect: { type: 'fishMultiplier', value: 2 },
    chance: 0.1 // 10% chance every check
  },
  {
    name: 'Шторм',
    description: 'Буря затрудняет рыбалку...',
    duration: 15000, // 15 seconds
    effect: { type: 'fishMultiplier', value: 0 },
    chance: 0.05 // 5% chance
  },
  {
    name: 'Свет медуз',
    description: 'Медузы освещают путь к сокровищам!',
    duration: 45000, // 45 seconds
    effect: { type: 'pearlChance', value: 50 },
    chance: 0.03 // 3% chance
  }
];

function GameStateProvider({ children }) {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('quiet-depths-save');
    if (saved) {
      const parsedState = JSON.parse(saved);
      // Calculate offline progress
      const now = Date.now();
      const timeDiff = now - parsedState.stats.lastPlayTime;
      const maxOfflineTime = 8 * 60 * 60 * 1000; // 8 hours
      const offlineTime = Math.min(timeDiff, maxOfflineTime);
      
      if (offlineTime > 60000) { // More than 1 minute offline
        const offlineReward = calculateOfflineReward(parsedState, offlineTime);
        parsedState.fish += offlineReward.fish;
        parsedState.pearls += offlineReward.pearls;
        parsedState.stats.timeOffline = offlineTime;
      }
      
      parsedState.stats.lastPlayTime = now;
      return { ...initialState, ...parsedState };
    }
    return initialState;
  });

  // Save game state
  useEffect(() => {
    const saveGame = () => {
      localStorage.setItem('quiet-depths-save', JSON.stringify(gameState));
    };
    
    const interval = setInterval(saveGame, 5000); // Save every 5 seconds
    return () => clearInterval(interval);
  }, [gameState]);

  // Idle income system
  useEffect(() => {
    const idleInterval = setInterval(() => {
      setGameState(prev => {
        const { boat, oceanSpirit } = prev.upgrades;
        const baseIncome = Math.floor(boat.level * 0.5 + 1);
        const multiplier = prev.activeEvent?.effect.type === 'fishMultiplier' 
          ? prev.activeEvent.effect.value * oceanSpirit.multiplier
          : oceanSpirit.multiplier;
        
        if (multiplier === 0) return prev; // During storm
        
        const fishGained = Math.floor(baseIncome * multiplier);
        
        return {
          ...prev,
          fish: prev.fish + fishGained,
          stats: {
            ...prev.stats,
            totalFishCaught: prev.stats.totalFishCaught + fishGained
          }
        };
      });
    }, gameState.upgrades.boat.idleSpeed);

    return () => clearInterval(idleInterval);
  }, [gameState.upgrades.boat.idleSpeed]);

  // Event system
  useEffect(() => {
    const eventCheck = setInterval(() => {
      setGameState(prev => {
        // If event is active, countdown
        if (prev.activeEvent && prev.eventTimeRemaining > 0) {
          const newTimeRemaining = prev.eventTimeRemaining - 1000;
          
          if (newTimeRemaining <= 0) {
            return {
              ...prev,
              activeEvent: null,
              eventTimeRemaining: 0
            };
          }
          
          return {
            ...prev,
            eventTimeRemaining: newTimeRemaining
          };
        }
        
        // Check for new events
        if (!prev.activeEvent && Math.random() < 0.02) { // 2% chance every second
          const possibleEvents = events.filter(event => Math.random() < event.chance);
          
          if (possibleEvents.length > 0) {
            const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
            return {
              ...prev,
              activeEvent: selectedEvent,
              eventTimeRemaining: selectedEvent.duration
            };
          }
        }
        
        return prev;
      });
    }, 1000);

    return () => clearInterval(eventCheck);
  }, []);

  const clickFish = () => {
    setGameState(prev => {
      const { nets, oceanSpirit } = prev.upgrades;
      const baseGain = nets.fishPerClick;
      const eventMultiplier = prev.activeEvent?.effect.type === 'fishMultiplier' 
        ? prev.activeEvent.effect.value 
        : 1;
      
      if (eventMultiplier === 0) return prev; // During storm
      
      const totalGain = Math.floor(baseGain * eventMultiplier * oceanSpirit.multiplier);
      
      // Pearl chance
      const pearlChance = prev.upgrades.pearlOysters.pearlChance + 
        (prev.activeEvent?.effect.type === 'pearlChance' ? prev.activeEvent.effect.value : 0);
      const pearlGained = Math.random() * 100 < pearlChance ? 1 : 0;
      
      return {
        ...prev,
        fish: prev.fish + totalGain,
        pearls: prev.pearls + pearlGained,
        stats: {
          ...prev.stats,
          totalFishCaught: prev.stats.totalFishCaught + totalGain,
          totalClicks: prev.stats.totalClicks + 1
        }
      };
    });
  };

  const purchaseUpgrade = (upgradeType) => {
    setGameState(prev => {
      const cost = calculateUpgradeCost(upgradeType, prev.upgrades[upgradeType].level);
      
      if (prev.fish < cost.fish || prev.pearls < cost.pearls) {
        return prev; // Cannot afford
      }
      
      const newUpgrades = { ...prev.upgrades };
      newUpgrades[upgradeType] = { ...newUpgrades[upgradeType] };
      newUpgrades[upgradeType].level += 1;
      
      // Apply upgrade effects
      switch (upgradeType) {
        case 'nets':
          newUpgrades[upgradeType].fishPerClick = newUpgrades[upgradeType].level;
          break;
        case 'pearlOysters':
          newUpgrades[upgradeType].pearlChance = newUpgrades[upgradeType].level * 2;
          break;
        case 'depthLanterns':
          newUpgrades[upgradeType].zonesUnlocked = Math.min(newUpgrades[upgradeType].level + 1, zones.length);
          break;
        case 'boat':
          newUpgrades[upgradeType].capacity += 25;
          newUpgrades[upgradeType].idleSpeed = Math.max(1000, 5000 - (newUpgrades[upgradeType].level * 200));
          break;
        case 'oceanSpirit':
          newUpgrades[upgradeType].multiplier = 1 + (newUpgrades[upgradeType].level * 0.1);
          break;
      }
      
      return {
        ...prev,
        fish: prev.fish - cost.fish,
        pearls: prev.pearls - cost.pearls,
        upgrades: newUpgrades
      };
    });
  };

  const changeZone = (zoneIndex) => {
    setGameState(prev => {
      if (zoneIndex >= prev.upgrades.depthLanterns.zonesUnlocked || zoneIndex < 0) {
        return prev;
      }
      
      return {
        ...prev,
        currentZone: zoneIndex
      };
    });
  };

  const setScreen = (screen) => {
    setGameState(prev => ({
      ...prev,
      currentScreen: screen
    }));
  };

  const calculateUpgradeCost = (upgradeType, currentLevel) => {
    const baseCosts = {
      nets: { fish: 10, pearls: 0 },
      pearlOysters: { fish: 50, pearls: 0 },
      depthLanterns: { fish: 100, pearls: 5 },
      boat: { fish: 200, pearls: 2 },
      oceanSpirit: { fish: 500, pearls: 10 }
    };
    
    const base = baseCosts[upgradeType];
    const multiplier = Math.pow(1.5, currentLevel);
    
    return {
      fish: Math.floor(base.fish * multiplier),
      pearls: Math.floor(base.pearls * multiplier)
    };
  };

  const calculateOfflineReward = (state, timeOffline) => {
    const hoursOffline = timeOffline / (1000 * 60 * 60);
    const { boat, oceanSpirit } = state.upgrades;
    const baseIncome = Math.floor(boat.level * 0.5 + 1);
    const cyclesOffline = Math.floor(timeOffline / boat.idleSpeed);
    
    return {
      fish: Math.floor(cyclesOffline * baseIncome * oceanSpirit.multiplier * 0.5), // 50% efficiency offline
      pearls: Math.floor(hoursOffline * state.upgrades.pearlOysters.pearlChance * 0.01)
    };
  };

  const value = {
    gameState,
    zones,
    events,
    clickFish,
    purchaseUpgrade,
    changeZone,
    setScreen,
    calculateUpgradeCost
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

window.GameStateProvider = GameStateProvider;
window.useGameState = useGameState;
window.useGameState = useGameState;