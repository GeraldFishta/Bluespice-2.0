// components/search/SearchBar.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  TextField,
  TextFieldProps,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface SearchBarProps extends Omit<TextFieldProps, "onChange" | "value"> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  onClose?: () => void;
  defaultValue?: string;
}

export const SearchBar = ({
  onSearch,
  debounceMs = 400,
  onClose,
  placeholder = "Search...",
  defaultValue = "",
  sx,
  ...textFieldProps
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const debouncedValue = useDebouncedValue(inputValue, debounceMs);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Handle Esc key to close (not clear)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle clear button
  const handleClear = useCallback(() => {
    setInputValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <TextField
      {...textFieldProps}
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: "text.secondary" }} />
          </InputAdornment>
        ),
        endAdornment: inputValue ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              edge="end"
              aria-label="clear search"
            >
              <Close />
            </IconButton>
          </InputAdornment>
        ) : null,
        ...textFieldProps.InputProps,
      }}
      sx={{ flexGrow: 1, ...sx }}
    />
  );
};
