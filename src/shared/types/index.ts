export interface PageInfo {
  title: string;
  url: string;
}

export interface Format {
  id: string;
  name: string;
  template: string;
  autoCopy?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FormatVariables = {
  title: string;
  url: string;
};
