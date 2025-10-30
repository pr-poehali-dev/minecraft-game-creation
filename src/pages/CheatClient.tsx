import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CheatSettings {
  killaura: boolean;
  speed: boolean;
  triggerbot: boolean;
  esp: boolean;
  xray: boolean;
  fly: boolean;
  nofall: boolean;
  fullbright: boolean;
  tracers: boolean;
  nametags: boolean;
}

export default function CheatClient() {
  const [cheats, setCheats] = useState<CheatSettings>({
    killaura: false,
    speed: false,
    triggerbot: false,
    esp: false,
    xray: false,
    fly: false,
    nofall: false,
    fullbright: false,
    tracers: false,
    nametags: false
  });

  const [killauraRange, setKillauraRange] = useState([4]);
  const [speedMultiplier, setSpeedMultiplier] = useState([2]);
  const [triggerbotDelay, setTriggerbotDelay] = useState([50]);

  const toggleCheat = (cheat: keyof CheatSettings) => {
    setCheats(prev => {
      const newValue = !prev[cheat];
      toast.success(
        `${cheat.toUpperCase()} ${newValue ? 'включен' : 'выключен'}`,
        { icon: newValue ? '✅' : '❌' }
      );
      return { ...prev, [cheat]: newValue };
    });
  };

  const activeCount = Object.values(cheats).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-500 mb-2 flex items-center gap-3">
              <Icon name="Zap" size={36} />
              nursultan client
            </h1>
            <p className="text-gray-400">Продвинутый чит-клиент для Minecraft</p>
          </div>
          <Badge className="bg-blue-600 text-lg px-4 py-2">
            {activeCount} активных
          </Badge>
        </div>

        <Tabs defaultValue="combat" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
            <TabsTrigger value="combat" className="data-[state=active]:bg-red-600">
              <Icon name="Sword" size={18} className="mr-2" />
              Бой
            </TabsTrigger>
            <TabsTrigger value="movement" className="data-[state=active]:bg-green-600">
              <Icon name="Footprints" size={18} className="mr-2" />
              Движение
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-purple-600">
              <Icon name="Eye" size={18} className="mr-2" />
              Визуалы
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-blue-600">
              <Icon name="Settings" size={18} className="mr-2" />
              Прочее
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combat" className="space-y-4">
            <Card className="p-6 bg-gray-800/50 border-red-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Target" size={24} className="text-red-500" />
                    KillAura
                  </h3>
                  <p className="text-sm text-gray-400">Автоматическая атака ближайших врагов</p>
                </div>
                <Switch 
                  checked={cheats.killaura} 
                  onCheckedChange={() => toggleCheat('killaura')}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
              {cheats.killaura && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                  <div>
                    <Label className="text-gray-300">Дальность атаки: {killauraRange[0]} блоков</Label>
                    <Slider 
                      value={killauraRange} 
                      onValueChange={setKillauraRange}
                      max={6} 
                      min={3}
                      step={0.5} 
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gray-800/50 border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Crosshair" size={24} className="text-orange-500" />
                    TriggerBot
                  </h3>
                  <p className="text-sm text-gray-400">Автоматическая атака при наведении</p>
                </div>
                <Switch 
                  checked={cheats.triggerbot} 
                  onCheckedChange={() => toggleCheat('triggerbot')}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
              {cheats.triggerbot && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                  <div>
                    <Label className="text-gray-300">Задержка: {triggerbotDelay[0]}мс</Label>
                    <Slider 
                      value={triggerbotDelay} 
                      onValueChange={setTriggerbotDelay}
                      max={200} 
                      min={0}
                      step={10} 
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="movement" className="space-y-4">
            <Card className="p-6 bg-gray-800/50 border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Zap" size={24} className="text-green-500" />
                    Speed
                  </h3>
                  <p className="text-sm text-gray-400">Увеличенная скорость передвижения</p>
                </div>
                <Switch 
                  checked={cheats.speed} 
                  onCheckedChange={() => toggleCheat('speed')}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
              {cheats.speed && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                  <div>
                    <Label className="text-gray-300">Множитель: x{speedMultiplier[0]}</Label>
                    <Slider 
                      value={speedMultiplier} 
                      onValueChange={setSpeedMultiplier}
                      max={5} 
                      min={1}
                      step={0.5} 
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gray-800/50 border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Plane" size={24} className="text-cyan-500" />
                    Fly
                  </h3>
                  <p className="text-sm text-gray-400">Полёт в творческом режиме</p>
                </div>
                <Switch 
                  checked={cheats.fly} 
                  onCheckedChange={() => toggleCheat('fly')}
                  className="data-[state=checked]:bg-cyan-600"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Shield" size={24} className="text-blue-500" />
                    NoFall
                  </h3>
                  <p className="text-sm text-gray-400">Отключает урон от падения</p>
                </div>
                <Switch 
                  checked={cheats.nofall} 
                  onCheckedChange={() => toggleCheat('nofall')}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <Card className="p-6 bg-gray-800/50 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="ScanEye" size={24} className="text-purple-500" />
                    ESP (WallHack)
                  </h3>
                  <p className="text-sm text-gray-400">Видеть игроков сквозь стены</p>
                </div>
                <Switch 
                  checked={cheats.esp} 
                  onCheckedChange={() => toggleCheat('esp')}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-pink-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Gem" size={24} className="text-pink-500" />
                    X-Ray
                  </h3>
                  <p className="text-sm text-gray-400">Видеть руды сквозь блоки</p>
                </div>
                <Switch 
                  checked={cheats.xray} 
                  onCheckedChange={() => toggleCheat('xray')}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Sun" size={24} className="text-yellow-500" />
                    FullBright
                  </h3>
                  <p className="text-sm text-gray-400">Максимальная яркость везде</p>
                </div>
                <Switch 
                  checked={cheats.fullbright} 
                  onCheckedChange={() => toggleCheat('fullbright')}
                  className="data-[state=checked]:bg-yellow-600"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="GitBranch" size={24} className="text-indigo-500" />
                    Tracers
                  </h3>
                  <p className="text-sm text-gray-400">Линии к игрокам</p>
                </div>
                <Switch 
                  checked={cheats.tracers} 
                  onCheckedChange={() => toggleCheat('tracers')}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 border-teal-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Icon name="Tag" size={24} className="text-teal-500" />
                    NameTags
                  </h3>
                  <p className="text-sm text-gray-400">Улучшенные ники игроков</p>
                </div>
                <Switch 
                  checked={cheats.nametags} 
                  onCheckedChange={() => toggleCheat('nametags')}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <Card className="p-6 bg-gray-800/50 border-gray-500/30">
              <div className="text-center py-8">
                <Icon name="Construction" size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Скоро появятся новые функции</h3>
                <p className="text-gray-400">Следите за обновлениями!</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
