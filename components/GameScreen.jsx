import React, { useState, useEffect } from 'react';

function GameScreen() {
  const { gameState, zones, clickFish, changeZone, setScreen } = window.useGameState();
  const [fishAnimation, setFishAnimation] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const currentZone = zones[gameState.currentZone];
  
  const handleFishingClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    
    setFishAnimation(true);
    clickFish();
    
    // Play click sound effect
    if (gameState.settings.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeDzOHze3WgyMFl2+z2+TJhNzagRkA');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    
    setTimeout(() => setFishAnimation(false), 1000);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'М';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'К';
    return num.toString();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Ocean */}
      <div 
        className="absolute inset-0 ocean-waves transition-colors duration-1000"
        style={{ backgroundColor: currentZone.color }}
      >
        {/* Depth layers */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-8 depth-indicator"
              style={{
                bottom: `${i * 20}%`,
                backgroundColor: `rgba(25, 25, 112, ${0.1 + i * 0.1})`
              }}
            />
          ))}
        </div>
      </div>

      {/* Event Overlay */}
      {gameState.activeEvent && (
        <div className="absolute inset-0 z-10">
          {gameState.activeEvent.name === 'Шторм' && (
            <div className="absolute inset-0 bg-gray-800 storm-effect opacity-50" />
          )}
          {gameState.activeEvent.name === 'Свет медуз' && (
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 bg-pink-300 rounded-full jellyfish-effect opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-50 p-3">
        <div className="flex justify-between items-center text-white pixel-font">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-cyan-300">🐟</span>
              <span>{formatNumber(gameState.fish)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-pink-300">○</span>
              <span>{formatNumber(gameState.pearls)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-300">⚡</span>
              <span>{gameState.energy}/100</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-cyan-300">{currentZone.name}</div>
            {gameState.activeEvent && (
              <div className="text-xs text-yellow-300">
                {gameState.activeEvent.name} {formatTime(gameState.eventTimeRemaining)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone Selection */}
      <div className="absolute top-16 left-2 z-20">
        <div className="bg-black bg-opacity-70 rounded p-2">
          {zones.slice(0, gameState.upgrades.depthLanterns.zonesUnlocked).map((zone, index) => (
            <button
              key={index}
              onClick={() => changeZone(index)}
              className={`block w-full text-left px-2 py-1 mb-1 text-xs pixel-font rounded transition-colors ${
                index === gameState.currentZone 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-cyan-300 hover:bg-cyan-700'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fishing Area */}
      <div 
        className="absolute inset-x-4 bottom-32 top-32 cursor-pointer fish-area"
        onClick={handleFishingClick}
      >
        {/* Boat */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 boat-floating">
          <div className="relative">
            {/* Boat sprite */}
            <div className="w-16 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-lg relative border-2 border-amber-900">
              <div className="absolute top-0 left-2 w-2 h-6 bg-amber-500 rounded-t"></div>
              <div className="absolute top-0 right-2 w-2 h-6 bg-amber-500 rounded-t"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-brown-600"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <div className="w-6 h-4 bg-white rounded border border-gray-400 pixel-glow"></div>
              </div>
            </div>
            
            {/* Fishing nets */}
            <div className="absolute -bottom-4 -left-2 w-8 h-6 border-2 border-cyan-300 rounded-b-full opacity-70">
              <div className="w-full h-full bg-gradient-to-b from-transparent to-cyan-300 opacity-30 rounded-b-full"></div>
            </div>
            <div className="absolute -bottom-4 -right-2 w-8 h-6 border-2 border-cyan-300 rounded-b-full opacity-70">
              <div className="w-full h-full bg-gradient-to-b from-transparent to-cyan-300 opacity-30 rounded-b-full"></div>
            </div>
          </div>
        </div>

        {/* Click Effect */}
        {fishAnimation && (
          <div 
            className="absolute pointer-events-none fish-caught z-30"
            style={{ 
              left: clickPosition.x - 12, 
              top: clickPosition.y - 12 
            }}
          >
            <div className="w-6 h-4 bg-gradient-to-r from-silver to-gray-300 rounded-full border border-gray-400">
              <div className="w-1 h-1 bg-black rounded-full absolute top-1 left-4"></div>
              <div className="w-2 h-3 bg-cyan-300 absolute -right-1 top-0.5 opacity-60 rounded-r"></div>
            </div>
          </div>
        )}

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-60 animate-ping"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Offline Reward Modal */}
      {gameState.stats.timeOffline > 60000 && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gradient-to-b from-blue-900 to-blue-800 p-6 rounded border-2 border-cyan-300 max-w-sm mx-4">
            <h3 className="pixel-font text-lg text-cyan-300 mb-4 text-center">
              Пока вас не было...
            </h3>
            <div className="text-white pixel-font text-center space-y-2">
              <p>Время офлайн: {Math.floor(gameState.stats.timeOffline / (1000 * 60))} мин</p>
              <p>Рыба поймана: +{Math.floor(gameState.stats.timeOffline / 10000)} 🐟</p>
              <p>Жемчуг найден: +{Math.floor(gameState.stats.timeOffline / 100000)} ○</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-4 retro-button pixel-font text-white py-2 rounded"
            >
              Забрать награду
            </button>
          </div>
        </div>
      )}

      {/* Event Notification */}
      {gameState.activeEvent && gameState.eventTimeRemaining > gameState.activeEvent.duration - 3000 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-black bg-opacity-90 p-4 rounded border-2 border-yellow-400 animate-pulse">
            <div className="pixel-font text-yellow-300 text-center">
              <div className="text-lg font-bold mb-2">{gameState.activeEvent.name}</div>
              <div className="text-sm">{gameState.activeEvent.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-70 p-3">
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setScreen('upgrades')}
            className="retro-button px-4 py-2 pixel-font text-white text-sm rounded"
          >
            Апгрейды
          </button>
          <button 
            onClick={() => setScreen('inventory')}
            className="retro-button px-4 py-2 pixel-font text-white text-sm rounded"
          >
            Инвентарь
          </button>
          <button 
            onClick={() => setScreen('menu')}
            className="retro-button px-4 py-2 pixel-font text-white text-sm rounded"
          >
            Меню
          </button>
        </div>
      </div>

      {/* Depth meter */}
      <div className="absolute right-2 top-20 bottom-20 w-8 z-20">
        <div className="h-full bg-black bg-opacity-50 rounded relative">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-b transition-all duration-1000"
            style={{ height: `${(gameState.currentZone + 1) * 25}%` }}
          >
            <div className="absolute top-1 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          </div>
          <div className="absolute top-1 left-1 right-1 text-xs pixel-font text-white text-center">
            {gameState.currentZone + 1}
          </div>
        </div>
      </div>
    </div>
  );
}

window.GameScreen = GameScreen;