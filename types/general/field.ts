export type FieldType =
  | "text"
  | "select"
  | "segmented"
  | "date"
  | "boolean";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface Field {
  name: string;

  label: string;

  type: FieldType;

  placeholder?: string;

  options?: FieldOption[];

  keyboardType?:
    | "default"
    | "number-pad"
    | "numeric";

  required?: boolean;

  numbersOnly?: boolean;

  visibleWhen?: {
    field: string;
    equals: any;
  };
}