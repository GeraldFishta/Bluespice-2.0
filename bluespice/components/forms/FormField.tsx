// components/forms/FormField.tsx
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea";
  options?: Option[];
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  options = [],
  required = false,
  multiline = false,
  rows = 4,
  disabled = false,
  placeholder,
}: FormFieldProps<T>) {
  if (type === "select") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl
            fullWidth
            error={!!error}
            required={required}
            disabled={disabled}
          >
            <InputLabel>{label}</InputLabel>
            <Select {...field} label={label}>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type === "textarea" ? undefined : type}
          multiline={multiline || type === "textarea"}
          rows={multiline || type === "textarea" ? rows : undefined}
          fullWidth
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
