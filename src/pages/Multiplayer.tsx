import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface NPC {
  x: number;
  y: number;
  z: number;
  name: string;
  dialogue: string;
}

interface Bot {
  id: number;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetZ: number;
  name: string;
}

interface Player {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
}

export default function Multiplayer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showNPCDialog, setShowNPCDialog] = useState(false);
  const [inWorld, setInWorld] = useState(false);
  const [player, setPlayer] = useState<Player>({ x: 0, y: 2, z: 10, rotY: 0, rotX: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [bots, setBots] = useState<Bot[]>([]);
  const [npc] = useState<NPC>({ x: 0, y: 2, z: 5, name: 'Стив', dialogue: 'Добро пожаловать на сервер! Хочешь отправиться в мир приключений?' });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    if (inWorld) {
      const newBots: Bot[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        newBots.push({
          id: i,
          x: Math.cos(angle) * 10,
          y: 2,
          z: Math.sin(angle) * 10,
          targetX: Math.cos(angle) * 10,
          targetZ: Math.sin(angle) * 10,
          name: `Игрок ${i + 1}`
        });
      }
      setBots(newBots);
    }
  }, [inWorld]);

  useEffect(() => {
    if (!inWorld) return;

    const interval = setInterval(() => {
      setBots(prevBots =>
        prevBots.map(bot => {
          const dx = bot.targetX - bot.x;
          const dz = bot.targetZ - bot.z;
          const distance = Math.sqrt(dx * dx + dz * dz);

          if (distance < 0.5 || Math.random() > 0.98) {
            return {
              ...bot,
              targetX: (Math.random() - 0.5) * 30,
              targetZ: (Math.random() - 0.5) * 30
            };
          }

          const speed = 0.05;
          return {
            ...bot,
            x: bot.x + (dx / distance) * speed,
            z: bot.z + (dz / distance) * speed
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [inWorld]);

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
    if (!inWorld) return;

    const interval = setInterval(() => {
      if (keys.size === 0) return;

      setPlayer(prev => {
        let newX = prev.x;
        let newZ = prev.z;
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

        return { ...prev, x: newX, z: newZ };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [keys, inWorld]);

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
    if (!gameStarted && !inWorld) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#7cbd3f';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      if (!inWorld) {
        const npcDx = npc.x - player.x;
        const npcDz = npc.z - player.z;
        const npcDistance = Math.sqrt(npcDx * npcDx + npcDz * npcDz);

        const rotYRad = -player.rotY * Math.PI / 180;
        const rotXRad = -player.rotX * Math.PI / 180;

        const camX = npcDx * Math.cos(rotYRad) - npcDz * Math.sin(rotYRad);
        const camZ = npcDx * Math.sin(rotYRad) + npcDz * Math.cos(rotYRad);

        if (camZ > 0.1) {
          const scale = 400 / camZ;
          const screenX = canvas.width / 2 + camX * scale;
          const screenY = canvas.height / 2;
          const size = 50 * scale;

          ctx.fillStyle = '#8b7355';
          ctx.fillRect(screenX - size / 4, screenY, size / 2, size * 1.5);

          ctx.fillStyle = '#fdbcb4';
          ctx.fillRect(screenX - size / 3, screenY - size / 2, size / 1.5, size / 1.5);

          ctx.fillStyle = '#8b4513';
          ctx.fillRect(screenX - size / 3, screenY - size / 1.5, size / 1.5, size / 4);

          ctx.fillStyle = '#fdbcb4';
          ctx.fillRect(screenX - size / 2, screenY + size / 4, size / 4, size);
          ctx.fillRect(screenX + size / 4, screenY + size / 4, size / 4, size);

          ctx.fillStyle = 'white';
          ctx.font = `${12 * scale / 10}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(npc.name, screenX, screenY - size * 2);

          if (npcDistance < 3) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(screenX - 100, screenY - size * 3, 200, 40);
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.fillText('Нажми E чтобы поговорить', screenX, screenY - size * 2.7);
          }
        }
      } else {
        const allEntities = [
          ...bots.map(bot => ({ ...bot, isBot: true }))
        ];

        allEntities.forEach(entity => {
          const dx = entity.x - player.x;
          const dy = entity.y - player.y;
          const dz = entity.z - player.z;

          const rotYRad = -player.rotY * Math.PI / 180;
          const rotXRad = -player.rotX * Math.PI / 180;

          const camX = dx * Math.cos(rotYRad) - dz * Math.sin(rotYRad);
          const camZ = dx * Math.sin(rotYRad) + dz * Math.cos(rotYRad);
          const camY = dy * Math.cos(rotXRad) - camZ * Math.sin(rotXRad);

          if (camZ > 0.1) {
            const scale = 400 / camZ;
            const screenX = canvas.width / 2 + camX * scale;
            const screenY = canvas.height / 2 - camY * scale;
            const size = 50 * scale;

            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(screenX - size / 4, screenY, size / 2, size * 1.5);

            ctx.fillStyle = '#fdbcb4';
            ctx.fillRect(screenX - size / 3, screenY - size / 2, size / 1.5, size / 1.5);

            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(screenX - size / 2, screenY + size / 4, size / 4, size);
            ctx.fillRect(screenX + size / 4, screenY + size / 4, size / 4, size);

            if ('name' in entity) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(entity.name, screenX, screenY - size * 2);
            }
          }
        });
      }

      const handSize = 100;
      const handX = canvas.width - handSize - 20;
      const handY = canvas.height - handSize + 20;

      ctx.fillStyle = '#fdbcb4';
      ctx.fillRect(handX, handY, 40, 60);

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(handX + i * 10, handY - 20, 8, 25);
      }

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
  }, [gameStarted, inWorld, player, npc, bots]);

  useEffect(() => {
    if (!gameStarted || inWorld) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        const dx = npc.x - player.x;
        const dz = npc.z - player.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 3) {
          setShowNPCDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, inWorld, player, npc]);

  const handleEnterWorld = () => {
    setShowNPCDialog(false);
    toast.success('Телепортация в мир...');
    setTimeout(() => {
      setInWorld(true);
      setPlayer({ x: 0, y: 2, z: 0, rotY: 0, rotX: 0 });
      toast.info('Добро пожаловать в мир!');
    }, 1000);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-gray-800/50 border-gray-700 text-center">
            <Icon name="Globe" size={64} className="text-blue-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Игра по сети</h1>
            <p className="text-gray-400 mb-8">Присоединяйся к серверу nursultan и начни своё приключение!</p>
            
            <Badge className="mb-6 text-lg px-4 py-2 bg-green-600">
              <Icon name="Users" size={18} className="mr-2" />
              47/100 онлайн
            </Badge>

            <Button 
              size="lg"
              className="w-full h-16 text-2xl bg-blue-600 hover:bg-blue-700 mb-4"
              onClick={() => {
                toast.success('Подключение к серверу...');
                setTimeout(() => {
                  setGameStarted(true);
                  toast.info('Вы на сервере!');
                }, 1500);
              }}
            >
              <Icon name="Play" size={28} className="mr-3" />
              Подключиться к серверу
            </Button>

            <div className="mt-8 p-4 bg-red-600/20 border border-red-500 rounded">
              <p className="text-red-400 font-bold">⚠️ Одиночная игра - СКОРО</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {inWorld ? '🌍 Мир сервера' : '👋 Лобби сервера'}
          </h1>
          <Badge className="text-lg px-4 py-2">
            <Icon name="Users" size={18} className="mr-2" />
            {inWorld ? `${bots.length} игроков рядом` : 'Поговори с NPC'}
          </Badge>
        </div>

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
                <p className="text-xl font-bold mb-2">🖱️ Кликни для управления</p>
                <p className="text-sm">WASD - движение, E - взаимодействие</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="mt-4 p-4 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap gap-4 text-sm items-center">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded">W A S D</kbd>
              <span>Движение</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded">E</kbd>
              <span>Взаимодействие</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded">Мышь</kbd>
              <span>Обзор</span>
            </div>
            {inWorld && (
              <Badge className="ml-auto bg-green-600">
                ✅ В игровом мире
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {showNPCDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4 p-6 bg-gray-900 border-gray-700">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">👨‍🌾</div>
              <h2 className="text-2xl font-bold text-white mb-2">{npc.name}</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6 text-center">{npc.dialogue}</p>
            <div className="flex gap-3">
              <Button 
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleEnterWorld}
              >
                <Icon name="Check" size={20} className="mr-2" />
                Да, отправиться!
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => setShowNPCDialog(false)}
              >
                Не сейчас
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
