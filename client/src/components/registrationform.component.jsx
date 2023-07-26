import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { register, reset } from '../features/auth/authSlice';
import { validateRegistration } from '../utility/validateRegistration';

import Spinner from './spinner.component';

const genders = [
  { gender: 'Male' },
  { gender: 'Female' },
  { gender: 'Others' }
]

const roles = [
  { role: 'Admin' },
  { role: 'Doctor' },
  { role: 'Technician' }
]

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    conf_email:'',
    contact: '',
    address: '',
    city: '',
    province: '',
    password: '',
    conf_pass: '',
  });

  const {
    fname,
    lname,
    email,
    conf_email,
    contact,
    address,
    city,
    province,
    password,
    conf_pass,
  } = formData;

  const [selectedGender, setSelectedGender] = useState(genders[0])
    
      const navigate = useNavigate();
      const dispatch = useDispatch();
    
      const token = localStorage.getItem('user')
    
      const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
    
      useEffect(() => {
        if (isError) {
          toast.error(message);
        }
    
        if (isSuccess) {
          navigate('/');
        }
        if(!isSuccess && token){
          toast.error('test')
          const decodedToken = JSON.parse(token);
          console.log(decodedToken);
          const role = decodedToken.role;
          navigate(`/${role}`)
        }
        
        dispatch(reset());
      }, [user, isError, isSuccess, message, navigate, dispatch]);
    
      const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
    
      const onSubmit = (e) => {
        e.preventDefault();
    
        if (password !== conf_pass) {
          toast.error('Passwords do not match');
        }
        if (email !== conf_email) {
          toast.error('Email Address do not match');
        } else {
          const userData = {
            fname,
            lname,
            gender: selectedGender.gender,
            email,
            password,
            contact,
            address,
            city,
            province,
            role: 'patient'
          };
          const validationErrors = validateRegistration(userData);
          if (validationErrors.length > 0) {
            if (validationErrors.length > 3){
              toast.error("Please fill in all the required fields!")
            } else{
              validationErrors.forEach((error) => {
                toast.error(error);})
              }
          }else{
            dispatch(register(userData));
            toast.success(`User ${userData.fname} ${userData.lname} successfully registered.`)
          }
          
        }
      };
    
      if (isLoading) {
        return <Spinner />;
      }

      return (
        <>
        <form onSubmit={onSubmit}>
          <div className="w-full bg-white border-b">
            <div className="p-8 flex justify-between items-center xl:w-5/6">
              <div>
                <p className='font-medium text-5xl'>Add Staff Account</p>
              </div>
              <div>
                <button type='submit' className="w-52 bg-blue-950 text-white rounded-lg text-base py-2 px-8 hover:bg-blue-900">Add Account</button>
              </div>
            </div>
          </div>
    
          <div className='pb-32'>
    
            <div className="p-8">
              <p className="text-3xl font-medium">Personal Information</p>
    
              <div className="xl:w-5/6 flex flex-col">
    
                <div className="flex flex-row pt-8 justify-evenly">
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="email" className="text-l text-start block w-full mb-4 text-sm font-medium truncate text-sky-800">FIRST NAME</label>
                    <input type="text" placeholder='First Name' name="fname" id="fname" value={fname} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="email" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">LAST NAME</label>
                    <input type="text" placeholder='Last Name' name="lname" id="lname" value={lname} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-2/5">
                    <label htmlFor="contact" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">GENDER</label>
                    <div className='w-full flex flex-col'>
                      <Listbox value={selectedGender} onChange={setSelectedGender}>
                        <div className="h-14 w-full flex flex-col border border-sky-800 rounded-lg bg-gray-50">
                          <Listbox.Button className="relative w-full h-full cursor-default rounded-lg font-medium bg-gray-50 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500">
                            <span className="block truncate">{selectedGender.gender}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                        </div>
                        <div className='w-full relative'>
                          <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute bg-white w-full shadow-lg">
                                {genders.map((gender,i) => (
                                  <Listbox.Option
                                    key={i}
                                    value={gender}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-sky-100 text-sky-800' : 'text-sky-900'
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {gender.gender}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>  
                  
                </div>
    
                <div className="flex flex-row pt-4 justify-evenly">
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="email" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">EMAIL ADDRESS</label>
                    <input type="email" placeholder='name@email.com' name="email" id="email" value={email} onChange={onChange} className="placeholder:underline placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>

                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="email" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">CONFIRM EMAIL</label>
                    <input type="email" placeholder='name@email.com' name="conf_email" id="conf_email" value={conf_email} onChange={onChange} className="placeholder:underline placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-3/5">
                    <label htmlFor="contact" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">CONTACT NUMBER</label>
                    <input type="text" placeholder='Contact Number' name="contact" id="contact" value={contact} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                </div>
    
                <div className="flex flex-row pt-4 justify-evenly">
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="address" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">ADDRESS</label>
                    <input type="text" placeholder='123 Penny Lane' name="address" id="address" value={address} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-3/5">
                    <label htmlFor="city" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">CITY</label>
                    <input type="text" placeholder='City' name="city" id="city" value={city} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-3/5">
                    <label htmlFor="province" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">PROVINCE</label>
                    <input type="text" placeholder='Province' name="province" id="province" value={province} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                            
    
                </div>
    
              </div>
            </div>
    
            <div className="px-8">
              <p className="text-3xl font-medium">Account Information</p>
    
              <div className="xl:w-5/6 flex flex-col">
    
                <div className="flex flex-row pt-8 justify-evenly">
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="password" className="text-l text-start block w-full mb-4 text-sm font-medium truncate text-sky-800">PASSWORD</label>
                    <input type="password" placeholder='••••••••' name="password" id="password" value={password} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
    
                  <div className="mb-4 px-8 w-full">
                    <label htmlFor="conf_pass" className="text-l text-start block w-full mb-4 text-sm font-medium text-sky-800 truncate">CONFIRM PASSWORD</label>
                    <input type="password" placeholder='••••••••' name="conf_pass" id="conf_pass" value={conf_pass} onChange={onChange} className="placeholder:text-slate-500 text-start font-medium block w-full p-4 text-sky-800 border border-sky-800 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                  </div>       
                  
                </div>
    
              </div>
            </div>
    
          </div>
        </form>
           
        </>
      )
}

export default RegistrationForm