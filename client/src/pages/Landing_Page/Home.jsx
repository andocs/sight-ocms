
function Home() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8 grid grid-cols-5 gap-4 auto-rows-min">
        
        <div className='max-h-fit row-start-1 col-span-2 items-end flex'>
          
          <div>
            <p className='text-2xl font-medium'>SIGHT</p>
          </div>
        </div>

        <div className='row-start-2 col-span-2 mr-20'>
          <p className='text-8xl font-semibold break-words'>Take care of your eyes</p>
        </div>

        <div className='row-start-3 col-span-2 -mt-16'>
          <button type="button" className="text-sky-800 hover:text-white border-2 border-sky-800 hover:bg-sky-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-l px-7 py-1.5 text-center mr-1 mb-1 dark:border-sky-800 dark:text-sky-800 dark:hover:text-white dark:hover:bg-sky-800 dark:focus:ring-sky-900">
            LEARN MORE
          </button>
        </div>

        <div className='row-span-3 col-span-2 col-start-3 col-end-6 items-start'>
          <img src="/images/home-background.png" alt="" className='object-none w-full'/>
        </div>   

      </div>   
   </>
  )
}

export default Home