import { Label } from "@/components/ui/label";

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPickerField = ({ label, value, onChange }: ColorPickerFieldProps) => {
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs text-muted-foreground min-w-[80px]">{label}</Label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">{value}</span>
    </div>
  );
};

export default ColorPickerField;
