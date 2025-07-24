export interface PageInfo {
  title: string;
  url: string;
}

export interface Format {
  id: string;
  name: string;
  template: string;
  createdAt: number;
  updatedAt: number;
}

export type FormatVariables = {
  title: string;
  url: string;
};