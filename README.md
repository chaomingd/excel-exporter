Excel exporter dependency excel.js It can be used well with table component of antd. It can export excel file easily and quickly by setcolumns () and setdatasource()


[中文文档](https://gitee.com/zeng-chao-ming/excel-exporter/blob/develop/doc/README-zh.md)
# dev
```bash
git clone https://github.com/chaomingd/excel-exporter.git

npm install

npm run start
```

# Dependency
```bash
npm install exceljs --save
npm install file-saver --save
```

# quik start
```javascript
import {
  ExcelExporter
} from 'excel-exporter'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Sex',
    dataIndex: 'sex'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: 30 // Note that the width refers to the number of characters, not the width of PX. Note that if you use the width attribute in the table component of antd, you should not directly process the columns to excel exporter. You need to rewrite the width attribute to an appropriate value, otherwise the generated excel cells will be very wide
  }
]
const dataSource = [
  {
    name: 'leon',
    sex: 'man',
    address: 'xxxxxxxxxxxxx'
  },
  {
    name: 'leon',
    sex: 'man',
    address: 'xxxxxxxxxxxxx'
  },
  {
    name: 'leon',
    sex: 'man',
    address: 'xxxxxxxxxxxxx'
  },
  {
    name: 'leon',
    sex: 'man',
    address: 'xxxxxxxxxxxxx'
  }
]
const excelExporter = new ExcelExporter({
  sheetName: 'person info'
})
excelExporter.setColumns(columns)
excelExporter.setDataSource(dataSource)
excelExporter.exportFile('personInfo.xlsx', () => {
  console.log('done') // Note that clicking save or cancel in the pop-up download box will trigger this function
})
```

## Support tree structure
![]('doc/imgs/tree.jpg')
```js
import {
  ExcelExporter
} from 'excel-exporter'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address',
  },
];
const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];
const excelExporter = new ExcelExporter({
  sheetName: 'person info'
})
excelExporter.setColumns(columns)
excelExporter.setDataSource(dataSource)
excelExporter.exportFile('personInfo.xlsx', () => {
  console.log('done') // Note that clicking save or cancel in the pop-up download box will trigger this function
})
```

# support head group
![](imgs/header-group.jpg)
```javascript
import {
  ExcelExporter
} from 'excel-exporter'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 10
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        width: 20
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            width: 20
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                width: 10
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                width: 10
              }
            ],
          },
        ]
      }
    ]
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        width: 20
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
      }
    ]
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 8
  }
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  })
}
const excelExporter = new ExcelExporter({
  sheetName: 'test'
})
excelExporter.setColumns(columns)
excelExporter.setDataSource(data)
excelExporter.exportFile('test', () => {
  console.log('done')
})
```

# API

## 1. config

```javascript
const config = {
  sheetName: 'person info'
}
const excelExporter = new ExcelExporter(config)
```

| Property      | Description         | Default    |
| --------- | ------------ | --------- |
| sheetName | The name of the worksheet | undefined |

## 2. Property

| Property                | Description                                                         | Type              | Default   |
| ------------------- | ------------------------------------------------------------ | ----------------- | -------- |
| workbook            | Workbook objects （ExcelJS.Workbook）const workbook = new  [ExcelJS.Workbook](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%88%9B%E5%BB%BA%E5%B7%A5%E4%BD%9C%E7%B0%BF)(); | ExcelJS.Workbook  |          |
| worksheet           | WorkSheet objects workbook.[addWorksheet](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%B7%BB%E5%8A%A0%E5%B7%A5%E4%BD%9C%E8%A1%A8)(sheetName); | ExcelJS.WorkSheet |          |
| _columns            | setcolumns method handles columns after processing | IColumn[]         | []       |
| _dataSource         | the datasource processed by the setdatasource method | IDataSource[]     | []       |
| _childrenColumnName | property name of children in tree structure | string            | children |
| _indentSize         | the character width of the indent in the tree structure | number            | 3        |

```javascript
// set workbook property  // https://www.npmjs.com/package/exceljs#set-workbook-properties
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
// Set workbook dates to 1904 date system
workbook.properties.date1904 = true;
```

## 方法

| Property          | Description                               | Type                                                         | Default |
| ------------- | ---------------------------------- | ------------------------------------------------------------ | ------ |
| setColumns    | The setting column is the same as antd table columns        | (columns: IColumns[]) => void Icolumn is described in detail later            | -      |
| setDataSource | Set the same data source as the antd table datasource | (data:  IdataSource, options?: IdataSourceOption) => void It will be described in detail later | -      |
| exportFile    | Export data to excel file                | (filename: string, done) => void                             | -      |

### IColumn

A data column object is an entry in columns

| Property      | Description                                                         | Type   | Default |
| --------- | ------------------------------------------------------------ | ------ | ------ |
| title     | Column header display text                                               | string | -      |
| dataIndex | The key corresponding to the column data in the data item supports the nested writing of 'A.B.C'          | string | -      |
| style     | Style of column header cells {  numFmt, font, alignment, border, fille  } 具体设置参考excel.js [Style](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%A0%B7%E5%BC%8F) | object | -      |
| colStyle  | Cell style of a column {  numFmt, font, alignment, border, fille  } Specific setting reference excel.js [Style](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%A0%B7%E5%BC%8F) | object | -      |
| width     | Set the width of the column. The unit is not Px, but the number of characters                 | number | -      |

### IdataSourceOption When setting the data source, if it is a tree structure table, you can set the indentation

| Property               | Description                   | Type   | Default     |
| ------------------ | ---------------------- | ------ | ---------- |
| childrenColumnName | property name of children in tree structure   | string | 'children' |
| indentSize         | the character width of the indent in the tree structure| number | 3          |

```javascript
excelExporter.setDataSource(dataSource, {
  childrenColumnName: 'children',
  indentSize: 3
})
```
