import type { FormEvent } from "react";
import type { CustomerDetails } from "../../../types/domain";
import type { FieldError } from "../../../types/api";
import { Button } from "../../../components/Button";
import "./CustomerForm.css";

interface CustomerFormProps {
  customer: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
  fieldErrors: FieldError[];
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

function errorFor(fieldErrors: FieldError[], field: string): string | undefined {
  return fieldErrors.find((e) => e.field === field)?.message;
}

export function CustomerForm({ customer, onChange, fieldErrors, onSubmit, isSubmitting, submitLabel }: CustomerFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function update<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    onChange({ ...customer, [key]: value });
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <Field
        id="fullName"
        label="Full name"
        value={customer.fullName}
        onChange={(v) => update("fullName", v)}
        error={errorFor(fieldErrors, "customer.fullName")}
        autoComplete="name"
      />
      <Field
        id="email"
        label="Email"
        type="email"
        value={customer.email}
        onChange={(v) => update("email", v)}
        error={errorFor(fieldErrors, "customer.email")}
        autoComplete="email"
      />
      <Field
        id="phone"
        label="Phone number"
        type="tel"
        value={customer.phone}
        onChange={(v) => update("phone", v)}
        error={errorFor(fieldErrors, "customer.phone")}
        autoComplete="tel"
      />
      <Field
        id="address"
        label="Service address"
        value={customer.address}
        onChange={(v) => update("address", v)}
        error={errorFor(fieldErrors, "customer.address")}
        autoComplete="street-address"
      />

      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

function Field({ id, label, value, onChange, error, type = "text", autoComplete }: FieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="form-field-error">
          {error}
        </p>
      )}
    </div>
  );
}
