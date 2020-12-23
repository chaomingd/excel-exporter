import ExcelJS from 'exceljs'
export interface IExcelExportOptions {
  sheetName: string;
}
export type IStyle = Partial<ExcelJS.Style>

export interface IColumnItem {
  title: string;
  key?: string;
  dataIndex: string;
  width?: number;
  style?: IStyle;
  colStyle?: IStyle;
  children?: Array<IColumnItem>;
  [propName: string]: any
}

export type IColumns = Array<IColumnItem>

type dataSourceItem = object

export type IdataSource = Array<dataSourceItem>
export interface IdataSourceOption {
  childrenColumnName: string;
  indentSize: number;
}

export interface IHeaderCell extends IColumnItem {
  colIndex: number;
  colSpan: number;
  rowIndex: number;
  rowSpan: number;
}

export type IHeaderCells = Array<IHeaderCell>

export interface IDataItem {
  colIndex: number;
  dataIndex: string;
  [propName: string]: any;
}
export type IDataItems = Array<IDataItem>

export interface IDataRowItem {
  startColIndex: number;
  depth: number;
  data: dataSourceItem
}

export type IDataRowItems = IDataRowItem[]

export interface IsheetHeader {
  cells: IHeaderCells;
  headerEndRow: number;
  dataItems: IDataItems
}

export interface IDataRowsResult {
  maxStartColIndex: number;
  dataRows: IDataRowItems;
}

export interface IExportExcelOption {
  sheetHeader: IsheetHeader;
  dataRowsResult: IDataRowsResult;
  fileName: string
}