import { useScrolled } from "../Hooks/useScrolled"
import logo from "../assets/logo.png"
import { NavLink } from "react-router-dom"
export default function Header() {
  const scrolled = useScrolled(50)





  return <header className={`flex items-center z-10 ${scrolled ? "bg-black" : "bg-transparent" } transform transition-colors place-content-between px-2 fixed top-0 w-full`}>

    <div className="flex items-center gap-4 font-bold italic">
      <img className="h-16" src={logo} alt="mountain view logo" />
      <h1 className="hidden sm:block">MOUNTAIN VIEW HOTEL</h1>
    </div>

    <nav >
      <ul className="flex items-center gap-4 text-[#FFB82B]">
        <li>
          <NavLink to={"food"} className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Food</NavLink>
        </li>
        <li>
          <NavLink to={"drinks"}className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Drinks</NavLink>
        </li>
        <li>
          <NavLink to={"guest-services"} className={({ isActive }) => (isActive ? "underline font-bold" : "")}>Guests services</NavLink>
        </li>
      </ul>
    </nav>
                <button className="text-[#FFB82B] hidden sm:block px-8 py-2 border-amber-200 border hover:text-black hover:bg-[#FFB82B] cursor-pointer transform transition-colors">CONTACT</button>

  </header>
}