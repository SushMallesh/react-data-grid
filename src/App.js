
import React,{useState,useMemo} from "react";
import { useTable } from "react-table";
import * as XLSX from 'xlsx'
 
import './App.css'


let indexArr  = Array(4).fill(0).map(row=>new Array(7).fill(0))
export default function App() {

  const [items,setItems] = useState([])
  const [newArr,setArr] = useState([...indexArr])

  const handleFile =async(e)=>{
   
    const file = e.target.files[0]
    const data = await file.arrayBuffer()

    const workbook = XLSX.readFile(data)

    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet,{
      defval:''
    })

    const arrData = XLSX.utils.sheet_to_json(worksheet,{
      header:1,
      defval:'',
     
    })
  
    for(let i=0;i<arrData.length;i++){
      for (let j=0;j<(arrData[i].length);j++){
        if([0,1,3,4,6,7].includes(j)){
          indexArr[i][j] = arrData[i][j]
        }else{
          indexArr[i][j] = ''
        }
      } 
    }

    setItems(jsonData)

  }

  const EditableCell = ({
    row:{id},
    column:{columnId},
    cell:{value},

  })=>{

    const onChange = (e) =>{
    indexArr[parseInt(id)+1][parseInt(columnId)] = e.target.value

    if(e.target.value === "No"){
      setArr(indexArr => [...indexArr.map(item=>{
        if(item[0] === indexArr[parseInt(id)+1][6]){
          return item[6] = true
        }
      })])
    }
    }

    return <select disabled ={newArr[parseInt(id)+1][6] === true?true:false} onChange={onChange} defaultValue={value[0]}>
          {value.split(",").map(re =>
            <option value={re} key={re}>{re}</option>)}
       </select>
  }

  const EditableEvidenceCell = ({ 
    row:{id},
    column:{columnId},
    cell:{value},
  }) =>{
    const onChange = (e) =>{

    indexArr[parseInt(id)+1][parseInt(columnId)] = e.target.files[0]
    }
    return <input disabled ={newArr[parseInt(id)+1][6] === true?true:false} type="file" name="upload file" onChange={onChange}/>
  }

  const onClickSubmit = () =>{
    
    return JSON.stringify(indexArr)
  }
  const COLUMNS =[

    {
        Header:'ID',
        columnId:0,
        accessor:'ID',
    },
    {
      Header:'Question',
      columnId:1,
      accessor:'Question'
    },
    {
      Header:'Response',
      columnId:2,
      accessor:'Response_Values',
      Cell:EditableCell
    },
    {
      Header:'NIST_ID',
      columnId:3,
      accessor:'NIST_ID',
    },
    {
      Header:'IEC_ID',
      columnId:4,
      accessor:'IEC_ID',
    },
    {
      Header:'Supporting Evidence',
      columnId:5,
      accessor:'Supporting_Evidence',
      Cell:EditableEvidenceCell
    }

  ]

      const data = useMemo(() => {
        return items
    },[items])

    const columns = useMemo(() => {
          return COLUMNS
      },[])

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
      })
            
      return <div>
        <input type="file" onChange={e => handleFile(e)}/>

        <table {...getTableProps()}>
          <thead>
              {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                              {column.render('Header')}
                          </th>
                      ))}
                  </tr>
              ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
              prepareRow(row);
              return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {   
                
                return (
                  
                    <td {...cell.getCellProps()}>
                        {cell.render('Cell')}
                    </td> 
                    )
                    })}
                   
          </tr>)})}
            </tbody>
          </table>
          <button onClick={onClickSubmit}>Submit</button>
        </div>}