import ExcelJS from 'exceljs';
import { IExcelExportOptions, IColumns, IColumnItem, IdataSource, IdataSourceOption, IStyle, IHeaderCells, IDataItems, IDataRowItems, IDataRowsResult, IsheetHeader, IExportExcelOption } from './interface';
declare class ExcelExporter {
    private styleKeys;
    private _workbook;
    private _worksheet;
    private _columns;
    private _headerDepth;
    private _childrenColumnName;
    private _indentSize;
    private _dataSource;
    private _isDisposed;
    constructor(options: IExcelExportOptions);
    get workbook(): ExcelJS.Workbook | null;
    get worksheet(): ExcelJS.Worksheet | null;
    dispose(): void;
    error(): void;
    setColumns(columns: IColumns): void;
    setDataSource(data: IdataSource, options?: IdataSourceOption): void;
    exportFile(fileName: string, done: () => any): void;
    exportExcel(option: IExportExcelOption, done: () => any): void;
    correctHeaderCells(treeWidth: number, sheetHeader: IsheetHeader): void;
    renderDataSource(dataRowsResult: IDataRowsResult, sheetHeader: IsheetHeader): void;
    renderHeaderCell(headerCells: IHeaderCells): void;
    calcHeaderDepth(columns: IColumns): {
        newColumns: IColumns;
        maxDepth: number;
    };
    setCellStyle(cell: ExcelJS.Cell, style: IStyle): void;
    setColStyle(col: ExcelJS.Column, colWidth: number | undefined, colStyle: IStyle): void;
    setHeaderGroupStyle(colItem: IColumnItem): void;
    resolveDataSource(data: IdataSource): {
        maxStartColIndex: number;
        dataRows: IDataRowItems;
    };
    resolveRowHeader(columns: IColumns, rowDepth: number): {
        headerEndRow: number;
        cells: IHeaderCells;
        dataItems: IDataItems;
    };
}
export { ExcelExporter };
