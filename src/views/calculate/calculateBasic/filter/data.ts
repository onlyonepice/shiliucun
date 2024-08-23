export interface PATTERNANALYSIS {
  id: number;
  text: string;
}
export interface FILTERDATA {
  patternAnalysis: number;
}
export interface SHOWINFOLIST {
  title: string;
  value: string;
}

export const PatternAnalysis = [
  { id: 1, text: "EMC合同能源" },
  { id: 2, text: "业主自投" },
];
