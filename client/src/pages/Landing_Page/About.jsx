
function About() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8 grid grid-cols-5 gap-4">

        <div className='max-h-fit row-start-1 col-span-2 items-end flex'>
          <div>
            <p className='text-6xl font-semibold'>About Us</p>
          </div>
        </div>

        <div className='row-start-2 col-span-2'>
          <p className='text-4xl font-normal break-words'>Sight, the Optical Clinic Management System is developed to make scheduling and managing appointments for patients in an optical clinic more efficient. By enabling patients to make appointments, access their medical history, and receive appointment reminders, the system will be designed to give them a simple and convenient experience.</p>
        </div>

        <div className='row-span-2 col-span-2 row-start-1 col-start-3 col-end-6'>
          <img src="/images/about-background.png" alt="" className='object-none w-full'/>
        </div> 

      </div>
      </>
  )
}

export default About;