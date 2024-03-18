
export interface PATTERNANALYSIS {
  id: number;
  text: string
}
export interface SUBSIDY {
  id: number;
  text: string
}
export interface FILTERDATA {
  patternAnalysis: number;
  subsidy: number;
}
export interface SHOWINFOLIST {
  title: string;
  value: string;
}

export const PatternAnalysis = [
  { id: 1, text: 'EMC合同能源' },
  { id: 2, text: '业主自投' },
]
export const Subsidy = [
  { id: 1, text: '是' },
  { id: 2, text: '否' },
]