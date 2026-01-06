"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";

interface PoolValidatorProps {
  cidr: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  overlaps: Array<{
    poolId: string;
    cidr: string;
    description: string;
  }>;
  suggestions: string[];
}

export function PoolValidator({ cidr }: PoolValidatorProps) {
  const validation = useMemo<ValidationResult>(() => {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      overlaps: [],
      suggestions: [],
    };

    if (!cidr || !cidr.includes("/")) {
      return {
        isValid: false,
        errors: ["CIDR notation is required"],
        warnings: [],
        overlaps: [],
        suggestions: [],
      };
    }

    const [ip, prefixLengthStr] = cidr.split("/");
    const prefixLength = parseInt(prefixLengthStr, 10);

    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
      result.isValid = false;
      result.errors.push("Invalid prefix length. Must be between 0 and 32.");
      return result;
    }

    const ipParts = ip.split(".").map(Number);
    if (ipParts.length !== 4 || ipParts.some((part) => isNaN(part) || part < 0 || part > 255)) {
      result.isValid = false;
      result.errors.push("Invalid IP address format.");
      return result;
    }

    const newNetwork = ipParts.map((part, i) => {
      const bits = Math.min(8, Math.max(0, prefixLength - i * 8));
      const mask = (0xff << (8 - bits)) & 0xff;
      return part & mask;
    });

    pools.forEach((pool) => {
      const [existingIp, existingPrefix] = pool.cidr.split("/");
      const existingPrefixLength = parseInt(existingPrefix, 10);
      const existingParts = existingIp.split(".").map(Number);

      const existingNetwork = existingParts.map((part, i) => {
        const bits = Math.min(8, Math.max(0, existingPrefixLength - i * 8));
        const mask = (0xff << (8 - bits)) & 0xff;
        return part & mask;
      });

      const minPrefix = Math.min(prefixLength, existingPrefixLength);
      let overlap = true;
      for (let i = 0; i < 4; i++) {
        const bits = Math.min(8, Math.max(0, minPrefix - i * 8));
        const mask = (0xff << (8 - bits)) & 0xff;
        if ((newNetwork[i] & mask) !== (existingNetwork[i] & mask)) {
          overlap = false;
          break;
        }
      }

      if (overlap) {
        result.overlaps.push({
          poolId: pool.id,
          cidr: pool.cidr,
          description: pool.description,
        });
        result.warnings.push(`Overlaps with existing pool: ${pool.cidr}`);
      }
    });

    if (result.overlaps.length > 0) {
      const firstOctet = ipParts[0];
      if (firstOctet === 192 && ipParts[1] === 168) {
        result.suggestions.push(`192.168.${(ipParts[2] + 1) % 256}.0/24`);
      } else if (firstOctet === 10) {
        result.suggestions.push(`10.${(ipParts[1] + 1) % 256}.0.0/16`);
      }
    }

    if (prefixLength < 8) {
      result.warnings.push("Very large network. Consider using a smaller subnet.");
    }

    if (prefixLength > 30) {
      result.warnings.push("Very small network. Only 2 usable hosts.");
    }

    return result;
  }, [cidr]);

  if (!cidr || !cidr.includes("/")) {
    return null;
  }

  return (
    <Card>
      <h4 className="text-md font-semibold text-slate-900 mb-4">Validation Results</h4>

      {validation.isValid && validation.overlaps.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-green-800">CIDR notation is valid and no overlaps detected.</p>
        </div>
      )}

      {validation.errors.length > 0 && (
        <div className="space-y-2 mb-4">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {validation.warnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-yellow-800">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {validation.overlaps.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Overlapping Pools:</p>
          <div className="space-y-2">
            {validation.overlaps.map((overlap) => (
              <div key={overlap.poolId} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-900">{overlap.cidr}</p>
                {overlap.description && (
                  <p className="text-xs text-orange-700 mt-1">{overlap.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {validation.suggestions.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Suggested CIDRs:</p>
          <div className="flex flex-wrap gap-2">
            {validation.suggestions.map((suggestion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

