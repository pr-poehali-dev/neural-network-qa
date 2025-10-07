import Icon from '@/components/ui/icon';
import { SPECIAL_COMMANDS } from './specialCommands/commandsData';
import { COMMAND_CATEGORIES } from './specialCommands/categories';

interface SpecialCommandsProps {
  onSelectCommand: (prompt: string) => void;
}

export default function SpecialCommands({ onSelectCommand }: SpecialCommandsProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Wand2" size={20} className="text-purple-400" />
        <h3 className="font-bold text-white">Специальные функции AI</h3>
        <span className="ml-auto bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
          {SPECIAL_COMMANDS.length} функций
        </span>
      </div>
      
      {COMMAND_CATEGORIES.map(category => {
        const commands = SPECIAL_COMMANDS.filter(cmd => cmd.category === category.id);
        
        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name={category.icon as any} size={16} className={category.color} />
              <h4 className="font-semibold text-white text-sm">{category.name}</h4>
              <span className="text-xs text-gray-400">({commands.length})</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {commands.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => onSelectCommand(cmd.prompt)}
                  className={`group relative overflow-hidden rounded-lg p-2.5 text-left transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${cmd.color} hover:shadow-lg`}
                >
                  <div className="relative z-10 flex items-start gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={cmd.icon as any} size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-white text-xs mb-0.5">{cmd.title}</h5>
                      <p className="text-[10px] text-white/80 leading-snug line-clamp-1">{cmd.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
