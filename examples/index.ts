import {
  ExcelExporter
} from '@/excel-exporter'



const excelExporter = new ExcelExporter({
  sheetName: 'test'
})
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 20
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 20,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: 30,
    key: 'address',
  },
];
const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },{
    key: 3,
    name: 'Joe Blackfdfdf',
    age: 33,
    address: 'Sidney No. 1 Lake Park',
  },
];


const treeData = [
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


const btn1 = document.createElement('button') // normal
btn1.innerText = 'export'
document.body.appendChild(btn1)
btn1.addEventListener('click', () => {
  excelExporter.setColumns(columns)
  excelExporter.setDataSource(data)
  excelExporter.exportFile('test', () => {
    console.log('done')
  })
})

const btn2 = document.createElement('button')
btn2.innerText = 'export tree structure'

document.body.appendChild(btn2)
btn2.addEventListener('click', () => {
  excelExporter.setColumns(columns)
  excelExporter.setDataSource(treeData)
  excelExporter.exportFile('test-treeStructure', () => {
    console.log('done')
  })
})
