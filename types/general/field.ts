export type Field =
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      type: "boolean";
      name: string;
      label: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: {
        label: string;
        value: string;
      }[];
    }
  | {
      type: "date";
      name: string;
      label: string;
    };