import React from 'react'
import taskBnrPic from '../../assets/taskBnr.jpg'
import taskLogo from '../../../public/faviconn.png'
function AuthLayout({ children }) {


  return (
    <>
      <div className='flex '>
        <div className=' w-screen h-screen lg:w-[55vw] px-12 pt-8 pb-12'>
          <div className='flex'>
            <img className='w-10 h-10' src={taskLogo} alt='logo' />
            <h2 className='text-lg font-medium text-black mt-2 ml-2'>Tak Manager</h2>
           
          </div>
           {children}

        </div>
        <div className='hidden lg:block  lg:flex w-[50vw] h-screen items-center justify-center   overflow-hidden' >
         <img src={taskBnrPic} className='w-64 md:w-[100%] lg:w-[98%] ' />
        </div>
      </div>
    </>
  )
}

export default AuthLayout