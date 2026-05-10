import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type NetworkFilter = "all" | "tiktok" | "youtube" | "instagram";

export function SocialFilter({
  value,
  onChange,
}: {
  value: NetworkFilter;
  onChange: (v: NetworkFilter) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as NetworkFilter)}>
      <SelectTrigger className="h-10 w-auto min-w-[180px] rounded-full border-white/10 bg-white/5 px-4 text-xs font-medium text-foreground hover:bg-white/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-white/10 bg-popover/95 backdrop-blur-xl">
        <SelectItem value="all">Todas las redes</SelectItem>
        <SelectItem value="tiktok">TikTok</SelectItem>
        <SelectItem value="youtube">YouTube</SelectItem>
        <SelectItem value="instagram">Instagram</SelectItem>
      </SelectContent>
    </Select>
  );
}