import type { ReactNode } from 'react';

export type PageKey =
  | 'command'
  | 'credit'
  | 'payments'
  | 'workforce'
  | 'payroll'
  | 'health'
  | 'programs'
  | 'savings'
  | 'forecasting'
  | 'alerts'
  | 'policies'
  | 'reports'
  | 'settings';

export type NavItem = {
  key: PageKey;
  label: string;
  icon: ReactNode;
};
