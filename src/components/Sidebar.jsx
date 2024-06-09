
import { useEffect, useState } from "react";

//ICONS
import { FaAngleLeft, FaBars, FaChevronDown, FaFileArrowDown, FaFileArrowUp, FaClipboardList, FaFileInvoice, FaGear, FaArrowRightFromBracket, FaFileSignature } from "react-icons/fa6"
//LOGOS
import logoPsinet from '/src/Logo-PSINet.png'
import logoPsinetSmall from '/src/Logo-PSINet_small.png'

//REACT ROUTER
import { Link } from 'react-router-dom'

//IMPORTANDO CONTEXT DE AUTH
import { useAuth } from '../context/AuthContext'


export default function Sidebar() {

  const [open, setOpen] = useState(true)
  const [submenuOpen, setSubmenuOpen] = useState(false)

  //TRAYENDO LA FUNCION DE LOGOUT DESDE EL CONTEXT AUTH
  const { user, logout, isAuthenticated } = useAuth()



  useEffect(() => {

    if (window.innerWidth <= 768) {
      setOpen(false)
    }

  }, [])

  const Menus = [
    { title: "Dashboard", spacing: true, link: "/" },
    { title: "Vale Salida", icon: <FaFileArrowDown />, spacing: true, link: "/vale-salida" },
    { title: "Vale Entrada", icon: <FaFileArrowUp />, link: "/" },
    { title: "Ver Vales Salida", icon: <FaFileSignature />, link: "/" },

    {
      title: "Materiales",
      icon: <FaClipboardList />,
      link: "/",
      spacing: true,
      submenu: true,
      submenuItems: [
        { title: "Buscar Materiales" },
        { title: "Crear Material" },
      ],
    },

    { title: "Reportes", icon: <FaFileInvoice />, link: "/" },
    {
      title: "Opciones",
      icon: <FaGear />,
      link: "/",
      spacing: true,
      submenu: true,
      submenuItems: [
        { title: "Usuarios" },
        { title: "Registrar Usuarios", link: "/register" },
        { title: "Sistema", },
      ],
    },
    { title: "Cerrar Sesion", icon: <FaArrowRightFromBracket />, link: "", functionOnClick: () => { logout() } },
  ]


  return (

    <>
      {isAuthenticated ?

        <div className={`bg-gray-800 h-screen p-5 pt-8 mr-4 ${open ? 'w-72' : 'w-20'} h-screen relative duration-300 rounded-md`}>
          <FaAngleLeft
            className={` bg-white text-gray-800 text-3xl rounded-full absolute -right-3 top-9 border border-gray-800 cursor-pointer ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className=" inline-flex">
            {open ? <img className='h-8 w-17 duration-500 md:h-12  ' src={logoPsinet} /> : <img className='h-8 w-17 duration-500 md:h-12  ' src={logoPsinetSmall} />}
          </div>

          {open ?
            <div>
              <p className=" text-gray-300 text-xs font-medium">Bienvenido !</p>
              <p className=" text-gray-300 font-medium">{user.nombre}</p>
            </div>
            :
            ''
          }

          <ul>
            {Menus.map((menu, index) => (
              <div key={index}>

                <li key={index} className={` text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md ${menu.spacing ? "mt-9" : "mt-2"} `}>
                  <span className="text-2xl block float-left">
                    {menu.icon ? menu.icon : <FaBars />}
                  </span>
                  <span className={` text-base font-medium flex-1 duration-200 ${!open && "hidden"}`} >
                    <Link to={menu.link} onClick={menu.functionOnClick}>   {menu.title} </Link>
                  </span>
                  {menu.submenu && open && (
                    <FaChevronDown className={`${submenuOpen && "rotate-180"} duration-300`} onClick={() => setSubmenuOpen(!submenuOpen)} />
                  )}
                </li>

                {menu.submenu && submenuOpen && open && (
                  <ul>
                    {menu.submenuItems.map((submenuItem, index) => (
                      <li key={index} className=" text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-gray-600 rounded-md">
                        <Link to={submenuItem.link} onClick={submenuItem.functionOnClick}>   {submenuItem.title} </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>


        </div> : ''}
    </>

  )
}
