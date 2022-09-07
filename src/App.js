import logo from "./logo.svg";
// import "./App.css";
import { useEffect, useState } from "react";
import Tasklist from "./components/Tasklist/Tasklist";
import SendIcon from '@mui/icons-material/Send';
import { Alert, Button, Pagination, Paper, Stack, TextField, Typography } from "@mui/material";

const baseurl = "http://localhost:4000"
function App() {
  
  const [inputTask , setInputTask] = useState("");
  const [taskList , setTaskList] = useState([])
  const [isTaskListChanged , setisTaskListChanged] = useState(false)
  const [pageNo, setPageNo] = useState(1);
  const [limit, setlimit] = useState(3);
  const [totalPages, settotalPages] = useState();
    const fetchTask = () => {
    fetch(`${baseurl}/todos?page=${pageNo}&limit=${limit}`)
    .then((response) => response.json())
    .then((responseData) => {
      // console.log("IN USE EFFECT--------FETCH - data",responseData);
      setTaskList([...responseData.data])
      // console.log("IN USE EFFECT--------FETCH - pageNo",responseData.totalPages);
      settotalPages(responseData.totalPages);
      // console.log("IN USE EFFECT--------FETCH - isComplete",responseData);
      // console.log("isCompleteStatus",isCompleteStatus);
      // setIsCompleteStatus(responseData.data.isComplete)
    })
  }

  useEffect(() => {
    fetchTask();
  }, [isTaskListChanged]);
  useEffect(() => {
    fetchTask();
  }, [pageNo]);
  useEffect(() => {
    fetchTask();
  }, [totalPages]);

  // useEffect(() => {console.log("IN USE EFFECT----||",taskList);}, [taskList]);  

  const updateTodo = (id, description)=>{
    // console.log(description);
    const taskListCopy = [...taskList];
    let task = taskListCopy.find((task)=>task.id === id);
    task.description = description
    // console.log("Task",task);
    setTaskList([...taskListCopy])
    fetch(`${baseurl}/todos/${id}`,{
      method:'PATCH',
      // mode:'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify({description:description})
    }).then((response)=>response.json()).then((data)=>console.log("DATA",data))
  }

  const updateStatus = (id,checked)=>{
    const taskListCopy = [...taskList];
    let task = taskListCopy.find((task)=>task.id === id);
    task.isComplete = checked
    setTaskList([...taskListCopy])
    fetch(`${baseurl}/todos/${id}`,{
      method:'PATCH',
      // mode:'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify({isComplete:checked})
    }).then((response)=>response.json()).then((data)=>console.log("DATA after status change",data))
  }

  const deleteTodo = (id)=>{
    // const taskListCopy = taskList.filter((task)=> task.id !== id);
    let taskListCopy = [...taskList]
    taskListCopy = taskListCopy.filter((task)=>task.id !== id)
    // console.log("after deletion",taskListCopy);
    setTaskList([...taskListCopy])
    setisTaskListChanged(!isTaskListChanged)
    
    fetch(`${baseurl}/todos/${id}`,{
      method:'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response)=>response.json()).then((data)=>console.log("DATA after deleting",data))
    
  }
  
  const addTodo = async()=>{
    fetch(`${baseurl}/todos`,{
      method:'POST',
      // mode:'cors',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify({description:inputTask})
    }).then((response)=>response.json()).then((data)=>{console.log("DATA after POST",data);
    <Alert severity="error">{data.message}</Alert>
    setInputTask("")
    // fetchTask()
    setisTaskListChanged(!isTaskListChanged)
    // fetch(`${baseurl}/todos`)
    // .then((response) => response.json())
    // .then((data) => {
    //   // console.log("data",data);
    //   setTaskList([...data.data])
    // })
  }
    )
  }


  const handelPageChange =(event,value)=>{
    setPageNo(value)
  }

  return <Paper sx={{width:"60%", margin:"20px auto",padding:" 0px 0px 10px 0px"}}>
    <Typography variant="h6" gutterBottom sx={{textAlign:"center"}}>
        To Do List
      </Typography>
    <Stack direction="column"
  justifycontent="center"
  alignItems="center"
  spacing={1}
  mt={0}
  maxwidth="100%"
  >
      <Paper sx={{width:"80%", margin:"20px auto",padding:"10px", }} elevation={3}>
      <Stack direction="row" spacing={2} justifycontent="center" alignItems="center">
        <TextField label="Enter Task" color="secondary" fullWidth="true" focused type="text" size="small" id="inputtext" onChange={(e)=>setInputTask(e.target.value) } value={inputTask}/>
        {/* <input type="text" placeholder="Enter task" id="inputtext" onChange={(e)=>setInputTask(e.target.value) } value={inputTask}/> */}
        <Button variant="contained" onClick={addTodo} type="submit" size="large" endIcon={<SendIcon />}> Add </Button>
      </Stack>
      </Paper>
    <Tasklist todos = {taskList} updateStatus={updateStatus} updateTodo={updateTodo} addTodo={addTodo} deleteTodo={deleteTodo}/>
    <Pagination count={totalPages} page={pageNo} siblingCount={0} onChange={handelPageChange}/>
</Stack>
  </Paper>;
}

export default App;
