

export default function Header({ title }) {


  return (
    <nav className="bg-gray-800 rounded-md mb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            
            <div className="">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-2">
                <h1 className="sm:text-xl md:text-3xl font-bold tracking-tight text-gray-50 ">{title}</h1>
              </div>

            </div>
          </div>

        </div>

      </div>

    </nav>


  )
}
