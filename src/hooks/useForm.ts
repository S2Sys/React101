/**
 * useForm Custom Hook
 *
 * Manages form state, validation, and submission.
 * Demonstrates useState, useCallback, and complex state management.
 *
 * CONCEPTS: Custom hooks, useState, useCallback, form handling, validation
 */

import { useState, useCallback } from 'react';
import { FormState, FormHandlers, FormErrors } from '../types';

/**
 * useForm Hook
 *
 * Generic form state management hook
 *
 * @template T - The type of form values
 * @param initialValues - Initial form values
 * @param onSubmit - Function to call when form is submitted with valid data
 * @param validate - Optional validation function
 * @returns Form state and handlers
 *
 * CONCEPT: Custom hook with generics, complex state management
 *
 * USAGE:
 * const { values, errors, handleChange, handleSubmit } = useForm(
 *   { email: '', password: '' },
 *   async (values) => { await login(values.email, values.password); },
 *   (values) => validateLoginForm(values.email, values.password)
 * );
 *
 * <input
 *   name="email"
 *   value={values.email}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 * />
 * <form onSubmit={handleSubmit(async (values) => { ... })}>
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => FormErrors
): FormHandlers<T> => {
  // Form state management
  // CONCEPT: useState with complex object state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track if form has been modified
  // CONCEPT: Comparing objects for changes
  const isDirty = Object.keys(initialValues).some(
    (key) => initialValues[key as keyof T] !== values[key as keyof T]
  );

  /**
   * Handle input change
   * CONCEPT: Event handling, state updates, partial object updates
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      // Handle checkbox differently
      const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      // Update value for this field
      setValues((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Handle blur event
   * CONCEPT: Field-level validation, marking field as touched
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;

      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate this field if validation function provided
      if (validate) {
        const fieldErrors = validate(values);
        if (fieldErrors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldErrors[name],
          }));
        }
      }
    },
    [validate, values]
  );

  /**
   * Handle form submission
   * CONCEPT: Form submission, validation, async handling
   */
  const handleSubmit = useCallback(
    (callback: (values: T) => Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Record<keyof T, boolean>
        );
        setTouched(allTouched);

        // Validate form
        const newErrors = validate ? validate(values) : {};
        setErrors(newErrors);

        // Don't submit if there are errors
        if (Object.keys(newErrors).length > 0) {
          return;
        }

        try {
          setIsSubmitting(true);
          await callback(values);
        } catch (err) {
          // Error is handled by the callback, we just stop loading
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setErrors({ submit: errorMessage });
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validate]
  );

  /**
   * Reset form to initial values
   * CONCEPT: Form reset, state initialization
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    );
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set a specific field value programmatically
   * CONCEPT: Programmatic state updates
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
};

/**
 * useFormField Hook
 *
 * Manages state for a single form field
 *
 * @param initialValue - Initial field value
 * @param validate - Optional validation function for this field
 * @returns Field value, error, handlers, and utilities
 *
 * CONCEPT: Simpler hook for single fields
 *
 * USAGE:
 * const email = useFormField('', validateEmail);
 * <input value={email.value} onChange={email.handleChange} />
 * {email.error && <span>{email.error}</span>}
 */
export const useFormField = (
  initialValue: string = '',
  validate?: (value: string) => string
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Clear error when user starts typing
      if (error) {
        setError('');
      }
    },
    [error]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [value, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    setValue,
    setError,
    handleChange,
    handleBlur,
    reset,
  };
};

/**
 * useFormArray Hook
 *
 * Manages an array of form values (for repeating fields like multiple tags)
 *
 * @param initialValues - Initial array of values
 * @returns Array handlers and utilities
 *
 * CONCEPT: Array form management, push/pop operations
 *
 * USAGE:
 * const tags = useFormArray(['tag1', 'tag2']);
 * {tags.values.map((tag, i) => (
 *   <input key={i} value={tag} onChange={(e) => tags.setValue(i, e.target.value)} />
 * ))}
 * <button onClick={() => tags.push('')}>Add Tag</button>
 */
export const useFormArray = <T,>(initialValues: T[]) => {
  const [values, setValues] = useState<T[]>(initialValues);

  const push = useCallback(
    (value: T) => {
      setValues((prev) => [...prev, value]);
    },
    []
  );

  const pop = useCallback(() => {
    setValues((prev) => prev.slice(0, -1));
  }, []);

  const remove = useCallback((index: number) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const insert = useCallback((index: number, value: T) => {
    setValues((prev) => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index),
    ]);
  }, []);

  const setValue = useCallback((index: number, value: T) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    push,
    pop,
    remove,
    insert,
    setValue,
    reset,
    length: values.length,
  };
};
