import { useState, useEffect } from 'react'
import { useOfficeStore } from '../../stores/useOfficeStore'

export function SeatInfoPanel() {
  const { selectedSeat, setSelectedSeat, seats, setSeats } = useOfficeStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    phone: '',
    department: '',
    status: 'occupied',
    note: '',
  })

  useEffect(() => {
    if (selectedSeat) {
      setForm({
        name: selectedSeat.name || '',
        code: selectedSeat.code || '',
        phone: selectedSeat.phone || '',
        department: selectedSeat.department || '',
        status: selectedSeat.status || 'occupied',
        note: selectedSeat.note || '',
      })
      setEditing(false)
    }
  }, [selectedSeat])

  if (!selectedSeat) return null

  const handleSave = async () => {
    try {
      const res = await fetch(`http://10.199.1.31:3001/api/seats/${selectedSeat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const updated = await res.json()
      setSeats(seats.map((s) => (s.id === updated.id ? updated : s)))
      setSelectedSeat(updated)
      setEditing(false)
    } catch (err) {
      alert('Cập nhật thất bại')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Xóa ghế của "${selectedSeat.name}"?`)) return
    try {
      await fetch(`http://10.199.1.31:3001/api/seats/${selectedSeat.id}`, {
        method: 'DELETE',
      })
      setSeats(seats.filter((s) => s.id !== selectedSeat.id))
      setSelectedSeat(null)
    } catch (err) {
      alert('Xóa thất bại')
    }
  }

  return (
    <div className="absolute top-20 right-4 w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-5 text-white shadow-2xl z-20">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{selectedSeat.name || '空位'}</h2>
        <button onClick={() => setSelectedSeat(null)} className="text-slate-400 hover:text-white">
          ✕
        </button>
      </div>

      {editing ? (
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-slate-400">Tên</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400">Mã</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
            <div>
              <label className="text-slate-400">SĐT</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400">Phòng ban</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
            />
          </div>
          <div>
            <label className="text-slate-400">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
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
              className="w-full mt-1 px-3 py-2 rounded bg-slate-800 border border-slate-600"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500">
              Lưu
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded bg-slate-700 hover:bg-slate-600">
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Code</span>
            <span className="font-medium">{selectedSeat.code || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Phone</span>
            <span className="font-medium">{selectedSeat.phone || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-medium">{selectedSeat.status || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Department</span>
            <span className="font-medium text-right max-w-[160px]">{selectedSeat.department || '—'}</span>
          </div>
          {selectedSeat.note && (
            <div className="pt-2 border-t border-slate-700">
              <span className="text-slate-400">Note: </span>
              <span>{selectedSeat.note}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm"
            >
              Sửa
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 rounded bg-rose-600 hover:bg-rose-500 text-sm"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
