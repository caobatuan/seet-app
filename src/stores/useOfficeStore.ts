import { create } from 'zustand'

export interface Seat {
  id: string
  floor_id: number | null
  x: number
  z: number
  rotation: number | null
  name: string | null
  code: string | null
  phone: string | null
  status: string | null
  note: string | null
  department: string | null
}

interface OfficeState {
  seats: Seat[]
  selectedSeat: Seat | null
  currentFloor: number
  isEditMode: boolean
  setSeats: (seats: Seat[]) => void
  setSelectedSeat: (seat: Seat | null) => void
  setCurrentFloor: (floor: number) => void
  setEditMode: (value: boolean) => void
}

export const useOfficeStore = create<OfficeState>((set) => ({
  seats: [],
  selectedSeat: null,
  currentFloor: 2, // mặc định tầng 2
  isEditMode: false,
  setSeats: (seats) => set({ seats }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setEditMode: (value) => set({ isEditMode: value }),
}))
