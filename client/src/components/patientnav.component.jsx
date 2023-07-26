import { Menu } from "@headlessui/react"
import { useLocation } from "react-router-dom"

const baseURL = '/patient'
// const location = useLocation()
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function PatientNav() {
const location = useLocation()  

const svgadd = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/add-user` ?'text-white':'text-gray-400',' ml-3 w-10 h-10 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>

const patientLinks = [
  { href: `${baseURL}/view-records`, label: 'View Eye Records', svg: svgadd },
  { href: `${baseURL}/view-history`, label: 'View Transaction History', svg: svgadd },
  { href: `${baseURL}/view-order`, label: 'View Order History', svg: svgadd }
]

  return (
    <Menu>
        <>
        <Menu.Item as="a"
        href={baseURL}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
        >
          
        <div className='text-start flex ml-8 items-center font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className='ml-3'>Dashboard</span>
        </div>
        </Menu.Item>

        <Menu.Items static>
          {patientLinks.map((link) =>(
            <Menu.Item
            key={link.label}
            >
            <a
            href={link.href}
            className={classNames(location.pathname=== `${link.href}` ? 'text-white bg-sky-800 hover:bg-sky-700':'text-gray-900 hover:bg-gray-100','flex items-center p-2')}>
              <div className="flex ml-5 items-center font-medium truncate">
                {link.svg}
                <span className="ml-3">
                {link.label}
                </span>
              </div>
            </a>
            </Menu.Item>
          ))}
          
        </Menu.Items>

        {/* <Menu.Item as="a"
        href={baseURL}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
        >
          
        <div className='text-start flex ml-8 items-center font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className='ml-3'>View Eye Record</span>
        </div>
        </Menu.Item>

        <Menu.Item as="a"
        href={baseURL}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
        >
          
        <div className='text-start flex ml-8 items-center font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className='ml-3'>View Transaction History</span>
        </div>
        </Menu.Item>

        <Menu.Item as="a"
        href={baseURL}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100"
        >
          
        <div className='text-start flex ml-8 items-center font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className='ml-3'>View Order Status</span>
        </div>
        </Menu.Item> */}
        </>
    </Menu>
  )
}

export default PatientNav