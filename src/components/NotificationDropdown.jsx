export default function NotificationDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg border bg-white p-2 shadow-lg">
      <div className="space-y-2">
        <div className="rounded-md p-2 hover:bg-gray-50">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-green-700">Patvirtinta</span>
            <span className="text-gray-400">(prieš 2d.)</span>
          </div>
          <div className="mt-0.5 text-sm text-gray-800">Nugaros masažas</div>
        </div>

        <div className="rounded-md p-2 hover:bg-gray-50">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-red-700">Nepatvirtinta</span>
            <span className="text-gray-400">(prieš 2d.)</span>
          </div>
          <div className="mt-0.5 text-sm text-gray-800">Relaksacinis masažas</div>
        </div>
      </div>
    </div>
  )
}


