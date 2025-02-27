import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { BiGrid, BiUserCircle } from "react-icons/bi";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

const navItems: NavItem[] = [
  {
    icon: <BiGrid className="text-xl" />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <BiUserCircle className="text-xl" />,
    name: "Send Money",
    path: "/sendMoney",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded ? "w-[290px]" : "w-[90px]"}`}
    >
      <div className="py-8 flex justify-center">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Logo"
            width={isExpanded ? 150 : 32}
            height={40}
          />
        </Link>
      </div>
      <nav className="flex flex-col gap-4">
        {navItems.map((nav) => (
          <Link
            key={nav.name}
            to={nav.path || "#"}
            className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg ${
              isActive(nav.path || "#")
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            <span className="size-6 flex justify-center items-center">
              {nav.icon}
            </span>
            {isExpanded && <span>{nav.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
