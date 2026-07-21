export default function Footer(){
  return (
    <footer className=" pt-4  text-sm w-full " id="footer">
      <div className="max-w-4xl px-4 w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="font-semibold">Mountain View Hotel</div>
            <div className="mt-2">KG 14 792 Ave St 5<br/>Kigali, Rwanda</div>
          </div>

          <div>
            <div className="font-semibold">Contact</div>
            <div className="mt-2">+250 (79) 235-4567<br/>mountainviewapartmentsrw@gmail.com</div>
          </div>

          <div>
            <div className="font-semibold">Available 24/7</div>
          </div>
        </div>

        <div className="mt-8 text-xs">© {new Date().getFullYear()} Mountain View Hotel — All rights reserved.</div>
      </div>
    </footer>
  )
}
