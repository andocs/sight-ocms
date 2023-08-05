import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useLocation } from "react-router-dom";

const baseURL = '/admin'

const svgadd = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/add-user` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
const svgdel = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/delete-user` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
const svgupd = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/edit-user` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>

const userLinks = [
  { href: `${baseURL}/add-user`, label: 'Add User', svg: svgadd },
  { href: `${baseURL}/delete-user`, label: 'Delete User', svg: svgdel },
  { href: `${baseURL}/edit-user`, label: 'Edit User', svg: svgupd }
]

const svgview = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/view-inventory` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
const svgadditem = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/add-item` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
const svgrmitem = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/remove-item` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
const svgupdinv = <svg aria-hidden="true" className={classNames(location.pathname === `${baseURL}/update-inventory` ?'text-white':'text-gray-400',' ml-3 w-8 h-8 transition duration-75 group-hover:text-gray-900')} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>

const inventoryLinks = [
  { href: `${baseURL}/view-inventory`, label: 'View Inventory', svg: svgview },
  { href: `${baseURL}/add-item`, label: 'Add Items', svg: svgadditem },
  { href: `${baseURL}/remove-item`, label: 'Remove Items', svg: svgrmitem },
  { href: `${baseURL}/update-inventory`, label: 'Update Inventory', svg: svgupdinv }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function AdminNav() {
  const location = useLocation()

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isInventoryMenuOpen, setInventoryMenuOpen] = useState(false);

  const isUserLinkRoute = [`${baseURL}/add-user`, `${baseURL}/delete-user`, `${baseURL}/edit-user`].some((route) =>
    location.pathname.startsWith(route)
  );

  const isInventoryLinkRoute = [`${baseURL}/view-inventory`, `${baseURL}/add-item`, `${baseURL}/remove-item`, `${baseURL}/update-inventory`].some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (isUserLinkRoute) {
      setUserMenuOpen(true);
    } else {
      setUserMenuOpen(false);
    }
  }, [isUserLinkRoute]);

  useEffect(() => {
    if (isInventoryLinkRoute) {
      setInventoryMenuOpen(true);
    } else {
      setInventoryMenuOpen(false);
    }
  }, [isInventoryLinkRoute]);
 
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

        <Menu.Button 
        onClick={() => setUserMenuOpen(!isUserMenuOpen)}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100">
        <div className='text-start flex ml-8 items-center font-medium'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>
        <span className='ml-3'>User Management</span>
        </div>
        <ChevronUpIcon
        className={`${
          isUserMenuOpen ? 'rotate-180 transform' : ''
        } h-5 w-5 text-sky-800 mr-4`}
        />
        </Menu.Button>

        {isUserMenuOpen && (
          <Menu.Items static>
          {userLinks.map((link) =>(
            <Menu.Item
            key={link.label}
            >
            <a
            href={link.href}
            className={classNames(location.pathname=== `${link.href}` ? 'text-white bg-sky-800 hover:bg-sky-700':'text-gray-900 hover:bg-gray-100','flex items-center p-2')}>
              <div className="flex ml-8 items-center font-medium">
                {link.svg}
                <span className="ml-3">
                {link.label}
                </span>
              </div>
            </a>
            </Menu.Item>
          ))}
          
        </Menu.Items>
        )}

        <Menu.Button 
        onClick={() => setInventoryMenuOpen(!isInventoryMenuOpen)}
        className="flex w-full justify-between items-center my-3 p-2 text-gray-900 rounded-lg hover:bg-gray-100">
        <div className='text-start flex ml-8 items-center font-medium truncate'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-sky-800">
          <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
          <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
          <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" /> 
        </svg>
        <span className='ml-3 truncate'>Inventory Management</span>
        </div>
        <ChevronUpIcon
        className={`${
          isInventoryMenuOpen ? 'rotate-180 transform' : ''
        } h-5 w-5 text-sky-800 mr-4`}
        />
        </Menu.Button>

        {isInventoryMenuOpen && (
          <Menu.Items static>
          {inventoryLinks.map((link) =>(
            <Menu.Item
            key={link.label}
            >
            <a
            href={link.href}
            className={classNames(location.pathname=== `${link.href}` ? 'text-white bg-sky-800 hover:bg-sky-700':'text-gray-900 hover:bg-gray-100','flex items-center p-2')}>
              <div className="flex ml-8 items-center font-medium">
                {link.svg}
                <span className="ml-3">
                {link.label}
                </span>
              </div>
            </a>
            </Menu.Item>
          ))}
          
        </Menu.Items>
        )}
        </>
      </Menu>
  )
}

export default AdminNav