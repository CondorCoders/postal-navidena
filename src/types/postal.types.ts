export interface Postal {
  id: string;
  slug: string;
  fromName: string;
  toName: string;
  message: string;
  file: File | string;
  theme: string;
  backgroundTheme?: string;
  stamp: string;
}
