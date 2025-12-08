import React from "react";

type Props = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
};

export default function FormInput({ label, value, onChange, type = "text" }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2 w-full"
      />
    </div>
  );
}
