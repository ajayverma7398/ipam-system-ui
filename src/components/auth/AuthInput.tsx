'use client';

import { useState, InputHTMLAttributes, forwardRef } from 'react';

export interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: 'user' | 'lock' | 'email' | 'name';
  showPasswordToggle?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      type,
      name,
      value,
      placeholder,
      error,
      disabled = false,
      onChange,
      icon,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    const getIcon = () => {
      switch (icon) {
        case 'user':
          return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                fill="currentColor"
              />
              <path
                d="M10 12C5.58172 12 2 14.6863 2 18V20H18V18C18 14.6863 14.4183 12 10 12Z"
                fill="currentColor"
              />
            </svg>
          );
        case 'lock':
          return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 2C8.34315 2 7 3.34315 7 5V7H5C3.89543 7 3 7.89543 3 9V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V9C17 7.89543 16.1046 7 15 7H13V5C13 3.34315 11.6569 2 10 2ZM10 4C10.5523 4 11 4.44772 11 5V7H9V5C9 4.44772 9.44772 4 10 4Z"
                fill="currentColor"
              />
            </svg>
          );
        case 'email':
          return (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.00333 5.88355L9.99999 9.88186L17.9967 5.8835C17.9363 4.83315 17.0655 4 16 4H4C2.93452 4 2.06363 4.83318 2.00333 5.88355Z"
                fill="currentColor"
              />
              <path
                d="M18 8.1179L9.99999 12.1179L2 8.11796V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V8.1179Z"
                fill="currentColor"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div className="relative">
        <label htmlFor={name} className="sr-only">
          {label}
        </label>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            {getIcon()}
          </div>
        )}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showPassword ? (
                <>
                  <path
                    d="M10 4C6 4 3.16 6.74 2 10.5C3.16 14.26 6 17 10 17C14 17 16.84 14.26 18 10.5C16.84 6.74 14 4 10 4ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
                    fill="currentColor"
                  />
                  <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="2" />
                </>
              ) : (
                <>
                  <path
                    d="M10 4C6 4 3.16 6.74 2 10.5C3.16 14.26 6 17 10 17C14 17 16.84 14.26 18 10.5C16.84 6.74 14 4 10 4ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z"
                    fill="currentColor"
                  />
                </>
              )}
            </svg>
          </button>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder || label}
          disabled={disabled}
          onChange={onChange}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full ${
            icon ? 'pl-11' : 'pl-4'
          } ${showPasswordToggle && type === 'password' ? 'pr-11' : 'pr-4'} py-3 border ${
            error ? 'border-red-500' : 'border-slate-300'
          } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
          } transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed`}
          {...props}
        />
        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;

