import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type BlockType = 'grass' | 'stone' | 'wood' | 'sand' | 'dirt' | 'bedrock' | 'leaves' | 'planks' | 'cobblestone';

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
  health: number;
}

interface Zombie {
  x: number;
  y: number;
  z: number;
  health: number;
}

const blockColors: Record<BlockType, { top: string; side: string; bottom: string }> = {
  grass: { top: '#7cbd3f', side: '#8b7355', bottom: '#7a5c3d' },
  stone: { top: '#7c7c7c', side: '#6b6b6b', bottom: '#5a5a5a' },
  wood: { top: '#9d7c4d', side: '#5d4a33', bottom: '#4a3828' },
  sand: { top: '#e4d29f', side: '#d4c28f', bottom: '#c4b27f' },
  dirt: { top: '#8b6f47', side: '#7a5e36', bottom: '#694d25' },
  bedrock: { top: '#2a2a2a', side: '#1a1a1a', bottom: '#0a0a0a' },
  leaves: { top: '#6ab44a', side: '#5aa43a', bottom: '#4a942a' },
  planks: { top: '#9d7543', side: '#8d6533', bottom: '#7d5523' },
  cobblestone: { top: '#828282', side: '#727272', bottom: '#626262' }
};

const blockEmojis: Record<BlockType, string> = {
  grass: '🌱',
  stone: '🪨',
  wood: '🪵',
  sand: '🏖️',
  dirt: '🟫',
  bedrock: '⬛',
  leaves: '🍃',
  planks: '🟫',
  cobblestone: '⬜'
};

function generateTerrain(): Block[] {
  const blocks: Block[] = [];
  const worldSize = 30;

  for (let x = -worldSize; x <= worldSize; x++) {
    for (let z = -worldSize; z <= worldSize; z++) {
      const noise = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 3;
      const baseHeight = Math.floor(noise + 2);

      for (let y = -5; y <= baseHeight; y++) {
        if (y === -5) {
          blocks.push({ x, y, z, type: 'bedrock' });
        } else if (y < baseHeight - 3) {
          blocks.push({ x, y, z, type: 'stone' });
        } else if (y < baseHeight) {
          blocks.push({ x, y, z, type: 'dirt' });
        } else {
          blocks.push({ x, y, z, type: 'grass' });
        }
      }

      if (Math.random() > 0.97 && baseHeight > 0) {
        const treeHeight = 4 + Math.floor(Math.random() * 2);
        for (let ty = 1; ty <= treeHeight; ty++) {
          blocks.push({ x, y: baseHeight + ty, z, type: 'wood' });
        }
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 0; ly < 2; ly++) {
              if (Math.abs(lx) + Math.abs(lz) <= 2) {
                blocks.push({ x: x + lx, y: baseHeight + treeHeight + ly, z: z + lz, type: 'leaves' });
              }
            }
          }
        }
      }
    }
  }

  for (let vx = 5; vx < 15; vx++) {
    for (let vz = 5; vz < 15; vz++) {
      const baseHeight = 2;
      if ((vx === 5 || vx === 14 || vz === 5 || vz === 14) && vx >= 5 && vx <= 14 && vz >= 5 && vz <= 14) {
        for (let hy = 1; hy <= 3; hy++) {
          blocks.push({ x: vx, y: baseHeight + hy, z: vz, type: 'planks' });
        }
      }
      if (vx > 5 && vx < 14 && vz > 5 && vz < 14) {
        blocks.push({ x: vx, y: baseHeight, z: vz, type: 'cobblestone' });
      }
    }
  }

  for (let cx = -20; cx <= -10; cx++) {
    for (let cz = -20; cz <= -10; cz++) {
      const caveDepth = Math.random() > 0.7 ? -2 : -1;
      for (let cy = caveDepth; cy < 0; cy++) {
        const existingIndex = blocks.findIndex(b => b.x === cx && b.y === cy && b.z === cz);
        if (existingIndex !== -1) {
          blocks.splice(existingIndex, 1);
        }
      }
    }
  }

  return blocks;
}

