import { useEffect } from 'react'
import { AddSeatForm } from './components/UI/AddSeatForm'
import { OfficeScene } from './components/Scene/OfficeScene'
import { SeatInfoPanel } from './components/UI/SeatInfoPanel'
import { SearchBar } from './components/UI/SearchBar'
import { useOfficeStore } from './stores/useOfficeStore'

function App() {
  const { setSeats, currentFloor, setCurrentFloor, isEditMode, setEditMode } = useOfficeStore()

  useEffect(() => {
    fetch('http://10.199.1.31:3001/api/seats')
      .then((res) => res.json())
      .then((data) => {
        console.log('Loaded seats:', data.length)
        setSeats(data)
      })
      .catch((err) => console.error('Failed to load seats:', err))
  }, [setSeats])

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* Chọn tầng */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 items-center">
        {[1, 2, 3].map((floor) => (
          <button
            key={floor}
            onClick={() => setCurrentFloor(floor)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentFloor === floor
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {floor}F
          </button>
        ))}

        <span className="text-slate-400 text-sm ml-2">Đang xem tầng {currentFloor}</span>

        {/* Nút Edit Mode */}
        <button
          onClick={() => setEditMode(!isEditMode)}
          className={`ml-4 px-4 py-2 rounded-lg font-medium transition ${
            isEditMode
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isEditMode ? 'Đang sửa...' : 'Chỉnh sửa'}
        </button>
      </div>

      <SearchBar />
      <AddSeatForm />
      <OfficeScene />
      <SeatInfoPanel />
    </div>
  )
}

export default App
