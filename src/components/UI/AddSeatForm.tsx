import { useState } from 'react'
import { useOfficeStore } from '../../stores/useOfficeStore'

export function AddSeatForm() {
  const { currentFloor, seats, setSeats, setSelectedSeat } = useOfficeStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    phone: '',
    department: '',
    status: 'occupied',
    note: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Đặt ghế mới ở vị trí trống (bên phải cùng)
    const maxX = seats
      .filter((s) => s.floor_id === currentFloor)
      .reduce((max, s) => Math.max(max, s.x), 0)

    const newSeat = {
      floor_id: currentFloor,
      x: maxX + 2,
      z: 0,
      rotation: 0,
      name: form.name || '空位',
      code: form.code || null,
      phone: form.phone || null,
      department: form.department || null,
      status: form.status,
      note: form.note || null,
    }

    try {
      const res = await fetch('http://10.199.1.31:3001/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeat),
      })
      const created = await res.json()
      setSeats([...seats, created])
      setSelectedSeat(created)
      setOpen(false)
      setForm({ name: '', code: '', phone: '', department: '', status: 'occupied', note: '' })
    } catch (err) {
      alert('Thêm thất bại')
      console.error(err)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-6 left-6 z-20 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 shadow-lg"
      >
        + Thêm người
      </button>
    )
  }

  return (
    <div className="absolute bottom-6 left-6 z-20 w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-5 text-white shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Thêm người mới</h3>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="text-slate-400">Tên</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400">Mã (A7xx)</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="A710"
            />
          </div>
          <div>
            <label className="text-slate-400">SĐT</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="1520"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400">Phòng ban</label>
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            placeholder="Phòng IT"
          />
        </div>

        <div>
          <label className="text-slate-400">Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
          >
            <option value="occupied">Đang ngồi</option>
            <option value="empty">Trống</option>
            <option value="maternity">Nghỉ thai sản</option>
            <option value="backup">Dự phòng</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400">Ghi chú</label>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-blue-500"
            placeholder="Ghi chú thêm..."
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium"
        >
          Thêm ghế
        </button>
      </form>
    </div>
  )
}
