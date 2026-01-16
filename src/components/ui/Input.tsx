'use client';
import type {
  InputHTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from 'react';

type FieldProps = {
  label: string;
  description?: string;
};

export function FieldWrapper({
  label,
  description,
  children,
}: PropsWithChildren<FieldProps>) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
      {label}
      {description && (
        <span className="text-[10px] normal-case tracking-[0.1em] text-slate-500">
          {description}
        </span>
      )}
      {children}
    </label>
  );
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/60"
      {...props}
    />
  );
}

export function TextAreaField(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/60"
      {...props}
    />
  );
}

export function SelectField({
  options,
  ...props
}: InputHTMLAttributes<HTMLSelectElement> & {
  options: { label: string; value: string }[];
}) {
  return (
    <select
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-white focus:outline-none"
      {...props}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-slate-900"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
