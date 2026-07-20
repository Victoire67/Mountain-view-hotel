import { useScrolled } from "../Hooks/useScrolled"
import Logo from "../assets/logo"
import { NavLink, Link, ScrollRestoration } from "react-router-dom"
export default function Header() {
  const scrolled = useScrolled(50)





  return <header className={`flex items-center z-10 ${scrolled ? "bg-black" : "bg-transparent"} transform transition-colors place-content-between px-2 fixed top-0 w-full`}>

    <Link to="/">
      <div className="flex">
        <Logo />
        <div className="hidden sm:block"> 
            <h1 className="font-bold text-[#004325] relative text-[32px]" >MOUNTAIN VIEW</h1>
            <h1 className="text-lg font-bold tracking-wide relative right-8 ">hotel & apartment</h1>
        </div>
      </div>
    </Link>

    <nav >
      <ul className="flex items-center gap-4 text-white">
        <li>
          <NavLink to={"food"} className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Food</NavLink>
        </li>
        <li>
          <NavLink to={"drinks"} className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Drinks</NavLink>
        </li>
        <li>
          <NavLink to={"guest-services"} className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Guests services</NavLink>
        </li>
      </ul>
    </nav>

    <a href="#footer">
      <button className="text-[#FFB82B] hidden sm:block px-8 py-2 border-amber-200 border hover:text-black hover:bg-[#FFB82B] cursor-pointer transform transition-colors">CONTACT</button>
    </a>
    <ScrollRestoration />
  </header>
}