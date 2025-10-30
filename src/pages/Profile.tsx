import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <Icon name="User" size={36} />
          Профиль
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 p-6 bg-gray-800/50 border-gray-700">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-blue-500">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-3xl bg-blue-600 text-white">NS</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-white mb-2">nursultan</h2>
              <Badge className="mb-4 bg-blue-600">Premium Player</Badge>
              <p className="text-gray-400 text-sm">Играет с 2024</p>
            </div>
          </Card>

          <Card className="md:col-span-2 p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Статистика</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Уровень</span>
                  <span className="text-blue-400 font-bold">24</span>
                </div>
                <Progress value={65} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">650/1000 XP</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Sword" size={20} className="text-red-400" />
                    <span className="text-gray-400 text-sm">Убийств</span>
                  </div>
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Skull" size={20} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">Смертей</span>
                  </div>
                  <p className="text-2xl font-bold text-white">423</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Pickaxe" size={20} className="text-blue-400" />
                    <span className="text-gray-400 text-sm">Блоков сломано</span>
                  </div>
                  <p className="text-2xl font-bold text-white">45,892</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Clock" size={20} className="text-green-400" />
                    <span className="text-gray-400 text-sm">Время игры</span>
                  </div>
                  <p className="text-2xl font-bold text-white">127ч</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-3">Достижения</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">🏆 Первая кровь</Badge>
                  <Badge variant="outline" className="border-purple-500 text-purple-500">⭐ Строитель</Badge>
                  <Badge variant="outline" className="border-green-500 text-green-500">💎 Копатель</Badge>
                  <Badge variant="outline" className="border-red-500 text-red-500">⚔️ Воин</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
