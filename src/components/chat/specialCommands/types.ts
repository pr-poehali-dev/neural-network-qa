export interface SpecialCommand {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  color: string;
  category: 'text' | 'business' | 'code' | 'creative' | 'analysis' | 'education';
}

export interface CommandCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
