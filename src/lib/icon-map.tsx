import {
  BellRingIcon,
  BotIcon,
  CalendarOffIcon,
  FilterIcon,
  FrownIcon,
  GaugeIcon,
  HammerIcon,
  MapPinIcon,
  MegaphoneIcon,
  PhoneCallIcon,
  PhoneIcon,
  PhoneMissedIcon,
  PhoneOffIcon,
  TargetIcon,
  TrendingUpIcon,
  UserXIcon,
  WalletIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import type {
  PainIconName,
  SolutionIconName,
  MarketingIconName,
} from "@/lib/content";

const PAIN_MAP: Record<PainIconName, typeof UserXIcon> = {
  "user-x": UserXIcon,
  megaphone: MegaphoneIcon,
  "calendar-off": CalendarOffIcon,
  phone: PhoneIcon,
  "phone-off": PhoneOffIcon,
  "phone-missed": PhoneMissedIcon,
  frown: FrownIcon,
  wallet: WalletIcon,
};

const SOLUTION_MAP: Record<SolutionIconName, typeof TargetIcon> = {
  target: TargetIcon,
  "phone-call": PhoneCallIcon,
  "trending-up": TrendingUpIcon,
  wrench: WrenchIcon,
  zap: ZapIcon,
  hammer: HammerIcon,
};

const MARKETING_MAP: Record<MarketingIconName, typeof TargetIcon> = {
  megaphone: MegaphoneIcon,
  target: TargetIcon,
  "trending-up": TrendingUpIcon,
  filter: FilterIcon,
  bot: BotIcon,
  "bell-ring": BellRingIcon,
  "map-pin": MapPinIcon,
  gauge: GaugeIcon,
};

export function painIcon(name: PainIconName, className?: string) {
  const Icon = PAIN_MAP[name] ?? UserXIcon;
  return <Icon className={className} />;
}

export function solutionIcon(name: SolutionIconName, className?: string) {
  const Icon = SOLUTION_MAP[name] ?? TargetIcon;
  return <Icon className={className} />;
}

export function marketingIcon(name: MarketingIconName, className?: string) {
  const Icon = MARKETING_MAP[name] ?? MegaphoneIcon;
  return <Icon className={className} />;
}
