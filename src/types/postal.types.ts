import { ThemeType } from "@/components/postal-front/postal-front.types";
import { BackgroundThemeType } from "@/context/backgroundTheme.types";

export interface Postal {
  id: string;
  slug: string;
  fromName: string;
  toName: string;
  message: string;
  imageUrl: string;
  theme: ThemeType;
  backgroundTheme?: BackgroundThemeType;
  stamp: string;
}
