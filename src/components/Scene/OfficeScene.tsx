import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Seat } from './Seat'
import { useOfficeStore } from '../../stores/useOfficeStore'
import { useEffect } from 'react'

export function OfficeScene() {
  const { seats, currentFloor, selectedSeat, isEditMode, setSeats, setSelectedSeat } = useOfficeStore()

  const floorSeats = seats.filter((s) => s.floor_id === currentFloor)

  // Khoảng cách giữa các ô (phải khớp với spacing trong Seat.tsx)
  const GRID_SIZE = 1.0   // mỗi ô cách nhau 1 đơn vị trong database

  useEffect(() => {
    if (!isEditMode || !selectedSeat) return

    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0
      let dz = 0

      if (e.key === 'ArrowLeft')  dx = -GRID_SIZE
      if (e.key === 'ArrowRight') dx =  GRID_SIZE
      if (e.key === 'ArrowUp')    dz = -GRID_SIZE
      if (e.key === 'ArrowDown')  dz =  GRID_SIZE

      if (dx === 0 && dz === 0) return
      e.preventDefault()

      // Tính vị trí mới (đã snap theo ô)
      const newX = Math.round((selectedSeat.x + dx) / GRID_SIZE) * GRID_SIZE
      const newZ = Math.round((selectedSeat.z + dz) / GRID_SIZE) * GRID_SIZE

      // Không cho 2 ghế trùng ô
      const occupied = seats.some(
        (s) =>
          s.id !== selectedSeat.id &&
          s.floor_id === selectedSeat.floor_id &&
          Math.abs(s.x - newX) < 0.1 &&
          Math.abs(s.z - newZ) < 0.1
      )
      if (occupied) return

      // Cập nhật local
      const updatedSeat = { ...selectedSeat, x: newX, z: newZ }
      const updatedSeats = seats.map((s) =>
        s.id === selectedSeat.id ? updatedSeat : s
      )
      setSeats(updatedSeats)
      setSelectedSeat(updatedSeat)

      // Lưu database
      fetch(`http://10.199.1.31:3001/api/seats/${selectedSeat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: newX, z: newZ }),
      }).catch(console.error)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditMode, selectedSeat, seats, setSeats, setSelectedSeat])

  return (
    <Canvas
      camera={{ position: [0, 14, 20], fov: 45 }}
      shadows
      style={{ background: '#0f172a' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Sàn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Ghế */}
      {floorSeats.map((seat) => (
        <Seat key={seat.id} seat={seat} />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={60} blur={2.5} />
      <Environment preset="city" />
      <OrbitControls
        makeDefault
        maxPolarAngle={Math.PI / 2.05}
        minDistance={6}
        maxDistance={50}
      />
    </Canvas>
  )
}
