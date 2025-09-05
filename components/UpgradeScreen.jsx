import React from 'react';

function UpgradeScreen() {
  const { gameState, setScreen, purchaseUpgrade, calculateUpgradeCost } = window.useGameState();

  const upgrades = [
    {
      key: 'nets',
      name: 'Сети',
      description: 'Увеличивают рыбу за клик',
      icon: '🕸️',
      currentEffect: `+${gameState.upgrades.nets.fishPerClick} рыбы/клик`,
      nextEffect: `+${gameState.upgrades.nets.level + 1} рыбы/клик`
    },
    {
      key: 'pearlOysters',
      name: 'Жемчужные устрицы',
      description: 'Шанс найти жемчуг',
      icon: '🦪',
      currentEffect: `${gameState.upgrades.pearlOysters.pearlChance}% шанс жемчуга`,
      nextEffect: `${(gameState.upgrades.pearlOysters.level + 1) * 2}% шанс жемчуга`
    },
    {
      key: 'depthLanterns',
      name: 'Фонари глубины',
      description: 'Открывают новые зоны',
      icon: '🏮',
      currentEffect: `${gameState.upgrades.depthLanterns.zonesUnlocked} зон открыто`,
      nextEffect: `${Math.min(gameState.upgrades.depthLanterns.level + 2, 4)} зон открыто`
    },
    {
      key: 'boat',
      name: 'Лодка',
      description: 'Увеличивает автодоход',
      icon: '⛵',
      currentEffect: `${gameState.upgrades.boat.capacity} вместимость`,
      nextEffect: `${gameState.upgrades.boat.capacity + 25} вместимость`
    },
    {
      key: 'oceanSpirit',
      name: 'Дух океана',
      description: 'Множитель всей прибыли',
      icon: '🌊',
      currentEffect: `x${gameState.upgrades.oceanSpirit.multiplier.toFixed(1)} множитель`,
      nextEffect: `x${(1 + ((gameState.upgrades.oceanSpirit.level + 1) * 0.1)).toFixed(1)} множитель`
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'М';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'К';
    return num.toString();
  };

  const canAfford = (cost) => {
    return gameState.fish >= cost.fish && gameState.pearls >= cost.pearls;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden">
      {/* Header */}
      <div className="bg-black bg-opacity-50 p-4 border-b-2 border-cyan-300">
        <div className="flex items-center justify-between">
          <h1 className="pixel-font text-2xl text-cyan-300">АПГРЕЙДЫ</h1>
          <button
            onClick={() => setScreen('game')}
            className="retro-button px-4 py-2 pixel-font text-white text-sm rounded"
          >
            Назад
          </button>
        </div>
        
        {/* Resources */}
        <div className="flex space-x-6 mt-3 text-white pixel-font">
          <div className="flex items-center space-x-1">
            <span className="text-cyan-300">🐟</span>
            <span>{formatNumber(gameState.fish)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-pink-300">○</span>
            <span>{formatNumber(gameState.pearls)}</span>
          </div>
        </div>
      </div>

      {/* Upgrades List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {upgrades.map((upgrade) => {
          const cost = calculateUpgradeCost(upgrade.key, gameState.upgrades[upgrade.key].level);
          const affordable = canAfford(cost);
          const maxLevel = upgrade.key === 'depthLanterns' && gameState.upgrades[upgrade.key].level >= 3;

          return (
            <div
              key={upgrade.key}
              className={`bg-black bg-opacity-40 border-2 rounded p-4 transition-all duration-200 ${
                affordable && !maxLevel
                  ? 'border-cyan-300 pixel-glow hover:bg-opacity-60' 
                  : 'border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="text-3xl">{upgrade.icon}</div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="pixel-font text-lg text-white">
                      {upgrade.name} Lv.{gameState.upgrades[upgrade.key].level}
                    </h3>
                    {!maxLevel && (
                      <div className="text-right pixel-font text-sm">
                        {cost.fish > 0 && (
                          <div className={cost.fish <= gameState.fish ? 'text-cyan-300' : 'text-red-400'}>
                            🐟 {formatNumber(cost.fish)}
                          </div>
                        )}
                        {cost.pearls > 0 && (
                          <div className={cost.pearls <= gameState.pearls ? 'text-pink-300' : 'text-red-400'}>
                            ○ {formatNumber(cost.pearls)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="pixel-font text-sm text-gray-300 mb-3">
                    {upgrade.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pixel-font">
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                      <div className="text-gray-400 text-xs">Текущий эффект:</div>
                      <div className="text-cyan-300">{upgrade.currentEffect}</div>
                    </div>
                    
                    {!maxLevel && (
                      <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                        <div className="text-gray-400 text-xs">Следующий уровень:</div>
                        <div className="text-yellow-300">{upgrade.nextEffect}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Purchase Button */}
                <div className="flex flex-col justify-center">
                  {maxLevel ? (
                    <div className="px-4 py-2 bg-gray-600 rounded pixel-font text-gray-300 text-sm">
                      МАКС
                    </div>
                  ) : (
                    <button
                      onClick={() => affordable && purchaseUpgrade(upgrade.key)}
                      disabled={!affordable}
                      className={`px-4 py-2 pixel-font text-sm rounded transition-all ${
                        affordable
                          ? 'retro-button text-white hover:transform hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {affordable ? 'КУПИТЬ' : 'НЕДОСТАТОЧНО'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Progress */}
      <div className="bg-black bg-opacity-50 p-4 border-t-2 border-cyan-300">
        <div className="pixel-font text-white text-center">
          <div className="text-sm text-gray-300 mb-2">Общий прогресс</div>
          <div className="flex justify-center space-x-4 text-sm">
            <span>🐟 Поймано: {formatNumber(gameState.stats.totalFishCaught)}</span>
            <span>👆 Кликов: {formatNumber(gameState.stats.totalClicks)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.UpgradeScreen = UpgradeScreen;