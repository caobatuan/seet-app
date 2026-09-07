import { useState } from 'react'
import { useOfficeStore } from '../../stores/useOfficeStore'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const { seats, setSelectedSeat, setCurrentFloor } = useOfficeStore()

  const handleSearch = () => {
    if (!query.trim()) return

    const found = seats.find(
      (s) =>
        s.name?.toLowerCase().includes(query.toLowerCase()) ||
        s.code?.toLowerCase().includes(query.toLowerCase()) ||
        s.phone?.includes(query)
    )

    if (found) {
      if (found.floor_id) setCurrentFloor(found.floor_id)
      setSelectedSeat(found)
    } else {
      alert('Không tìm thấy nhân viên')
    }
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Tìm tên / mã / SĐT..."
        className="px-4 py-2 rounded-lg bg-slate-800/90 text-white border border-slate-600 focus:outline-none focus:border-blue-500 w-64 shadow-lg backdrop-blur"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-lg"
      >
        Tìm
      </button>
    </div>
  )
}
