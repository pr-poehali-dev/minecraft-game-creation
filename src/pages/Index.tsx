import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type BlockType = 'grass' | 'stone' | 'wood' | 'sand' | 'dirt' | 'bedrock';

interface Block {
  x: number;
  y: number;
  z: number;
  type: BlockType;
}

interface Player {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
}

const blockColors: Record<BlockType, string> = {
  grass: '#4ade80',
  stone: '#64748b',
  wood: '#92400e',
  sand: '#fbbf24',
  dirt: '#78350f',
  bedrock: '#1a1a1a'
};

const blockEmojis: Record<BlockType, string> = {
  grass: '🌱',
  stone: '🪨',
  wood: '🪵',
  sand: '🏖️',
  dirt: '🟫',
  bedrock: '⬛'
};

export default function Index() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [player, setPlayer] = useState<Player>({ x: 0, y: 2, z: 5, rotY: 0, rotX: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    const initialBlocks: Block[] = [];
    for (let x = -10; x <= 10; x++) {
      for (let z = -10; z <= 10; z++) {
        initialBlocks.push({ x, y: 0, z, type: 'grass' });
        if (Math.random() > 0.9) {
          initialBlocks.push({ x, y: 1, z, type: 'stone' });
        }
      }
    }
    for (let x = -10; x <= 10; x++) {
      for (let z = -10; z <= 10; z++) {
        initialBlocks.push({ x, y: -1, z, type: 'bedrock' });
      }
    }
    setBlocks(initialBlocks);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (keys.size === 0) return;

      setPlayer(prev => {
        let newX = prev.x;
        let newZ = prev.z;
        const speed = 0.1;

        const forward = {
          x: Math.sin(prev.rotY * Math.PI / 180) * speed,
          z: Math.cos(prev.rotY * Math.PI / 180) * speed
        };

        const right = {
          x: Math.cos(prev.rotY * Math.PI / 180) * speed,
          z: -Math.sin(prev.rotY * Math.PI / 180) * speed
        };

        if (keys.has('w')) {
          newX += forward.x;
          newZ -= forward.z;
        }
        if (keys.has('s')) {
          newX -= forward.x;
          newZ += forward.z;
        }
        if (keys.has('a')) {
          newX -= right.x;
          newZ += right.z;
        }
        if (keys.has('d')) {
          newX += right.x;
          newZ -= right.z;
        }

        return { ...prev, x: newX, z: newZ };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [keys]);

  const handleCanvasClick = () => {
    if (canvasRef.current && !isPointerLocked) {
      canvasRef.current.requestPointerLock();
    }
  };

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === canvasRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvasRef.current) {
        setPlayer(prev => ({
          ...prev,
          rotY: prev.rotY + e.movementX * 0.2,
          rotX: Math.max(-89, Math.min(89, prev.rotX - e.movementY * 0.2))
        }));
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      const visibleBlocks = blocks.map(block => {
        const dx = block.x - player.x;
        const dy = block.y - player.y;
        const dz = block.z - player.z;

        const rotYRad = -player.rotY * Math.PI / 180;
        const rotXRad = -player.rotX * Math.PI / 180;

        const camX = dx * Math.cos(rotYRad) - dz * Math.sin(rotYRad);
        const camZ = dx * Math.sin(rotYRad) + dz * Math.cos(rotYRad);
        const camY = dy * Math.cos(rotXRad) - camZ * Math.sin(rotXRad);
        const finalZ = dy * Math.sin(rotXRad) + camZ * Math.cos(rotXRad);

        return { block, camX, camY, camZ: finalZ };
      }).filter(({ camZ }) => camZ > 0.1);

      visibleBlocks.sort((a, b) => b.camZ - a.camZ);

      visibleBlocks.forEach(({ block, camX, camY, camZ }) => {
        const scale = 400 / camZ;
        const screenX = canvas.width / 2 + camX * scale;
        const screenY = canvas.height / 2 - camY * scale;
        const size = 50 * scale;

        const brightness = Math.max(0.3, 1 - camZ / 20);
        const color = blockColors[block.type];
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        ctx.fillStyle = `rgba(${r * brightness}, ${g * brightness}, ${b * brightness}, 1)`;
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - size / 2, screenY - size / 2, size, size);
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      const crosshairSize = 10;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - crosshairSize, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + crosshairSize, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - crosshairSize);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 + crosshairSize);
      ctx.stroke();
    };

    const animationFrame = requestAnimationFrame(function animate() {
      render();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [blocks, player]);

  const placeBlock = () => {
    const distance = 3;
    const dirX = Math.sin(player.rotY * Math.PI / 180);
    const dirZ = -Math.cos(player.rotY * Math.PI / 180);
    const dirY = Math.sin(player.rotX * Math.PI / 180);

    const targetX = Math.round(player.x + dirX * distance);
    const targetY = Math.round(player.y + dirY * distance);
    const targetZ = Math.round(player.z + dirZ * distance);

    const exists = blocks.find(b => b.x === targetX && b.y === targetY && b.z === targetZ);
    if (!exists) {
      setBlocks([...blocks, { x: targetX, y: targetY, z: targetZ, type: selectedBlock }]);
      toast.success('Блок поставлен!');
    }
  };

  const removeBlock = () => {
    const distance = 3;
    const dirX = Math.sin(player.rotY * Math.PI / 180);
    const dirZ = -Math.cos(player.rotY * Math.PI / 180);
    const dirY = Math.sin(player.rotX * Math.PI / 180);

    const targetX = Math.round(player.x + dirX * distance);
    const targetY = Math.round(player.y + dirY * distance);
    const targetZ = Math.round(player.z + dirZ * distance);

    setBlocks(blocks.filter(b => !(b.x === targetX && b.y === targetY && b.z === targetZ)));
    toast.info('Блок удалён!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">⛏️ Minecraft FPS</h1>
          <p className="text-white/90">Игра от первого лица</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="p-4 bg-white/95 backdrop-blur shadow-2xl">
              <canvas
                ref={canvasRef}
                width={1000}
                height={600}
                className="w-full h-[600px] bg-black rounded-lg cursor-pointer"
                onClick={handleCanvasClick}
              />
              
              {!isPointerLocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/80 text-white px-6 py-4 rounded-lg text-center">
                    <p className="text-xl font-bold mb-2">🖱️ Кликни для игры</p>
                    <p className="text-sm">ESC - выйти из управления</p>
                  </div>
                </div>
              )}
            </Card>

            <Card className="mt-4 p-4 bg-white/95 backdrop-blur">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">W A S D</kbd>
                  <span>Движение</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Мышь</kbd>
                  <span>Обзор</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">ЛКМ</kbd>
                  <Button size="sm" onClick={removeBlock}>Удалить блок</Button>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">ПКМ</kbd>
                  <Button size="sm" onClick={placeBlock}>Поставить блок</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-white/95 backdrop-blur shadow-2xl">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="Package" size={20} className="text-purple-600" />
                Блоки
              </h3>
              
              <div className="space-y-2">
                {(Object.keys(blockColors) as BlockType[]).map(type => (
                  <Button
                    key={type}
                    variant={selectedBlock === type ? 'default' : 'outline'}
                    className="w-full justify-start h-12"
                    size="sm"
                    onClick={() => {
                      setSelectedBlock(type);
                      toast.success(`Выбран ${blockEmojis[type]}`);
                    }}
                    style={{
                      backgroundColor: selectedBlock === type ? blockColors[type] : undefined,
                      borderColor: blockColors[type],
                      borderWidth: '2px'
                    }}
                  >
                    <span className="text-xl mr-2">{blockEmojis[type]}</span>
                    <span className={selectedBlock === type ? 'text-white font-bold' : ''}>
                      {type}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-white/95 backdrop-blur shadow-2xl">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-blue-600" />
                Позиция
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">X:</span>
                  <span className="font-mono">{player.x.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Y:</span>
                  <span className="font-mono">{player.y.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Z:</span>
                  <span className="font-mono">{player.z.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Поворот:</span>
                  <span className="font-mono">{player.rotY.toFixed(0)}°</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
