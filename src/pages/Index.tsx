import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type BlockType = 'grass' | 'stone' | 'wood' | 'sand' | 'water' | 'dirt';

interface Block {
  x: number;
  y: number;
  z: number;
  type: BlockType;
}

const blockColors: Record<BlockType, string> = {
  grass: '#4ade80',
  stone: '#64748b',
  wood: '#92400e',
  sand: '#fbbf24',
  water: '#0ea5e9',
  dirt: '#78350f'
};

const blockEmojis: Record<BlockType, string> = {
  grass: '🌱',
  stone: '🪨',
  wood: '🪵',
  sand: '🏖️',
  water: '💧',
  dirt: '🟫'
};

export default function Index() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [rotation, setRotation] = useState({ x: -30, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialBlocks: Block[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        initialBlocks.push({ x, y: 0, z, type: 'grass' });
      }
    }
    setBlocks(initialBlocks);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: Math.max(-90, Math.min(0, prev.x + dy * 0.5)),
      y: prev.y + dx * 0.5
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addBlock = (x: number, y: number, z: number) => {
    const existingBlock = blocks.find(b => b.x === x && b.y === y && b.z === z);
    if (!existingBlock) {
      setBlocks([...blocks, { x, y, z, type: selectedBlock }]);
      toast.success(`Блок ${blockEmojis[selectedBlock]} добавлен!`);
    }
  };

  const removeBlock = (x: number, y: number, z: number) => {
    setBlocks(blocks.filter(b => !(b.x === x && b.y === y && b.z === z)));
    toast.info('Блок удалён!');
  };

  const projectBlock = (block: Block) => {
    const rad = rotation.y * Math.PI / 180;
    const radX = rotation.x * Math.PI / 180;
    
    const rotatedX = block.x * Math.cos(rad) - block.z * Math.sin(rad);
    const rotatedZ = block.x * Math.sin(rad) + block.z * Math.cos(rad);
    const rotatedY = block.y * Math.cos(radX) - rotatedZ * Math.sin(radX);
    const finalZ = block.y * Math.sin(radX) + rotatedZ * Math.cos(radX);
    
    const scale = 30;
    return {
      x: rotatedX * scale + 300,
      y: -rotatedY * scale + 300,
      z: finalZ,
      size: scale
    };
  };

  const sortedBlocks = [...blocks].sort((a, b) => {
    const projA = projectBlock(a);
    const projB = projectBlock(b);
    return projA.z - projB.z;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">⛏️ MineCraft Builder</h1>
          <p className="text-white/90 text-lg">Строй свой мир из блоков!</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="p-6 bg-white/95 backdrop-blur shadow-2xl">
              <div 
                ref={canvasRef}
                className="relative w-full h-[600px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <svg className="absolute inset-0 w-full h-full">
                  {sortedBlocks.map((block, idx) => {
                    const proj = projectBlock(block);
                    const lightness = 0.8 + (proj.z / 200) * 0.2;
                    
                    return (
                      <g key={idx}>
                        <rect
                          x={proj.x}
                          y={proj.y}
                          width={proj.size}
                          height={proj.size}
                          fill={blockColors[block.type]}
                          stroke="#000"
                          strokeWidth="2"
                          opacity={lightness}
                          className="cursor-pointer hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.shiftKey) {
                              removeBlock(block.x, block.y, block.z);
                            } else {
                              addBlock(block.x, block.y + 1, block.z);
                            }
                          }}
                        />
                        <rect
                          x={proj.x + 4}
                          y={proj.y + 4}
                          width={proj.size - 8}
                          height={proj.size - 8}
                          fill={blockColors[block.type]}
                          opacity={Math.min(1, lightness + 0.2)}
                          pointerEvents="none"
                        />
                      </g>
                    );
                  })}
                </svg>
                
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur text-sm">
                  <p>🖱️ Левый клик - добавить блок</p>
                  <p>⇧ + Клик - удалить блок</p>
                  <p>🎮 Зажми и тяни - поворот камеры</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-white/95 backdrop-blur shadow-2xl">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Package" size={24} className="text-purple-600" />
                Блоки
              </h3>
              
              <div className="space-y-2">
                {(Object.keys(blockColors) as BlockType[]).map(type => (
                  <Button
                    key={type}
                    variant={selectedBlock === type ? 'default' : 'outline'}
                    className="w-full justify-start text-lg h-14"
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
                    <span className="text-2xl mr-2">{blockEmojis[type]}</span>
                    <span className={selectedBlock === type ? 'text-white font-bold' : ''}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur shadow-2xl">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Info" size={24} className="text-blue-600" />
                Статистика
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Всего блоков:</span>
                  <span className="font-bold text-lg">{blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Выбран:</span>
                  <span className="font-bold">{blockEmojis[selectedBlock]} {selectedBlock}</span>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full mt-4"
                onClick={() => {
                  const initialBlocks: Block[] = [];
                  for (let x = -3; x <= 3; x++) {
                    for (let z = -3; z <= 3; z++) {
                      initialBlocks.push({ x, y: 0, z, type: 'grass' });
                    }
                  }
                  setBlocks(initialBlocks);
                  toast.info('Мир сброшен!');
                }}
              >
                <Icon name="RotateCcw" size={18} className="mr-2" />
                Сбросить мир
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
