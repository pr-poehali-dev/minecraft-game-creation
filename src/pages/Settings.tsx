import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <Icon name="Settings" size={36} />
          Настройки
        </h1>

        <div className="space-y-4">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Графика</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fullscreen" className="text-gray-300">Полноэкранный режим</Label>
                <Switch id="fullscreen" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vsync" className="text-gray-300">VSync</Label>
                <Switch id="vsync" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Яркость</Label>
                <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Дальность прорисовки</Label>
                <Slider defaultValue={[8]} max={32} step={1} className="w-full" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Звук</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Общая громкость</Label>
                <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Музыка</Label>
                <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Звуковые эффекты</Label>
                <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Управление</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mouse-sens" className="text-gray-300">Чувствительность мыши</Label>
                <Slider defaultValue={[50]} max={100} step={1} className="w-32" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="invert" className="text-gray-300">Инвертировать Y</Label>
                <Switch id="invert" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
