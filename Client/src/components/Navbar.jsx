import React from 'react'

const Navbar = () => {
  return (
    
    <nav className='nav  bg-slate-900'>

        <div className="mycontainer flex  items-center justify-between px-4 py-5 h-14">


        <div className="logo font-bold text-slate-100 text-lg">
            <span className='text-green-700'>&lt;</span>
            Pass
            <span className='text-green-700'>Man / &gt;</span>
        </div>

        
        
            <button className='flex gap-2 justify-center items-center '>
              <a href="www.github.com"><img className='w-5' src="src\icons\github-mark-white.png" alt="" /></a>
              <span className='text-white font-bold '>GitHub</span>
            </button>
        </div>
    </nav>
  )
}

export default Navbar
