import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Server {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  ping: number;
  mode: string;
  online: boolean;
}

const mockServers: Server[] = [
  { id: '1', name: 'nursultan Official #1', players: 47, maxPlayers: 100, ping: 12, mode: 'Survival', online: true },
  { id: '2', name: 'nursultan PvP Arena', players: 89, maxPlayers: 100, ping: 18, mode: 'PvP', online: true },
  { id: '3', name: 'nursultan Creative', players: 23, maxPlayers: 50, ping: 25, mode: 'Creative', online: true },
  { id: '4', name: 'nursultan SkyBlock', players: 34, maxPlayers: 60, ping: 31, mode: 'SkyBlock', online: true },
  { id: '5', name: 'Private Server', players: 5, maxPlayers: 20, ping: 8, mode: 'Survival', online: true },
];

export default function Multiplayer() {
  const [servers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [serverAddress, setServerAddress] = useState('');
  const [playerName, setPlayerName] = useState('nursultan');

  const handleJoinServer = (server: Server) => {
    toast.success(`Подключение к ${server.name}...`, {
      description: `Режим: ${server.mode} | Игроков: ${server.players}/${server.maxPlayers}`,
      duration: 3000
    });
    setSelectedServer(server.id);
    setTimeout(() => {
      toast.info('Загрузка мира...', { duration: 2000 });
    }, 1500);
  };

  const handleDirectConnect = () => {
    if (!serverAddress) {
      toast.error('Введите адрес сервера!');
      return;
    }
    toast.success(`Подключение к ${serverAddress}...`, {
      description: `Имя игрока: ${playerName}`,
      duration: 3000
    });
  };

  const getPingColor = (ping: number) => {
    if (ping < 20) return 'text-green-500';
    if (ping < 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPlayerColor = (players: number, maxPlayers: number) => {
    const ratio = players / maxPlayers;
    if (ratio < 0.5) return 'text-green-600';
    if (ratio < 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-500 mb-2 flex items-center gap-3">
              <Icon name="Globe" size={36} />
              Игра по сети
            </h1>
            <p className="text-gray-400">Выберите сервер или подключитесь напрямую</p>
          </div>
          <Badge className="bg-green-600 text-lg px-4 py-2">
            <Icon name="Wifi" size={18} className="mr-2" />
            Online
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Server" size={24} className="text-blue-500" />
                Доступные серверы
              </h2>

              <div className="space-y-3">
                {servers.map(server => (
                  <Card 
                    key={server.id}
                    className={`p-4 bg-gray-900/50 border-2 transition-all cursor-pointer hover:bg-gray-900/70 ${
                      selectedServer === server.id ? 'border-blue-500 bg-gray-900/70' : 'border-gray-700'
                    }`}
                    onClick={() => setSelectedServer(server.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${server.online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                          <h3 className="text-lg font-bold text-white">{server.name}</h3>
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {server.mode}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="Users" size={16} className="text-gray-400" />
                            <span className={`font-bold ${getPlayerColor(server.players, server.maxPlayers)}`}>
                              {server.players}/{server.maxPlayers}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Icon name="Activity" size={16} className="text-gray-400" />
                            <span className={`font-bold ${getPingColor(server.ping)}`}>
                              {server.ping}ms
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinServer(server);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Icon name="Play" size={18} className="mr-2" />
                        Играть
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Link" size={24} className="text-green-500" />
                Прямое подключение
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Адрес сервера</label>
                  <Input
                    placeholder="play.nursultan.net:25565"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Имя игрока</label>
                  <Input
                    placeholder="Ваше имя"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white"
                  />
                </div>

                <Button 
                  onClick={handleDirectConnect}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Подключиться
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Users" size={24} className="text-purple-500" />
                Друзья онлайн
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Steve_2024', server: 'PvP Arena', status: 'online' },
                  { name: 'Alex_Pro', server: 'Creative', status: 'online' },
                  { name: 'Herobrine', server: 'Survival', status: 'away' },
                ].map((friend, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-white font-medium">{friend.name}</p>
                        <p className="text-xs text-gray-400">{friend.server}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-400">
                      <Icon name="UserPlus" size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Пригласить друзей
              </Button>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={24} className="text-yellow-500" />
                Рейтинг
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ваш ранг:</span>
                  <Badge className="bg-yellow-600">Золото III</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Очки:</span>
                  <span className="text-white font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Позиция:</span>
                  <span className="text-blue-400 font-bold">#423</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Icon name="BarChart" size={18} className="mr-2" />
                Таблица лидеров
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 border-0">
              <div className="text-center text-white">
                <Icon name="Crown" size={32} className="mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-2">Premium</h3>
                <p className="text-sm text-white/90 mb-4">
                  Создавай свои серверы и получи эксклюзивные скины!
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Подробнее
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
