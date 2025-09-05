import React from 'react';

function InventoryScreen() {
  const { gameState, setScreen } = window.useGameState();

  const inventoryItems = [
    {
      key: 'commonFish',
      name: 'Серебристая плотва',
      description: 'Обычная рыба тихих вод',
      icon: '🐟',
      rarity: 'common',
      value: 1
    },
    {
      key: 'rareFish',
      name: 'Золотая макрель',
      description: 'Редкая рыба рифовых глубин',
      icon: '🐠',
      rarity: 'rare',
      value: 10
    },
    {
      key: 'legendaryFish',
      name: 'Дракон морских глубин',
      description: 'Легендарное создание бездны',
      icon: '🐉',
      rarity: 'legendary',
      value: 100
    },
    {
      key: 'corals',
      name: 'Перламутровый коралл',
      description: 'Живой коралл с рифов',
      icon: '🪸',
      rarity: 'rare',
      value: 5
    },
    {
      key: 'seashells',
      name: 'Раковина русалки',
      description: 'Шепчет песни глубин',
      icon: '🐚',
      rarity: 'common',
      value: 2
    }
  ];

  const rarityColors = {
    common: 'text-gray-300 border-gray-500',
    rare: 'text-blue-300 border-blue-500',
    legendary: 'text-yellow-300 border-yellow-500'
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'М';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'К';
    return num.toString();
  };

  const getTotalValue = () => {
    return inventoryItems.reduce((total, item) => {
      const count = gameState.inventory[item.key] || 0;
      return total + (count * item.value);
    }, 0);
  };

  const sellAll = () => {
    // This would need to be implemented in the game state
    console.log('Selling all items for', getTotalValue(), 'fish');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden">
      {/* Header */}
      <div className="bg-black bg-opacity-50 p-4 border-b-2 border-cyan-300">
        <div className="flex items-center justify-between">
          <h1 className="pixel-font text-2xl text-cyan-300">ИНВЕНТАРЬ</h1>
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
          <div className="flex items-center space-x-1">
            <span className="text-yellow-300">💎</span>
            <span>{formatNumber(gameState.artifacts)}</span>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {inventoryItems.map((item) => {
            const count = gameState.inventory[item.key] || 0;
            const totalValue = count * item.value;

            return (
              <div
                key={item.key}
                className={`bg-black bg-opacity-40 border-2 rounded p-4 transition-all duration-200 ${
                  count > 0 ? `${rarityColors[item.rarity]} pixel-glow` : 'border-gray-700 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="pixel-font text-lg text-white mb-2">{item.name}</h3>
                  <p className="pixel-font text-xs text-gray-400 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="bg-gray-800 bg-opacity-50 rounded p-2">
                      <div className="pixel-font text-sm">
                        <div className="text-gray-400">Количество:</div>
                        <div className="text-cyan-300 text-lg font-bold">
                          {formatNumber(count)}
                        </div>
                      </div>
                    </div>
                    
                    {count > 0 && (
                      <div className="bg-gray-800 bg-opacity-50 rounded p-2">
                        <div className="pixel-font text-sm">
                          <div className="text-gray-400">Общая ценность:</div>
                          <div className="text-yellow-300">
                            🐟 {formatNumber(totalValue)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gray-800 bg-opacity-50 rounded p-2">
                      <div className="pixel-font text-xs">
                        <div className="text-gray-400">Редкость:</div>
                        <div className={rarityColors[item.rarity].split(' ')[0]}>
                          {item.rarity === 'common' && 'Обычная'}
                          {item.rarity === 'rare' && 'Редкая'}
                          {item.rarity === 'legendary' && 'Легендарная'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Haiku Achievement Examples */}
        <div className="bg-black bg-opacity-40 border-2 border-purple-500 rounded p-4 mb-4">
          <h3 className="pixel-font text-lg text-purple-300 mb-3 text-center">
            🏆 Достижения в стиле хайку
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 bg-opacity-50 rounded p-3">
              <div className="pixel-font text-sm text-cyan-300 mb-2">
                Поймано 100 рыб
              </div>
              <div className="pixel-font text-xs text-gray-300 italic leading-relaxed">
                "Тишина под ветром спит.<br/>
                Лодка качнулась.<br/>
                Сто рыб в сетях."
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded p-3">
              <div className="pixel-font text-sm text-pink-300 mb-2">
                Найден первый жемчуг
              </div>
              <div className="pixel-font text-xs text-gray-300 italic leading-relaxed">
                "Морская слеза.<br/>
                Свет в темноте глубины.<br/>
                Тайна хранится."
              </div>
            </div>
          </div>
        </div>

        {/* Encyclopedia Section */}
        <div className="bg-black bg-opacity-40 border-2 border-green-500 rounded p-4">
          <h3 className="pixel-font text-lg text-green-300 mb-3 text-center">
            📚 Энциклопедия океана
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-800 bg-opacity-50 rounded p-3">
              <div className="pixel-font text-sm text-yellow-300 mb-1">🐟 О рыбах</div>
              <div className="pixel-font text-xs text-gray-300">
                "В тихих водах плещутся серебристые души океана, каждая несет свою песню."
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded p-3">
              <div className="pixel-font text-sm text-pink-300 mb-1">○ О жемчуге</div>
              <div className="pixel-font text-xs text-gray-300">
                "Слезы моря, застывшие в раковинах. Хранят память о штормах и тишине."
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded p-3">
              <div className="pixel-font text-sm text-purple-300 mb-1">🌊 О глубинах</div>
              <div className="pixel-font text-xs text-gray-300">
                "Чем глубже опускаешься, тем яснее слышишь сердцебиение океана."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-black bg-opacity-50 p-4 border-t-2 border-cyan-300">
        <div className="flex justify-between items-center">
          <div className="pixel-font text-white">
            <div className="text-sm text-gray-300">Общая ценность инвентаря:</div>
            <div className="text-lg">🐟 {formatNumber(getTotalValue())}</div>
          </div>
          
          <button
            onClick={sellAll}
            disabled={getTotalValue() === 0}
            className={`px-6 py-3 pixel-font rounded transition-all ${
              getTotalValue() > 0
                ? 'retro-button text-white hover:transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Продать всё
          </button>
        </div>
      </div>
    </div>
  );
}

window.InventoryScreen = InventoryScreen;