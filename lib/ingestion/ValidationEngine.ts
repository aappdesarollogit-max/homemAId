import type { RawPurchaseInput } from "@/lib/ingestion/DataIngestionEngine";

export type ValidationIssue = {
  field: keyof RawPurchaseInput | "items";
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

export default class ValidationEngine {
  validate(inputs: RawPurchaseInput[]): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (inputs.length === 0) {
      issues.push({
        field: "items",
        message: "Debe existir al menos un producto.",
      });
    }

    inputs.forEach((input, index) => {
      if (!input.producto?.trim()) {
        issues.push({
          field: "producto",
          message: `Producto obligatorio en item ${index + 1}.`,
        });
      }

      if (Number(input.cantidad ?? 0) <= 0) {
        issues.push({
          field: "cantidad",
          message: `Cantidad debe ser mayor a 0 en item ${index + 1}.`,
        });
      }

      if (!input.unidad?.trim()) {
        issues.push({
          field: "unidad",
          message: `Unidad obligatoria en item ${index + 1}.`,
        });
      }

      if (Number(input.precio ?? 0) < 0) {
        issues.push({
          field: "precio",
          message: `Precio no puede ser negativo en item ${index + 1}.`,
        });
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
