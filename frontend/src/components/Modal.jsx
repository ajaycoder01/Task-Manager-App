import React from 'react'
import { LuX } from "react-icons/lu";

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return;



    return (
        <div className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50'>

            <div className='relative p-4 w-full max-w-2xl max-h-full'>
                {/* Modal Content */}

                <div className="relative bg-white px-2 py-2 rounded-lg shadow-sm dark:bg-gray-700">
                    {/* Modal header */}
                  
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-semibold text-black">{title}</h3>

                        <button onClick={onClose}>
                            <LuX className="text-gray-300 hover:text-red-500 mr-4" />
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className='p-4 md:p-5 space-y-4 '>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
