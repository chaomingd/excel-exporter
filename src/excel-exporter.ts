import ExcelJS from 'exceljs'
import saveAs from 'file-saver'
import {
  mapKeyProp,
  isObject
} from './util'
import {
  IExcelExportOptions,
  IColumns,
  IColumnItem,
  IdataSource,
  IdataSourceOption,
  IStyle,
  IHeaderCell,
  IHeaderCells,
  IDataItem,
  IDataItems,
  IDataRowItem,
  IDataRowItems,
  IDataRowsResult,
  IsheetHeader,
  IExportExcelOption
} from './interface'

class ExcelExporter {
  private styleKeys = ['numFmt', 'font', 'alignment', 'border', 'fill'] // 样式属性
  private _workbook: ExcelJS.Workbook;
  private _worksheet: ExcelJS.Worksheet;
  private _columns: IColumns = [];
  private _headerDepth: number = 1;
  private _childrenColumnName: string = 'children'; // 树形结构时子级的属性
  private _indentSize: number = 3; // 树结构时缩进的宽度
  private _dataSource: IdataSource = [];
  constructor (options: IExcelExportOptions) {
    if (!options || !isObject(options)) throw new Error('options must be object')
    const { sheetName } = options
    this._workbook = new ExcelJS.Workbook()
    this._worksheet = this.workbook.addWorksheet(sheetName)
  }
  get workbook () {
    return this._workbook
  }
  get worksheet () {
    return this._worksheet
  }
  setColumns (columns: IColumns) { // 设置列 表头
    if (!Array.isArray(columns)) throw new Error('columns must be array')
    const result = this.calcHeaderDepth(columns)
    this._columns = result.newColumns
    this._headerDepth = result.maxDepth
  }
  setDataSource (data: IdataSource, options?: IdataSourceOption) { // 设置数据  showOutlineLevel 是否显示大纲级别, 对于树形结构有用
    if (!Array.isArray(data)) throw new Error('dataSource must be array')
    if (options && !isObject(options)) throw new Error('options must be object')
    this._dataSource = data
    if (options) {
      const { childrenColumnName, indentSize } = (options as IdataSourceOption)
      if (childrenColumnName) {
        this._childrenColumnName = childrenColumnName
      }
      if (indentSize && typeof indentSize === 'number') {
        this._indentSize = indentSize
      }
    }
  }
  exportFile (fileName: string, done: () => any) { // 导出文件
    const sheetHeader = this.resolveRowHeader(this._columns, this._headerDepth)
    const dataRowsResult = this.resolveDataSource(this._dataSource)
    this.exportExcel({
      sheetHeader: sheetHeader,
      dataRowsResult: dataRowsResult,
      fileName
    }, done)
  }
  exportExcel (option: IExportExcelOption, done: () => any) { // 写入excel数据并导出
    if (!option || !isObject(option)) throw new Error('option must be object')
    const { sheetHeader, dataRowsResult, fileName } = option
    const workbook = this.workbook
    const headerCells = sheetHeader.cells
    if (dataRowsResult.maxStartColIndex > 1) { // 如果maxStartColIndex > 1 表示数据是树形结构的
      this.correctHeaderCells(dataRowsResult.maxStartColIndex, sheetHeader) // 修正表头以满足树结构显示
    }
    this.renderHeaderCell(headerCells) // 渲染表头数据
    this.renderDataSource(dataRowsResult, sheetHeader) // 渲染数据
    workbook.xlsx.writeBuffer().then((buffer) => {
      done && done()
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
    })
  }
  correctHeaderCells(treeWidth: number, sheetHeader: IsheetHeader) { // 修正表头的colSpan 和 colIndex
    sheetHeader.cells.forEach((headerCell: IHeaderCell) => {
      if (headerCell.colIndex === 1) { // 第一列增加colSpan
        headerCell.colSpan += treeWidth - 1
      } else { // 第二列开始增加colIndex
        headerCell.colIndex += treeWidth - 1
      }
    })
    sheetHeader.dataItems.forEach((dataItem: IDataItem) => { // 修正dataItem的colIndex
      if (dataItem.colIndex === 1) return
      dataItem.colIndex += treeWidth - 1
    })
  }
  renderDataSource (dataRowsResult: IDataRowsResult, sheetHeader: IsheetHeader) { // 渲染数据
    const worksheet = this.worksheet
    const startRow = sheetHeader.headerEndRow + 1
    const dataItems = sheetHeader.dataItems
    const _this = this
    dataRowsResult.dataRows.forEach((dataRowItem: IDataRowItem, index: number) => {
      const rowIndex: number = index + startRow
      const row: ExcelJS.Row = worksheet.getRow(rowIndex)
      dataItems.forEach((dataItem: IDataItem) => {
        let cellColIndex: number
        if (dataItem.colIndex === 1) {
          cellColIndex = dataItem.colIndex + dataRowItem.startColIndex - 1
          if (dataRowsResult.maxStartColIndex > 1) { // 处理树结构单元格合并
            // 横向合并
            const hStartColIndex = cellColIndex
            const hEndColIndex = dataRowsResult.maxStartColIndex
            worksheet.mergeCells(rowIndex, hStartColIndex, rowIndex, hEndColIndex)
  
            // 纵向合并
            if (dataRowItem.depth > 2) {
              const vStartRowIndex = rowIndex + 1
              const vEndRowIndex = rowIndex + dataRowItem.depth - 1
              // console.log(vStartRowIndex, cellColIndex, vEndRowIndex, cellColIndex)
              worksheet.mergeCells(vStartRowIndex, cellColIndex, vEndRowIndex, cellColIndex)
  
              // 设置树节点缩进
              const column = worksheet.getColumn(cellColIndex)
              column.width = this._indentSize
            }
            if (dataRowItem.startColIndex > 1 && dataRowItem.startColIndex === dataRowsResult.maxStartColIndex) { // 设置树形结构最后一个缩进列的宽度为第一个表头的宽度
              if (mapKeyProp(sheetHeader.cells, '0.width', false)) {
                const firstColGroupLastColumn = worksheet.getColumn(cellColIndex)
                if (!firstColGroupLastColumn.width) {
                  firstColGroupLastColumn.width = sheetHeader.cells[0].width
                }
              }
            }
          }
        } else {
          cellColIndex = dataItem.colIndex
        }
        const cell: ExcelJS.Cell = row.getCell(cellColIndex)
        // cell.value = dataRowItem.data[dataItem.dataIndex]
        cell.value = mapKeyProp(dataRowItem.data, dataItem.dataIndex, '')
      })
    })
  }
  renderHeaderCell (headerCells: IHeaderCells) { // 渲染表头
    const worksheet = this.worksheet
    headerCells.forEach((headerCell: IHeaderCell) => {
      const row = worksheet.getRow(headerCell.rowIndex)
      const column = worksheet.getColumn(headerCell.colIndex)
      if (headerCell.colSpan === 1) {
        this.setColStyle(column, headerCell.width, headerCell.colStyle || {}) // 设置列的宽度及样式
      }
      const cell = row.getCell(headerCell.colIndex)
      cell.value = headerCell.title
      this.setCellStyle(cell, headerCell.style || {}) // 设置单元格样式
      if (headerCell.rowSpan > 1 || headerCell.colSpan > 1) {
        // 合并单元格
        const startRowIndex = headerCell.rowIndex
        const endRowIndex = headerCell.rowIndex + headerCell.rowSpan - 1
        const startColIndex = headerCell.colIndex
        const endColIndex = headerCell.colIndex + headerCell.colSpan - 1
        worksheet.mergeCells(startRowIndex, startColIndex, endRowIndex, endColIndex)
      }
    })
  }
  calcHeaderDepth (columns: IColumns) { // 计算列表头的深度  占多少行 并返回colmns的克隆对象
    const depths: number[] = []
    function workder(data, depth) {
      const results: IColumns = []
      data.forEach((item: IColumnItem) => {
        const newItem = { ...item }
        depths.push(depth)
        if (item.children) {
          newItem.children = workder(item.children, depth + 1)
        }
        results.push(newItem)
      })
      return results
    }
    const newColumns: IColumns = workder(columns, 1)
    const maxDepth: number = Math.max(...depths)
    return {
      newColumns,
      maxDepth
    }
  }
  setCellStyle (cell: ExcelJS.Cell, style: IStyle) { // 设置单元格样式
    const styleKeys = this.styleKeys
    Object.keys(style).forEach(key => {
      if (styleKeys.indexOf(key) > -1) {
        cell[key] = style[key]
      }
    })
  }
  setColStyle (col: ExcelJS.Column, colWidth: number | undefined, colStyle: IStyle) { // 设置列样式
    const styleKeys = this.styleKeys
    Object.keys(colStyle).forEach(key => {
      if (styleKeys.indexOf(key) > -1) {
        col[key] = colStyle[key]
      }
    })
    if (colWidth !== undefined) {
      col.width = colWidth
    }
  }
  setHeaderGroupStyle (colItem: IColumnItem) { //表头分组默认居中显示
    if (!colItem.style) {
      colItem.style = {}
    }
    if (!colItem.style.alignment) {
      colItem.style.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      }
    }
  }
  resolveDataSource (data: IdataSource) { // 处理数据， 生成每行数据的开始列号、深度、及最大深度等信息
    const dataRows: IDataRowItems = []
    let maxStartColIndex = 1
    const _this = this
    function worker(data, parents?: IDataRowItems) { // 支持树形结构
      data.forEach(item => {
        let startColIndex = 1 // 开始的列号
        let depth = 1 // 深度
        if (parents) {
          const parent = parents[parents.length - 1]
          startColIndex += parent.startColIndex
        }
        if (startColIndex > maxStartColIndex) {
          maxStartColIndex = startColIndex
        }
        const dataRowItem: IDataRowItem = {
          startColIndex: startColIndex,
          depth,
          data: item
        }
        dataRows.push(dataRowItem)
        const children = item[_this._childrenColumnName]
        if (children) {
          dataRowItem.depth += children.length // 更新深度
          let newParents: IDataRowItems = []
          if (parents) {
            parents.forEach(parent => { // 更新父级的深度
              newParents.push(parent)
              parent.depth += children.length
            })
            newParents.push(dataRowItem)
          } else {
            newParents = [dataRowItem]
          }
          worker(children, newParents)
        }
      })
    }
    worker(data)
    return {
      maxStartColIndex,
      dataRows
    }
  }
  resolveRowHeader (columns: IColumns, rowDepth: number) { // 处理表头， 输出一维数组， 包含每个表头的rowIndex, colIndex, colSpan, rowSpan以及样式
    const results:IHeaderCells = []
    const dataItems: IDataItems = []
    const _this = this;
    function worker (columns: IColumns, rowSpan: number, parents?: IHeaderCell) {
      columns.forEach((col: IColumnItem, index: number) => {
        const colItem = col
        let rowIndex: number = 1
        let colIndex: number = 1
        if (parents) {
          const directParent = parents[parents.length - 1]
          colIndex = index + directParent.colIndex // 父级colIndex 推断子级的colIndex
          rowIndex = directParent.rowIndex + 1 // rowIndex + 1
        } else {
          const prevColIntem = columns[index - 1] // 前面一列
          if (prevColIntem) {
            colIndex = prevColIntem.colIndex + prevColIntem.colSpan // 由前面一列的colIndex 推断后面一列的colIndex
          } else {
            colIndex = 1
          }
        }
        colItem.colIndex = colIndex
        colItem.rowIndex = rowIndex
        colItem.colSpan = 1 // 默认colSpan为0
        if (col.children) {
          colItem.colSpan = (colItem.children as IHeaderCells).length
          colItem.rowSpan = 1
          _this.setHeaderGroupStyle(colItem) // 默认居中对齐
          let newParents // 新的parent
          if (parents) {
            newParents = parents.map(item => {
              item.colSpan += (colItem.children as IHeaderCells).length - 1
              return item
            })
            newParents.push(colItem)
          } else {
            newParents = [colItem]
          }
          worker(col.children, rowSpan - 1, newParents)
        } else {
          if (!colItem.dataIndex) {
            throw new Error(`column that has'nt children must have dataIndex key`)
          }
          dataItems.push({ // 增加一列数据列
            colIndex: colIndex,
            dataIndex: colItem.dataIndex
          } as IDataItem)
          colItem.rowSpan = rowSpan
          if (rowSpan > 1) {
            if (!colItem.style) {
              colItem.style = {}
            }
            if (!colItem.style.alignment) {
              colItem.style.alignment = {
                vertical: 'middle'
              }
            }
          }
        }
        results.push((filterColItem(colItem) as IHeaderCell))
      })
    }
    function filterColItem (colItem) { // 去掉children属性
      const result = {}
      Object.keys(colItem).forEach(key => {
        if (key !== 'children') {
          result[key] = colItem[key]
        }
      })
      return result
    }
    worker(columns, rowDepth)
    return {
      headerEndRow: rowDepth,
      cells: results,
      dataItems
    }
  }
}

export {
  ExcelExporter
}
