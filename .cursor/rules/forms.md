# Forms Rules - Bluespice 2.0

## Overview

React Hook Form for performance, Yup for validation, MUI integration patterns, and consistent error handling for the Bluespice payroll application forms.

## Core Principles

### 1. React Hook Form Performance

- Use React Hook Form for all form handling
- Leverage uncontrolled components for better performance
- Minimize re-renders with proper form structure
- Use Controller for MUI component integration

### 2. Yup Validation Schema

- Define validation schemas separately from components
- Use Yup for client-side validation
- Implement async validation for server-side checks
- Provide clear, user-friendly error messages

### 3. MUI Integration

- Use Controller to integrate React Hook Form with MUI
- Maintain MUI styling and behavior
- Implement consistent form field patterns
- Use MUI form components (TextField, Select, etc.)

### 4. Error Handling

- Display validation errors inline
- Show server errors appropriately
- Implement loading states during submission
- Provide success feedback after submission

## Patterns & Examples

### Basic Form Setup

```javascript
// components/forms/EmployeeForm.js
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Box, Grid } from "@mui/material";
import { employeeSchema } from "@/schemas/employeeSchema";
import { useEmployees } from "@/hooks/useEmployees";

export const EmployeeForm = ({ employee, onClose }) => {
  const { addEmployee, updateEmployee } = useEmployees();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues: employee || {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      position: "",
      salary: "",
      hireDate: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (employee) {
        await updateEmployee(employee.id, data);
      } else {
        await addEmployee(data);
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Department"
                fullWidth
                error={!!errors.department}
                helperText={errors.department?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Salary"
                type="number"
                fullWidth
                error={!!errors.salary}
                helperText={errors.salary?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : employee ? "Update" : "Create"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
```

### Yup Validation Schemas

```javascript
// schemas/employeeSchema.js
import * as yup from "yup";

export const employeeSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address")
    .test("unique-email", "Email already exists", async function (value) {
      if (!value) return true;
      // Async validation for email uniqueness
      const response = await fetch(`/api/employees/check-email?email=${value}`);
      const { exists } = await response.json();
      return !exists;
    }),

  department: yup
    .string()
    .required("Department is required")
    .oneOf(["HR", "IT", "Finance", "Operations"], "Invalid department"),

  position: yup
    .string()
    .required("Position is required")
    .min(3, "Position must be at least 3 characters"),

  salary: yup
    .number()
    .required("Salary is required")
    .positive("Salary must be positive")
    .min(30000, "Salary must be at least $30,000")
    .max(500000, "Salary must be less than $500,000"),

  hireDate: yup
    .date()
    .required("Hire date is required")
    .max(new Date(), "Hire date cannot be in the future"),
});
```

### Payroll Form with Complex Validation

```javascript
// components/forms/PayrollForm.js
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers";
import { payrollSchema } from "@/schemas/payrollSchema";

export const PayrollForm = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(payrollSchema),
    defaultValues: {
      payPeriodStart: new Date(),
      payPeriodEnd: new Date(),
      employees: [],
      overtimeRate: 1.5,
      deductions: 0,
    },
  });

  const watchedEmployees = watch("employees");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="payPeriodStart"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Pay Period Start"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.payPeriodStart}
                    helperText={errors.payPeriodStart?.message}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="payPeriodEnd"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Pay Period End"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.payPeriodEnd}
                    helperText={errors.payPeriodEnd?.message}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="employees"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.employees}>
                <InputLabel>Select Employees</InputLabel>
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => selected.join(", ")}
                >
                  {availableEmployees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employees && (
                  <FormHelperText>{errors.employees.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating Payroll..." : "Generate Payroll"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
```

### Custom Form Field Component

```javascript
// components/forms/FormField.js
import { Controller } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export const FormField = ({
  name,
  control,
  label,
  type = "text",
  options = [],
  required = false,
  multiline = false,
  rows = 1,
  ...props
}) => {
  if (type === "select") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
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
          type={type}
          fullWidth
          required={required}
          multiline={multiline}
          rows={rows}
          error={!!error}
          helperText={error?.message}
          {...props}
        />
      )}
    />
  );
};
```

