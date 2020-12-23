import ExcelJS from 'exceljs';
export interface IExcelExportOptions {
    sheetName: string;
}
export declare type IStyle = Partial<ExcelJS.Style>;
export interface IColumnItem {
    title: string;
    key?: string;
    dataIndex: string;
    width?: number;
    style?: IStyle;
    colStyle?: IStyle;
    children?: Array<IColumnItem>;
    [propName: string]: any;
}
export declare type IColumns = Array<IColumnItem>;
declare type dataSourceItem = {
    [propName: string]: any;
};
export declare type IdataSource = Array<dataSourceItem>;
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
export declare type IHeaderCells = Array<IHeaderCell>;
export interface IDataItem {
    colIndex: number;
    dataIndex: string;
    [propName: string]: any;
}
export declare type IDataItems = Array<IDataItem>;
export interface IDataRowItem {
    startColIndex: number;
    depth: number;
    data: dataSourceItem;
}
export declare type IDataRowItems = IDataRowItem[];
export interface IsheetHeader {
    cells: IHeaderCells;
    headerEndRow: number;
    dataItems: IDataItems;
}
export interface IDataRowsResult {
    maxStartColIndex: number;
    dataRows: IDataRowItems;
}
export interface IExportExcelOption {
    sheetHeader: IsheetHeader;
    dataRowsResult: IDataRowsResult;
    fileName: string;
}
export {};
