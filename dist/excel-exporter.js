(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('exceljs'), require('file-saver')) :
  typeof define === 'function' && define.amd ? define(['exports', 'exceljs', 'file-saver'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ExcelExporter = {}, global.ExcelJS, global.saveAs));
}(this, (function (exports, ExcelJS, saveAs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ExcelJS__default = /*#__PURE__*/_interopDefaultLegacy(ExcelJS);
  var saveAs__default = /*#__PURE__*/_interopDefaultLegacy(saveAs);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function mapKeyProp(data, keyString, defaultValue, replacer) {
    var obj = data;
    if (!keyString || !data) return obj === undefined || obj === '--' || obj === '----' || obj === 'NaN' || obj === 'null' || obj === 'undefined' || obj === null ? defaultValue : obj;
    var keyChain = keyString.split('.');

    if (keyChain.length === 1) {
      obj = data[keyString];
    } else {
      keyChain.forEach(function (key) {
        if (obj) {
          obj = obj[key];
        }
      });
    }

    obj = obj === undefined || obj === '--' || obj === '----' || obj === 'NaN' || obj === 'null' || obj === 'undefined' || obj === null ? defaultValue : obj;

    if (replacer) {
      if (typeof replacer === 'function') {
        obj = replacer(obj);
      } else {
        if (replacer.trueString && replacer.falseString) {
          var trueValue = replacer.trueValue;
          var falseValue = replacer.falseValue;

          if (obj !== defaultValue) {
            if (trueValue !== undefined && falseValue !== undefined) {
              if (obj === trueValue) {
                obj = replacer.trueString;
              } else if (obj === falseValue) {
                obj = replacer.falseString;
              }
            } else {
              obj = obj ? replacer.trueString : replacer.falseString;
            }
          }
        }
      }
    }

    return obj;
  }
  function isObject(input) {
    return Object.prototype.toString.call(input) === '[object Object]';
  }

  var ExcelExporter = /*#__PURE__*/function () {
    function ExcelExporter(options) {
      _classCallCheck(this, ExcelExporter);

      this.styleKeys = ['numFmt', 'font', 'alignment', 'border', 'fill']; // 样式属性

      this._columns = [];
      this._headerDepth = 1;
      this._childrenColumnName = 'children'; // 树形结构时子级的属性

      this._indentSize = 3; // 树结构时缩进的宽度

      this._dataSource = [];
      this._isDisposed = false;
      if (!options || !isObject(options)) throw new Error('options must be object');
      var sheetName = options.sheetName;
      this._workbook = new ExcelJS__default['default'].Workbook();
      this._worksheet = this.workbook.addWorksheet(sheetName);
    }

    _createClass(ExcelExporter, [{
      key: "dispose",
      value: function dispose() {
        this._workbook = null;
        this._worksheet = null;
        this._isDisposed = true;
        this._columns = [];
        this._dataSource = [];
      }
    }, {
      key: "error",
      value: function error() {
        if (this._isDisposed) throw new Error('excel-exporter is disposed can not be used again');
      }
    }, {
      key: "setColumns",
      value: function setColumns(columns) {
        this.error();
        if (!Array.isArray(columns)) throw new Error('columns must be array');
        var result = this.calcHeaderDepth(columns);
        this._columns = result.newColumns;
        this._headerDepth = result.maxDepth;
      }
    }, {
      key: "setDataSource",
      value: function setDataSource(data, options) {
        this.error();
        if (!Array.isArray(data)) throw new Error('dataSource must be array');
        if (options && !isObject(options)) throw new Error('options must be object');
        this._dataSource = data;

        if (options) {
          var childrenColumnName = options.childrenColumnName,
              indentSize = options.indentSize;

          if (childrenColumnName) {
            this._childrenColumnName = childrenColumnName;
          }

          if (indentSize && typeof indentSize === 'number') {
            this._indentSize = indentSize;
          }
        }
      }
    }, {
      key: "exportFile",
      value: function exportFile(fileName, done) {
        this.error();
        var sheetHeader = this.resolveRowHeader(this._columns, this._headerDepth);
        var dataRowsResult = this.resolveDataSource(this._dataSource);
        this.exportExcel({
          sheetHeader: sheetHeader,
          dataRowsResult: dataRowsResult,
          fileName: fileName
        }, done);
      }
    }, {
      key: "exportExcel",
      value: function exportExcel(option, done) {
        this.error();
        if (!option || !isObject(option)) throw new Error('option must be object');
        var sheetHeader = option.sheetHeader,
            dataRowsResult = option.dataRowsResult,
            fileName = option.fileName;
        var workbook = this.workbook;
        var headerCells = sheetHeader.cells;

        if (dataRowsResult.maxStartColIndex > 1) {
          // 如果maxStartColIndex > 1 表示数据是树形结构的
          this.correctHeaderCells(dataRowsResult.maxStartColIndex, sheetHeader); // 修正表头以满足树结构显示
        }

        this.renderHeaderCell(headerCells); // 渲染表头数据

        this.renderDataSource(dataRowsResult, sheetHeader); // 渲染数据

        workbook.xlsx.writeBuffer().then(function (buffer) {
          done && done();
          saveAs__default['default'](new Blob([buffer], {
            type: 'application/octet-stream'
          }), fileName + '.xlsx');
        });
      }
    }, {
      key: "correctHeaderCells",
      value: function correctHeaderCells(treeWidth, sheetHeader) {
        this.error();
        sheetHeader.cells.forEach(function (headerCell) {
          if (headerCell.colIndex === 1) {
            // 第一列增加colSpan
            headerCell.colSpan += treeWidth - 1;
          } else {
            // 第二列开始增加colIndex
            headerCell.colIndex += treeWidth - 1;
          }
        });
        sheetHeader.dataItems.forEach(function (dataItem) {
          if (dataItem.colIndex === 1) return;
          dataItem.colIndex += treeWidth - 1;
        });
      }
    }, {
      key: "renderDataSource",
      value: function renderDataSource(dataRowsResult, sheetHeader) {
        var _this2 = this;

        this.error();
        var worksheet = this.worksheet;
        var startRow = sheetHeader.headerEndRow + 1;
        var dataItems = sheetHeader.dataItems;

        dataRowsResult.dataRows.forEach(function (dataRowItem, index) {
          var rowIndex = index + startRow;
          var row = worksheet.getRow(rowIndex);
          dataItems.forEach(function (dataItem) {
            var cellColIndex;

            if (dataItem.colIndex === 1) {
              cellColIndex = dataItem.colIndex + dataRowItem.startColIndex - 1;

              if (dataRowsResult.maxStartColIndex > 1) {
                // 处理树结构单元格合并
                // 横向合并
                var hStartColIndex = cellColIndex;
                var hEndColIndex = dataRowsResult.maxStartColIndex;
                worksheet.mergeCells(rowIndex, hStartColIndex, rowIndex, hEndColIndex); // 纵向合并

                if (dataRowItem.depth > 2) {
                  var vStartRowIndex = rowIndex + 1;
                  var vEndRowIndex = rowIndex + dataRowItem.depth - 1; // console.log(vStartRowIndex, cellColIndex, vEndRowIndex, cellColIndex)

                  worksheet.mergeCells(vStartRowIndex, cellColIndex, vEndRowIndex, cellColIndex); // 设置树节点缩进

                  var column = worksheet.getColumn(cellColIndex);
                  column.width = _this2._indentSize;
                }

                if (dataRowItem.startColIndex > 1 && dataRowItem.startColIndex === dataRowsResult.maxStartColIndex) {
                  // 设置树形结构最后一个缩进列的宽度为第一个表头的宽度
                  if (mapKeyProp(sheetHeader.cells, '0.width', false)) {
                    var firstColGroupLastColumn = worksheet.getColumn(cellColIndex);

                    if (!firstColGroupLastColumn.width) {
                      firstColGroupLastColumn.width = sheetHeader.cells[0].width;
                    }
                  }
                }
              }
            } else {
              cellColIndex = dataItem.colIndex;
            }

            var cell = row.getCell(cellColIndex); // cell.value = dataRowItem.data[dataItem.dataIndex]

            cell.value = mapKeyProp(dataRowItem.data, dataItem.dataIndex, '');
          });
        });
      }
    }, {
      key: "renderHeaderCell",
      value: function renderHeaderCell(headerCells) {
        var _this3 = this;

        this.error();
        var worksheet = this.worksheet;
        headerCells.forEach(function (headerCell) {
          var row = worksheet.getRow(headerCell.rowIndex);
          var column = worksheet.getColumn(headerCell.colIndex);

          if (headerCell.colSpan === 1) {
            _this3.setColStyle(column, headerCell.width, headerCell.colStyle || {}); // 设置列的宽度及样式

          }

          var cell = row.getCell(headerCell.colIndex);
          cell.value = headerCell.title;

          _this3.setCellStyle(cell, headerCell.style || {}); // 设置单元格样式


          if (headerCell.rowSpan > 1 || headerCell.colSpan > 1) {
            // 合并单元格
            var startRowIndex = headerCell.rowIndex;
            var endRowIndex = headerCell.rowIndex + headerCell.rowSpan - 1;
            var startColIndex = headerCell.colIndex;
            var endColIndex = headerCell.colIndex + headerCell.colSpan - 1;
            worksheet.mergeCells(startRowIndex, startColIndex, endRowIndex, endColIndex);
          }
        });
      }
    }, {
      key: "calcHeaderDepth",
      value: function calcHeaderDepth(columns) {
        var depths = [];

        function workder(data, depth) {
          var results = [];
          data.forEach(function (item) {
            var newItem = _objectSpread2({}, item);

            depths.push(depth);

            if (item.children) {
              newItem.children = workder(item.children, depth + 1);
            }

            results.push(newItem);
          });
          return results;
        }

        var newColumns = workder(columns, 1);
        var maxDepth = Math.max.apply(Math, depths);
        return {
          newColumns: newColumns,
          maxDepth: maxDepth
        };
      }
    }, {
      key: "setCellStyle",
      value: function setCellStyle(cell, style) {
        var styleKeys = this.styleKeys;
        Object.keys(style).forEach(function (key) {
          if (styleKeys.indexOf(key) > -1) {
            cell[key] = style[key];
          }
        });
      }
    }, {
      key: "setColStyle",
      value: function setColStyle(col, colWidth, colStyle) {
        var styleKeys = this.styleKeys;
        Object.keys(colStyle).forEach(function (key) {
          if (styleKeys.indexOf(key) > -1) {
            col[key] = colStyle[key];
          }
        });

        if (colWidth !== undefined) {
          col.width = colWidth;
        }
      }
    }, {
      key: "setHeaderGroupStyle",
      value: function setHeaderGroupStyle(colItem) {
        if (!colItem.style) {
          colItem.style = {};
        }

        if (!colItem.style.alignment) {
          colItem.style.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
        }
      }
    }, {
      key: "resolveDataSource",
      value: function resolveDataSource(data) {
        this.error();
        var dataRows = [];
        var maxStartColIndex = 1;

        var _this = this;

        function worker(data, parents) {
          data.forEach(function (item) {
            var startColIndex = 1; // 开始的列号

            var depth = 1; // 深度

            if (parents) {
              var parent = parents[parents.length - 1];
              startColIndex += parent.startColIndex;
            }

            if (startColIndex > maxStartColIndex) {
              maxStartColIndex = startColIndex;
            }

            var dataRowItem = {
              startColIndex: startColIndex,
              depth: depth,
              data: item
            };
            dataRows.push(dataRowItem);
            var children = item[_this._childrenColumnName];

            if (children) {
              dataRowItem.depth += children.length; // 更新深度

              var newParents = [];

              if (parents) {
                parents.forEach(function (parent) {
                  newParents.push(parent);
                  parent.depth += children.length;
                });
                newParents.push(dataRowItem);
              } else {
                newParents = [dataRowItem];
              }

              worker(children, newParents);
            }
          });
        }

        worker(data);
        return {
          maxStartColIndex: maxStartColIndex,
          dataRows: dataRows
        };
      }
    }, {
      key: "resolveRowHeader",
      value: function resolveRowHeader(columns, rowDepth) {
        this.error();
        var results = [];
        var dataItems = [];

        var _this = this;

        function worker(columns, rowSpan, parents) {
          columns.forEach(function (col, index) {
            var colItem = col;
            var rowIndex = 1;
            var colIndex = 1;

            if (parents) {
              var directParent = parents[parents.length - 1];
              colIndex = index + directParent.colIndex; // 父级colIndex 推断子级的colIndex

              rowIndex = directParent.rowIndex + 1; // rowIndex + 1
            } else {
              var prevColIntem = columns[index - 1]; // 前面一列

              if (prevColIntem) {
                colIndex = prevColIntem.colIndex + prevColIntem.colSpan; // 由前面一列的colIndex 推断后面一列的colIndex
              } else {
                colIndex = 1;
              }
            }

            colItem.colIndex = colIndex;
            colItem.rowIndex = rowIndex;
            colItem.colSpan = 1; // 默认colSpan为0

            if (col.children) {
              colItem.colSpan = colItem.children.length;
              colItem.rowSpan = 1;

              _this.setHeaderGroupStyle(colItem); // 默认居中对齐


              var newParents; // 新的parent

              if (parents) {
                newParents = parents.map(function (item) {
                  item.colSpan += colItem.children.length - 1;
                  return item;
                });
                newParents.push(colItem);
              } else {
                newParents = [colItem];
              }

              worker(col.children, rowSpan - 1, newParents);
            } else {
              if (!colItem.dataIndex) {
                throw new Error("column that has'nt children must have dataIndex key");
              }

              dataItems.push({
                colIndex: colIndex,
                dataIndex: colItem.dataIndex
              });
              colItem.rowSpan = rowSpan;

              if (rowSpan > 1) {
                if (!colItem.style) {
                  colItem.style = {};
                }

                if (!colItem.style.alignment) {
                  colItem.style.alignment = {
                    vertical: 'middle'
                  };
                }
              }
            }

            results.push(filterColItem(colItem));
          });
        }

        function filterColItem(colItem) {
          var result = {};
          Object.keys(colItem).forEach(function (key) {
            if (key !== 'children') {
              result[key] = colItem[key];
            }
          });
          return result;
        }

        worker(columns, rowDepth);
        return {
          headerEndRow: rowDepth,
          cells: results,
          dataItems: dataItems
        };
      }
    }, {
      key: "workbook",
      get: function get() {
        return this._workbook;
      }
    }, {
      key: "worksheet",
      get: function get() {
        return this._worksheet;
      }
    }]);

    return ExcelExporter;
  }();

  exports.ExcelExporter = ExcelExporter;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