### Form with File Upload

```javascript
// components/forms/ImportForm.js
import { useForm, Controller } from "react-hook-form";
import { useRef } from "react";

export const ImportForm = ({ onSubmit }) => {
  const fileInputRef = useRef();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      file: null,
      importType: "employees",
    },
  });

  const watchedFile = watch("file");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue("file", file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="importType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Import Type</InputLabel>
                <Select {...field} label="Import Type">
                  <MenuItem value="employees">Employees</MenuItem>
                  <MenuItem value="payroll">Payroll Data</MenuItem>
                  <MenuItem value="timesheets">Timesheets</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            fullWidth
          >
            {watchedFile ? watchedFile.name : "Choose File"}
          </Button>
          {errors.file && (
            <Typography color="error" variant="caption">
              {errors.file.message}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || !watchedFile}
          >
            {isSubmitting ? "Importing..." : "Import Data"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
```

### Form Validation Utilities

```javascript
// utils/formValidation.js
import * as yup from "yup";

// Common validation patterns
export const commonValidations = {
  required: (message = "This field is required") =>
    yup.string().required(message),

  email: (message = "Must be a valid email") => yup.string().email(message),

  phone: (message = "Must be a valid phone number") =>
    yup.string().matches(/^\+?[\d\s\-\(\)]+$/, message),

  currency: (message = "Must be a valid amount") =>
    yup.number().positive(message).typeError(message),

  date: (message = "Must be a valid date") => yup.date().typeError(message),

  minLength: (min, message) => yup.string().min(min, message),

  maxLength: (max, message) => yup.string().max(max, message),
};

// Async validation helpers
export const createAsyncValidator = (apiCall, errorMessage) => {
  return yup
    .string()
    .test("async-validation", errorMessage, async function (value) {
      if (!value) return true;
      try {
        const result = await apiCall(value);
        return !result.exists;
      } catch {
        return false;
      }
    });
};

// Form error formatter
export const formatFormErrors = (errors) => {
  return Object.keys(errors).reduce((acc, key) => {
    acc[key] = errors[key]?.message || "Invalid value";
    return acc;
  }, {});
};
```

## Anti-Patterns

### ❌ Don't Do This

```javascript
// Don't use controlled components unnecessarily
const BadForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // ... many more state variables

  return (
    <form>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      {/* Causes re-render on every keystroke */}
    </form>
  );
};

// Don't validate in component
const BadValidation = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email.includes("@")) {
      setEmailError("Invalid email");
    }
  };
  // Manual validation - error prone
};

// Don't mix form libraries
const BadMixedForms = () => {
  const [formikForm] = useFormik(); // Formik
  const { register } = useForm(); // React Hook Form
  // Confusing and inconsistent
};
```

### ✅ Do This Instead

```javascript
// Use React Hook Form with uncontrolled components
const GoodForm = () => {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      {/* No re-renders, better performance */}
    </form>
  );
};

// Use Yup for validation
const GoodValidation = () => {
  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email required"),
  });

  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // Declarative validation
};

// Consistent form library usage
const GoodConsistentForms = () => {
  const { register, handleSubmit, control } = useForm();
  // Single form library throughout app
};
```

## Related Files/Dependencies

### Required Packages

```json
{
  "react-hook-form": "^7.0.0",
  "@hookform/resolvers": "^3.0.0",
  "yup": "^1.0.0",
  "@mui/x-date-pickers": "^6.0.0"
}
```

### File Structure

```
components/
├── forms/
│   ├── EmployeeForm.js
│   ├── PayrollForm.js
│   ├── ImportForm.js
│   └── FormField.js
schemas/
├── employeeSchema.js
├── payrollSchema.js
└── commonSchemas.js
utils/
├── formValidation.js
└── formHelpers.js
```

### Form Best Practices

1. **Performance**: Use uncontrolled components with React Hook Form
2. **Validation**: Define schemas separately from components
3. **Error Handling**: Display errors inline with helpful messages
4. **Loading States**: Show loading during submission
5. **Accessibility**: Use proper labels and ARIA attributes
6. **Testing**: Test form validation and submission flows
7. **Reusability**: Create reusable form field components
