import { useEffect, useState } from "react";

// Importando react-router-dom para el enrutamiento y saber la ubicacion de la pagina actual para resaltar el menu
import { useLocation, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// Iconos de react-icons
import { FaAngleLeft, FaBars, FaChevronDown, FaFileArrowDown, FaFileArrowUp, FaClipboardList, FaFileInvoice, FaGear, FaArrowRightFromBracket, FaFileSignature } from "react-icons/fa6";

// Importando imagenes de la carpeta public
import logoPsinet from '../public/images/Logo-PSINet.png';
import logoPsinetSmall from '../public/images/Logo-PSINet_small.png';


export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  }, []);

  const Menus = [
    { title: "Dashboard", spacing: true, link: "/" },
    { title: "Vale Salida", icon: <FaFileArrowDown />, spacing: true, link: "/vale-salida" },

    { title: "Vale Entrada", icon: <FaFileArrowUp />, link: "/vale-entrada" },
    //{ title: "Ver Vales Salida", icon: <FaFileSignature />, link: "/ver-vales-salida" },

    {
      title: "Materiales",
      icon: <FaClipboardList />,
      link: "/Articulos",
      spacing: true,
     
    },

    { title: "Reportes", icon: <FaFileInvoice />, link: "/reportes" },

    {
      title: "Opciones",
      icon: <FaGear />,
      link: "/temporal",
      spacing: true,
      submenu: true,
      submenuItems: [
        { title: "Usuarios", link: "/usuarios" },
        { title: "Registrar Usuarios", link: "/register" },
        { title: "Sistema", link: "/sistema" },
      ],
    },
    { title: "Cerrar Sesion", icon: <FaArrowRightFromBracket />, link: "", functionOnClick: logout },
  ];

  return (
    <>
      {isAuthenticated ? (
        //<div  style={{ height: '190vh' }}className={`bg-gray-800 h-full flex flex-col  overflow-y-auto p-5 pt-8 mr-4 duration-300 ${open ? 'w-' : 'w-20 no-scrollbar'} relative  `}>
        <div style={{ height: '185vh' }} className={`bg-gray-800 h-screen flex flex-col  overflow-y-auto p-5 pt-8 mr-4  ${open ? 'w-64' : 'w-20 no-scrollbar'} h-screen relative duration-300`}>
          
          <div className="inline-flex">
            {open ? (
              <img className='h-8 duration-500 md:h-12' src={logoPsinet} alt="Logo" />
            ) : (
              <img className='h-8 duration-500 md:h-12' src={logoPsinetSmall} alt="Logo" />
            )}
          </div>
          <FaAngleLeft
            className={`bg-white text-gray-800 text-3xl rounded-full absolute -right-0 mr-1 sm:top-20 md:top-24 lg:top-24 border border-gray-800 cursor-pointer ${!open && "rotate-180 right-5 z-50"}`}
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div>
              <p className="text-gray-300 text-xs font-medium">Bienvenido!</p>
              <p className="text-gray-300 font-medium">{user.nombre}</p>
            </div>
          )}
          <ul className="mt-8">
            {Menus.map((menu, index) => (
              // se usa locoation.pathname para saber la ubicacion de la pagina actual y resaltar el menu actual con bg-blue-600 
              <div key={index}>
                <Link to={menu.link} onClick={menu.functionOnClick}>
                  <li className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-600 rounded-md ${menu.spacing ? "mt-9" : "mt-2"} ${location.pathname === menu.link ? "bg-blue-600" : ""}`}>
                    <span className="text-2xl block float-left">  
                      {menu.icon ? menu.icon : <FaBars />}
                    </span>
                    <span className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"}`}>
                      {menu.title}
                    </span>
                    {menu.submenu && open && (
                      <FaChevronDown className={`${submenuOpen && "rotate-180"} duration-300`} onClick={() => setSubmenuOpen(!submenuOpen)} />
                    )}
                  </li>
                </Link>
                {menu.submenu && submenuOpen && open && (
                  <ul>
                    {menu.submenuItems.map((submenuItem, subIndex) => (
                      <li key={subIndex} className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-gray-600 rounded-md`}>
                        <Link to={submenuItem.link}>{submenuItem.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
          {open && (
            <div className="mt-auto">
              <p className="text-gray-400 text-xs font-medium">2024</p>
              <Link to={"https://github.com/benjamcadev"} className="text-gray-400 text-xs font-medium">by benjamcadev 👨🏻‍💻</Link>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}