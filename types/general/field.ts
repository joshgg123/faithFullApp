export type FieldType =
  | "text"
  | "select"
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
}