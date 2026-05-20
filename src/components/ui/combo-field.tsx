"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2, Plus, X } from "lucide-react";

export interface ComboOption {
  id: string;
  label: string;
}

interface ComboFieldProps {
  options: ComboOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** When provided, a "+ Create '...'" row appears for unmatched queries. */
  onCreateOption?: (label: string) => Promise<string>;
}

export function ComboField({
  options,
  value,
  onChange,
  placeholder = "Type or select…",
  disabled = false,
  onCreateOption,
}: ComboFieldProps) {
  const selected = options.find((o) => o.id === value) ?? null;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const filtered = trimmed
    ? options.filter((o) => o.label.toLowerCase().includes(trimmed.toLowerCase()))
    : options;

  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === trimmed.toLowerCase(),
  );
  const showCreate = !!onCreateOption && !!trimmed && !exactMatch;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!value) setQuery("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onChange("");
    setOpen(true);
  }

  function handleSelect(opt: ComboOption) {
    onChange(opt.id);
    setQuery("");
    setOpen(false);
  }

  async function handleCreate() {
    if (!onCreateOption || !trimmed || creating) return;
    setCreating(true);
    try {
      const newId = await onCreateOption(trimmed);
      onChange(newId);
      setQuery("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
  }

  const displayValue = selected ? selected.label : query;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-card px-3 py-2 pr-16 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {(selected || query) && !disabled && (
            <button
              type="button"
              onMouseDown={handleClear}
              className="p-1 text-muted-foreground hover:text-primary rounded transition-colors"
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            onMouseDown={() => !disabled && setOpen((v) => !v)}
            className="p-1 text-muted-foreground hover:text-primary rounded transition-colors"
            tabIndex={-1}
            disabled={disabled}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && !showCreate && (
              <li className="px-3 py-2.5 text-sm text-muted-foreground">No matches</li>
            )}
            {filtered.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-secondary ${
                    opt.id === value ? "bg-secondary font-semibold text-primary" : "text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}

            {showCreate && (
              <li className="border-t border-border">
                <button
                  type="button"
                  onMouseDown={handleCreate}
                  disabled={creating}
                  className="w-full text-left px-3 py-2.5 text-sm font-semibold text-primary hover:bg-secondary transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {creating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {creating ? "Creating…" : `Create "${trimmed}"`}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
