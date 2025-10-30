import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface World {
  id: string;
  name: string;
  mode: 'Survival' | 'Creative' | 'Hardcore';
  lastPlayed: string;
  size: string;
  version: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [showWorldsDialog, setShowWorldsDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [worlds, setWorlds] = useState<World[]>([
    { id: '1', name: 'Мой мир', mode: 'Survival', lastPlayed: '5 минут назад', size: '24 МБ', version: '1.20.1' },
    { id: '2', name: 'Творческий', mode: 'Creative', lastPlayed: '2 часа назад', size: '18 МБ', version: '1.20.1' },
    { id: '3', name: 'Хардкор', mode: 'Hardcore', lastPlayed: '1 день назад', size: '45 МБ', version: '1.20.1' },
  ]);
  const [newWorldName, setNewWorldName] = useState('Новый мир');
  const [selectedMode, setSelectedMode] = useState<'Survival' | 'Creative' | 'Hardcore'>('Survival');

  const handlePlayWorld = (world: World) => {
    toast.success(`Загрузка мира "${world.name}"...`, { duration: 2000 });
    setTimeout(() => {
      navigate('/game');
    }, 1000);
  };

  const handleCreateWorld = () => {
    const newWorld: World = {
      id: Date.now().toString(),
      name: newWorldName,
      mode: selectedMode,
      lastPlayed: 'Только что',
      size: '0 МБ',
      version: '1.20.1'
    };
    setWorlds([newWorld, ...worlds]);
    toast.success(`Мир "${newWorldName}" создан!`);
    setShowCreateDialog(false);
    setNewWorldName('Новый мир');
    setTimeout(() => {
      handlePlayWorld(newWorld);
    }, 500);
  };

  const handleDeleteWorld = (worldId: string) => {
    setWorlds(worlds.filter(w => w.id !== worldId));
    toast.info('Мир удалён');
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Survival': return 'bg-green-600';
      case 'Creative': return 'bg-blue-600';
      case 'Hardcore': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Survival': return 'Sword';
      case 'Creative': return 'Sparkles';
      case 'Hardcore': return 'Skull';
      default: return 'Globe';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-8xl font-bold text-blue-500 mb-4 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse">
          nursultan
        </h1>
        <p className="text-blue-400 text-xl mb-12">Minecraft Premium Client</p>

        <div className="space-y-4 max-w-md mx-auto">
          <Button 
            size="lg"
            className="w-full h-14 text-xl bg-green-600 hover:bg-green-700"
            onClick={() => setShowWorldsDialog(true)}
          >
            <Icon name="Play" size={24} className="mr-2" />
            Играть
          </Button>

          <Button 
            size="lg"
            className="w-full h-14 text-xl bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/multiplayer')}
          >
            <Icon name="Globe" size={24} className="mr-2" />
            Игра по сети
          </Button>

          <Button 
            size="lg"
            className="w-full h-14 text-xl bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/settings')}
          >
            <Icon name="Settings" size={24} className="mr-2" />
            Настройки
          </Button>

          <Button 
            size="lg"
            variant="outline"
            className="w-full h-14 text-xl border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => toast.info('До встречи! 👋')}
          >
            <Icon name="LogOut" size={24} className="mr-2" />
            Выход
          </Button>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>nursultan client v1.0.0</p>
          <p>Minecraft 1.20.1</p>
        </div>
      </div>

      <Dialog open={showWorldsDialog} onOpenChange={setShowWorldsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <Icon name="Globe" size={32} className="text-blue-500" />
              Выбор мира
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Button 
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
              onClick={() => {
                setShowWorldsDialog(false);
                setShowCreateDialog(true);
              }}
            >
              <Icon name="Plus" size={24} className="mr-2" />
              Создать новый мир
            </Button>

            <div className="space-y-3">
              {worlds.map(world => (
                <Card key={world.id} className="p-4 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded flex items-center justify-center">
                        <Icon name={getModeIcon(world.mode) as any} size={32} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{world.name}</h3>
                          <Badge className={getModeColor(world.mode)}>
                            {world.mode}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {world.lastPlayed}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" size={14} />
                            {world.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Info" size={14} />
                            {world.version}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handlePlayWorld(world)}
                      >
                        <Icon name="Play" size={20} className="mr-2" />
                        Играть
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-700"
                      >
                        <Icon name="Settings" size={20} />
                      </Button>
                      <Button 
                        size="lg"
                        variant="destructive"
                        onClick={() => handleDeleteWorld(world.id)}
                      >
                        <Icon name="Trash2" size={20} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Icon name="Plus" size={28} className="text-green-500" />
              Создать новый мир
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <label className="text-white font-medium mb-2 block">Название мира</label>
              <Input
                value={newWorldName}
                onChange={(e) => setNewWorldName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white h-12 text-lg"
                placeholder="Мой новый мир"
              />
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Режим игры</label>
              <div className="grid grid-cols-3 gap-3">
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMode === 'Survival'
                      ? 'bg-green-600 border-green-400'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedMode('Survival')}
                >
                  <div className="text-center">
                    <Icon name="Sword" size={32} className="text-white mx-auto mb-2" />
                    <h4 className="text-white font-bold">Выживание</h4>
                    <p className="text-xs text-gray-300 mt-1">Добывай ресурсы и строй</p>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMode === 'Creative'
                      ? 'bg-blue-600 border-blue-400'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedMode('Creative')}
                >
                  <div className="text-center">
                    <Icon name="Sparkles" size={32} className="text-white mx-auto mb-2" />
                    <h4 className="text-white font-bold">Творчество</h4>
                    <p className="text-xs text-gray-300 mt-1">Безлимитные ресурсы</p>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMode === 'Hardcore'
                      ? 'bg-red-600 border-red-400'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedMode('Hardcore')}
                >
                  <div className="text-center">
                    <Icon name="Skull" size={32} className="text-white mx-auto mb-2" />
                    <h4 className="text-white font-bold">Хардкор</h4>
                    <p className="text-xs text-gray-300 mt-1">Одна жизнь</p>
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                onClick={handleCreateWorld}
              >
                <Icon name="Check" size={20} className="mr-2" />
                Создать мир
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-gray-600 hover:bg-gray-800 h-12"
                onClick={() => setShowCreateDialog(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