export default function Index() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [player, setPlayer] = useState<Player>({ x: 0, y: 5, z: 0, rotY: 0, rotX: 0, health: 20 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(0);
  const [zombies, setZombies] = useState<Zombie[]>([]);

  useEffect(() => {
    const terrain = generateTerrain();
    setBlocks(terrain);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(prev => (prev + 0.5) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isNight = timeOfDay > 180 && timeOfDay < 360;
    
    if (isNight && zombies.length < 5 && Math.random() > 0.98) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 10;
      const newZombie: Zombie = {
        x: player.x + Math.cos(angle) * distance,
        y: player.y,
        z: player.z + Math.sin(angle) * distance,
        health: 20
      };
      setZombies(prev => [...prev, newZombie]);
    }

    if (!isNight && zombies.length > 0) {
      setZombies([]);
    }
  }, [timeOfDay, player.x, player.z, zombies.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setZombies(prevZombies => 
        prevZombies.map(zombie => {
          const dx = player.x - zombie.x;
          const dz = player.z - zombie.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          if (distance < 15) {
            const speed = 0.05;
            return {
              ...zombie,
              x: zombie.x + (dx / distance) * speed,
              z: zombie.z + (dz / distance) * speed
            };
          }
          return zombie;
        })
      );

      setZombies(prevZombies => {
        const nearZombies = prevZombies.filter(zombie => {
          const dx = player.x - zombie.x;
          const dz = player.z - zombie.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          return distance < 1.5;
        });

        if (nearZombies.length > 0) {
          setPlayer(prev => ({
            ...prev,
            health: Math.max(0, prev.health - 0.1)
          }));
        }

        return prevZombies;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [player.x, player.z]);

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
        let newY = prev.y;
        const speed = 0.15;

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
        if (keys.has(' ')) {
          newY += speed;
        }
        if (keys.has('shift')) {
          newY -= speed;
        }

        return { ...prev, x: newX, z: newZ, y: newY };
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
      const timeProgress = timeOfDay / 360;
      const isDay = timeOfDay < 180;
      const isDawn = timeOfDay < 45 || timeOfDay > 315;
      const isDusk = timeOfDay > 135 && timeOfDay < 225;

      let skyColor = '#87CEEB';
      let groundColor = '#90EE90';
      
      if (isDawn || isDusk) {
        skyColor = `hsl(${20 + timeOfDay * 0.3}, 70%, 50%)`;
        groundColor = '#6b8e23';
      } else if (!isDay) {
        skyColor = '#0a0a2e';
        groundColor = '#1a3a1a';
      }

      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = groundColor;
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      if (!isDay && Math.random() > 0.95) {
        const starX = Math.random() * canvas.width;
        const starY = Math.random() * canvas.height / 2;
        ctx.fillStyle = 'white';
        ctx.fillRect(starX, starY, 2, 2);
      }

      const allEntities = [
        ...blocks.map(block => ({ ...block, isZombie: false })),
        ...zombies.map(zombie => ({ x: zombie.x, y: zombie.y, z: zombie.z, type: 'zombie' as const, isZombie: true, health: zombie.health }))
      ];

      const visibleEntities = allEntities.map(entity => {
        const dx = entity.x - player.x;
        const dy = entity.y - player.y;
        const dz = entity.z - player.z;

        const rotYRad = -player.rotY * Math.PI / 180;
        const rotXRad = -player.rotX * Math.PI / 180;

        const camX = dx * Math.cos(rotYRad) - dz * Math.sin(rotYRad);
        const camZ = dx * Math.sin(rotYRad) + dz * Math.cos(rotYRad);
        const camY = dy * Math.cos(rotXRad) - camZ * Math.sin(rotXRad);
        const finalZ = dy * Math.sin(rotXRad) + camZ * Math.cos(rotXRad);

        return { entity, camX, camY, camZ: finalZ };
      }).filter(({ camZ }) => camZ > 0.1);

      visibleEntities.sort((a, b) => b.camZ - a.camZ);

      visibleEntities.forEach(({ entity, camX, camY, camZ }) => {
        const scale = 400 / camZ;
        const screenX = canvas.width / 2 + camX * scale;
        const screenY = canvas.height / 2 - camY * scale;
        const size = 50 * scale;

        const brightness = isDay ? Math.max(0.5, 1 - camZ / 30) : Math.max(0.2, 0.6 - camZ / 30);

        if ('isZombie' in entity && entity.isZombie) {
          ctx.fillStyle = `rgba(${34 * brightness}, ${139 * brightness}, ${34 * brightness}, 1)`;
          ctx.fillRect(screenX - size / 2, screenY - size, size, size * 2);
          
          ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
          ctx.fillRect(screenX - size / 2, screenY - size * 2.5, size, 5);
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          ctx.fillRect(screenX - size / 2, screenY - size * 2.5, size * (entity.health / 20), 5);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🧟', screenX, screenY - size);
        } else if ('type' in entity && typeof entity.type === 'string') {
          const colors = blockColors[entity.type as BlockType];
          
          const parseColor = (hex: string) => ({
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
          });

          const topColor = parseColor(colors.top);
          const sideColor = parseColor(colors.side);
          const bottomColor = parseColor(colors.bottom);

          const cubeSize = size;
          const depth = size * 0.5;

          ctx.fillStyle = `rgb(${topColor.r * brightness}, ${topColor.g * brightness}, ${topColor.b * brightness})`;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - cubeSize / 2);
          ctx.lineTo(screenX + cubeSize / 2, screenY - cubeSize / 2 - depth / 2);
          ctx.lineTo(screenX, screenY - cubeSize / 2 - depth);
          ctx.lineTo(screenX - cubeSize / 2, screenY - cubeSize / 2 - depth / 2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = `rgb(${sideColor.r * brightness * 0.8}, ${sideColor.g * brightness * 0.8}, ${sideColor.b * brightness * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(screenX - cubeSize / 2, screenY - cubeSize / 2 - depth / 2);
          ctx.lineTo(screenX - cubeSize / 2, screenY + cubeSize / 2 - depth / 2);
          ctx.lineTo(screenX, screenY + cubeSize / 2);
          ctx.lineTo(screenX, screenY - cubeSize / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `rgb(${sideColor.r * brightness * 0.6}, ${sideColor.g * brightness * 0.6}, ${sideColor.b * brightness * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(screenX + cubeSize / 2, screenY - cubeSize / 2 - depth / 2);
          ctx.lineTo(screenX + cubeSize / 2, screenY + cubeSize / 2 - depth / 2);
          ctx.lineTo(screenX, screenY + cubeSize / 2);
          ctx.lineTo(screenX, screenY - cubeSize / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          if (entity.type === 'grass') {
            const grassTop = parseColor('#7cbd3f');
            ctx.fillStyle = `rgb(${grassTop.r * brightness}, ${grassTop.g * brightness}, ${grassTop.b * brightness})`;
            ctx.fillRect(screenX - cubeSize / 2 * 0.9, screenY - cubeSize / 2 - depth / 2 - 2, cubeSize * 0.9, 2);
          }

          if (entity.type === 'wood') {
            ctx.strokeStyle = `rgba(${topColor.r * 0.5}, ${topColor.g * 0.5}, ${topColor.b * 0.5}, ${brightness})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY - cubeSize / 2 - depth / 2, cubeSize * 0.15, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
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
  }, [blocks, player, timeOfDay, zombies]);

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

  const getTimeOfDayLabel = () => {
    if (timeOfDay < 45) return '🌅 Рассвет';
    if (timeOfDay < 135) return '☀️ День';
    if (timeOfDay < 180) return '🌇 Закат';
    if (timeOfDay < 315) return '🌙 Ночь';
    return '🌅 Рассвет';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">⛏️ Minecraft World</h1>
          <div className="flex items-center justify-center gap-4">
            <Badge className="text-lg px-4 py-2">
              {getTimeOfDayLabel()}
            </Badge>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ❤️ {player.health.toFixed(0)}/20
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-green-600 border-green-400">
              🧟 {zombies.length} зомби
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="p-4 bg-white/95 backdrop-blur shadow-2xl relative">
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
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Пробел</kbd>
                  <span>Вверх</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Shift</kbd>
                  <span>Вниз</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={removeBlock}>Удалить блок</Button>
                </div>
                <div className="flex items-center gap-2">
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
                    className="w-full justify-start h-10 text-sm"
                    size="sm"
                    onClick={() => {
                      setSelectedBlock(type);
                      toast.success(`Выбран ${blockEmojis[type]}`);
                    }}
                    style={{
                      backgroundColor: selectedBlock === type ? blockColors[type].top : undefined,
                      borderColor: blockColors[type].side,
                      borderWidth: '2px'
                    }}
                  >
                    <span className="text-lg mr-2">{blockEmojis[type]}</span>
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
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                ⚠️ Опасность!
              </h3>
              <p className="text-sm">
                {timeOfDay > 180 && timeOfDay < 360 
                  ? 'Ночь - зомби активны! Будь осторожен!' 
                  : 'День - зомби не появляются'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}