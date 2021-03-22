import {
  ExcelExporter
} from '@/excel-exporter'



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

// normal
const btn1 = document.createElement('button') // normal
btn1.innerText = 'export'
document.body.appendChild(btn1)
btn1.addEventListener('click', () => {
  const excelExporter = new ExcelExporter({
    sheetName: '人员信息'
  })
  excelExporter.setColumns(columns)
  excelExporter.setDataSource(data)
  excelExporter.exportFile('test', () => {
    console.log('done')
  })
})

// tree structor
const btn2 = document.createElement('button')
btn2.innerText = 'export tree structure'

document.body.appendChild(btn2)
btn2.addEventListener('click', () => {
  const excelExporter = new ExcelExporter({
    sheetName: '人员信息'
  })
  excelExporter.setColumns(columns)
  excelExporter.setDataSource(treeData)
  excelExporter.exportFile('test-treeStructure', () => {
    console.log('done')
  })
})


// header group
const headerGroupColumns = [
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
const dataGroup:object[] = [];
for (let i = 0; i < 100; i++) {
  const dataItem = {
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  }
  dataGroup.push(dataItem)
}
const btn3 = document.createElement('button')
btn3.innerText = 'exporter header group'
btn3.onclick = function () {
  const excelExporter = new ExcelExporter({
    sheetName: '人员信息'
  })
  excelExporter.setColumns(headerGroupColumns)
  excelExporter.setDataSource(dataGroup)
  excelExporter.exportFile('人员信息', () => {
    console.log('完成')
  })
}
document.body.appendChild(btn3)

