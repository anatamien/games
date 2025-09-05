import React, { useState } from 'react';

function MenuScreen() {
  const { gameState, setScreen } = window.useGameState();
  const [activeTab, setActiveTab] = useState('settings');

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'М';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'К';
    return num.toString();
  };

  const resetGame = () => {
    if (confirm('Вы уверены, что хотите начать заново? Весь прогресс будет потерян.')) {
      localStorage.removeItem('quiet-depths-save');
      window.location.reload();
    }
  };

  const exportSave = () => {
    const saveData = localStorage.getItem('quiet-depths-save');
    if (saveData) {
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiet-depths-save.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importSave = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const saveData = JSON.parse(e.target.result);
            localStorage.setItem('quiet-depths-save', JSON.stringify(saveData));
            window.location.reload();
          } catch (error) {
            alert('Ошибка при загрузке сохранения.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tabs = [
    { key: 'settings', name: 'Настройки', icon: '⚙️' },
    { key: 'stats', name: 'Статистика', icon: '📊' },
    { key: 'achievements', name: 'Достижения', icon: '🏆' },
    { key: 'about', name: 'Об игре', icon: 'ℹ️' }
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden">
      {/* Header */}
      <div className="bg-black bg-opacity-50 p-4 border-b-2 border-cyan-300">
        <div className="flex items-center justify-between">
          <h1 className="pixel-font text-2xl text-cyan-300">МЕНЮ</h1>
          <button
            onClick={() => setScreen('game')}
            className="retro-button px-4 py-2 pixel-font text-white text-sm rounded"
          >
            Назад
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black bg-opacity-30 border-b border-cyan-300">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-3 pixel-font text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'text-cyan-300 bg-cyan-900 bg-opacity-50 border-b-2 border-cyan-300'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-black bg-opacity-40 border-2 border-cyan-300 rounded p-4">
              <h3 className="pixel-font text-lg text-cyan-300 mb-4">🔊 Звук и музыка</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="pixel-font text-white">Звуковые эффекты</span>
                  <button
                    className={`px-4 py-2 pixel-font text-sm rounded transition-all ${
                      gameState.settings.soundEnabled
                        ? 'retro-button text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {gameState.settings.soundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="pixel-font text-white">Фоновая музыка</span>
                  <button
                    className={`px-4 py-2 pixel-font text-sm rounded transition-all ${
                      gameState.settings.musicEnabled
                        ? 'retro-button text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {gameState.settings.musicEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 border-2 border-cyan-300 rounded p-4">
              <h3 className="pixel-font text-lg text-cyan-300 mb-4">💾 Сохранения</h3>
              <div className="space-y-3">
                <button
                  onClick={exportSave}
                  className="w-full retro-button px-4 py-3 pixel-font text-white rounded"
                >
                  Экспорт сохранения
                </button>
                
                <button
                  onClick={importSave}
                  className="w-full retro-button px-4 py-3 pixel-font text-white rounded"
                >
                  Импорт сохранения
                </button>
                
                <button
                  onClick={resetGame}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 pixel-font text-white rounded transition-all"
                >
                  Начать заново
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-black bg-opacity-40 border-2 border-cyan-300 rounded p-4">
              <h3 className="pixel-font text-lg text-cyan-300 mb-4">📈 Общая статистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Рыбы поймано</div>
                  <div className="pixel-font text-xl text-cyan-300">
                    🐟 {formatNumber(gameState.stats.totalFishCaught)}
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Всего кликов</div>
                  <div className="pixel-font text-xl text-pink-300">
                    👆 {formatNumber(gameState.stats.totalClicks)}
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Время в игре</div>
                  <div className="pixel-font text-xl text-yellow-300">
                    ⏱️ {formatTime(Date.now() - gameState.stats.gameStartTime)}
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Текущая зона</div>
                  <div className="pixel-font text-xl text-purple-300">
                    🌊 Зона {gameState.currentZone + 1}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 border-2 border-cyan-300 rounded p-4">
              <h3 className="pixel-font text-lg text-cyan-300 mb-4">🎯 Эффективность</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Рыбы за клик</div>
                  <div className="pixel-font text-lg text-cyan-300">
                    {gameState.upgrades.nets.fishPerClick} рыб/клик
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Автодоход</div>
                  <div className="pixel-font text-lg text-green-300">
                    Каждые {(gameState.upgrades.boat.idleSpeed / 1000).toFixed(1)}с
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-gray-400">Шанс жемчуга</div>
                  <div className="pixel-font text-lg text-pink-300">
                    {gameState.upgrades.pearlOysters.pearlChance}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="bg-black bg-opacity-40 border-2 border-yellow-300 rounded p-4">
              <h3 className="pixel-font text-lg text-yellow-300 mb-4">🏆 Хайку достижений</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 bg-opacity-50 rounded p-4 border-l-4 border-cyan-300">
                  <div className="pixel-font text-sm text-cyan-300 mb-2">Первые шаги</div>
                  <div className="pixel-font text-xs text-gray-300 italic leading-relaxed">
                    "Первая рыба поймана.<br/>
                    Сети коснулись воды.<br/>
                    Путь начинается."
                  </div>
                  <div className="pixel-font text-xs text-green-400 mt-2">
                    ✓ Поймать первую рыбу
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded p-4 border-l-4 border-pink-300">
                  <div className="pixel-font text-sm text-pink-300 mb-2">Сокровище океана</div>
                  <div className="pixel-font text-xs text-gray-300 italic leading-relaxed">
                    "Жемчужина в руках.<br/>
                    Море отдало тайну.<br/>
                    Свет в глубине сердца."
                  </div>
                  <div className="pixel-font text-xs text-green-400 mt-2">
                    ✓ Найти первый жемчуг
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded p-4 border-l-4 border-gray-500 opacity-60">
                  <div className="pixel-font text-sm text-gray-400 mb-2">Мастер глубин</div>
                  <div className="pixel-font text-xs text-gray-400 italic leading-relaxed">
                    "Тысяча рыб поймана.<br/>
                    Океан знает твоё имя.<br/>
                    Мудрость приходит."
                  </div>
                  <div className="pixel-font text-xs text-red-400 mt-2">
                    ⚬ Поймать 1000 рыб ({gameState.stats.totalFishCaught}/1000)
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded p-4 border-l-4 border-gray-500 opacity-60">
                  <div className="pixel-font text-sm text-gray-400 mb-2">Покоритель бездны</div>
                  <div className="pixel-font text-xs text-gray-400 italic leading-relaxed">
                    "В молчании бездны<br/>
                    находишь свой голос.<br/>
                    Тишина говорит."
                  </div>
                  <div className="pixel-font text-xs text-red-400 mt-2">
                    ⚬ Достичь 4-й зоны
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="bg-black bg-opacity-40 border-2 border-purple-300 rounded p-4">
              <h3 className="pixel-font text-lg text-purple-300 mb-4">🌊 Тихая глубина</h3>
              <div className="space-y-4 pixel-font text-sm text-gray-300 leading-relaxed">
                <p>
                  Медитативный idle-кликер в стиле японского ретро. 
                  Погрузитесь в мир спокойной рыбалки и созерцания.
                </p>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <h4 className="text-cyan-300 mb-2">🎯 Как играть</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Кликайте по морю, чтобы ловить рыбу</li>
                    <li>• Улучшайте снаряжение для большего дохода</li>
                    <li>• Открывайте новые зоны с редкими находками</li>
                    <li>• Наслаждайтесь спокойным геймплеем</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <h4 className="text-pink-300 mb-2">🎨 Особенности</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Пиксельная графика в японском стиле</li>
                    <li>• Lo-fi ambient саундтрек</li>
                    <li>• Система достижений в виде хайку</li>
                    <li>• Оффлайн прогресс до 8 часов</li>
                  </ul>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <h4 className="text-yellow-300 mb-2">💝 Философия игры</h4>
                  <p className="text-xs italic">
                    "Это не гонка и не сражение. Это игра-медитация, 
                    маленький японский аквариум в кармане. 
                    Простота, чистота и ритм волн."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 border-2 border-green-300 rounded p-4">
              <h3 className="pixel-font text-lg text-green-300 mb-4">🏮 Зоны океана</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-cyan-300">🌊 Тихая отмель</div>
                  <div className="pixel-font text-xs text-gray-400">
                    "Спокойные воды. Здесь начинается путь."
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-blue-300">🪸 Песнь рифов</div>
                  <div className="pixel-font text-xs text-gray-400">
                    "Кораллы шепчут древние тайны."
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-pink-300">🌙 Свет медуз</div>
                  <div className="pixel-font text-xs text-gray-400">
                    "Медузы светятся в глубине."
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded p-3">
                  <div className="pixel-font text-sm text-purple-300">🕳️ Молчаливая бездна</div>
                  <div className="pixel-font text-xs text-gray-400">
                    "Где молчание становится мудростью."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.MenuScreen = MenuScreen;