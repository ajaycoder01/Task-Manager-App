import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Login from '../src/pages/Auth/Login'
import Signup from '../src/pages/Auth/Signup'
import PrivateRoute from '../src/routes/PrivateRoute'

import Dashboard from '../src/pages/Admin/Dashboard'
import ManageTask from '../src/pages/Admin/ManageTask'
import CreateTask from '../src/pages/Admin/CreateTask'
import ManageUsers from '../src/pages/Admin/ManageUsers'

import UserDashboard from '../src/pages/User/UserDashboard'
import MyTasks from '../src/pages/User/MyTasks'
import ViewTaskDetails from '../src/pages/User/ViewTaskDetails'
import UserProvider, { UserContext } from './context/userContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserProvider>
      <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
           <Route path='/signup' element={<Signup/>} />

           {/* Admin Routes */}
           <Route  element={<PrivateRoute allowedRoles={["admin"]} />} >
              <Route path='/admin/dashboard' element={<Dashboard/>} />
              <Route path='/admin/tasks' element={<ManageTask/>} />
              <Route path='/admin/create-task' element={<CreateTask/>} />
              <Route path='/admin/users' element={<ManageUsers/>} />
           </Route>

           {/* User Routes */}
           <Route  element={<PrivateRoute allowedRoles={["member"]} />} >
              <Route path='/user/dashboard' element={<UserDashboard/>} />
              <Route path='/user/tasks' element={<MyTasks/>} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails/>} />
           </Route>

          {/* Default Route */}
          <Route path='/' element={<Root/>} />
        </Routes>
      </Router>
      </div>

      <Toaster
        toastOptions={{
          className:"",
          style:{
            fontSize: "13px",
          },
        }}
      />

    </UserProvider>

    </>
  )
}

export default App

  const Root = ()=>{
    const {user,loading} = useContext(UserContext)

    if(loading) return null;

    if(!user){
      return <Navigate to={"/login"}/>
    }

    return user.role === "admin" ? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>;

  }; 

