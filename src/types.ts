export interface FormState {
  productName: string;
  productType: string;
  targetUsers: string;
  industry: string;
  primaryMarket: string;
  teamSize: string;
  mission: string;
  problem: string;
  valueProposition: string;
  coreModules: string;
  designStyle: string;
  designReference: string;
  primaryColorStyle: string;
  secondaryColorStyle: string;
  metrics: string;
  language: string;
  currency: string;
  fileContext: string;
}

export interface ChecklistItem {
  id: number;
  category: string;
  feature: string;
  question: string;
  suggestion: string;
  completed: boolean;
  notes: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface StepInfo {
  id: number;
  title: string;
  description: string;
}
