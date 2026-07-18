export default function Footer(){
  return (
    <footer className="mt-12 border-t border-neutral-800 pt-8 pb-8 text-sm" id="footer">
      <div className="max-w-4xl mx-auto px-4 text-neutral-400 w-full">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="font-semibold">Mountain View Hotel</div>
            <div className="mt-2">123 Scenic Drive<br/>City, Country</div>
          </div>

          <div>
            <div className="font-semibold">Contact</div>
            <div className="mt-2">+250 (79) 235-4567<br/>hello@mountainview.com</div>
          </div>

          <div>
            <div className="font-semibold">Opening Hours</div>
            <div className="mt-2">Mon - Sun: 7:00am - 11:00pm</div>
          </div>
        </div>

        <div className="mt-8 text-xs text-neutral-500">© {new Date().getFullYear()} Mountain View Hotel — All rights reserved.</div>
      </div>
    </footer>
  )
}
