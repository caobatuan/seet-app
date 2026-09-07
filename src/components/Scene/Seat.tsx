import { useState, useMemo, useRef } from 'react'
import { Text, useGLTF } from '@react-three/drei'
import { useOfficeStore, type Seat as SeatType } from '../../stores/useOfficeStore'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SeatProps {
  seat: SeatType
}

export function Seat({ seat }: SeatProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const { setSelectedSeat, selectedSeat, isEditMode, setSeats, seats } = useOfficeStore()
  const { scene } = useGLTF('/models/character3.glb')
  const { camera, gl } = useThree()
  const isSelected = selectedSeat?.id === seat.id
  const isEmpty = seat.status === 'empty' || !seat.name || seat.name === '空位'
  const isMaternity = seat.status === 'maternity'

  const character = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  const getAccentColor = () => {
    if (isEmpty) return '#94a3b8'
    if (isMaternity) return '#f472b6'
    if (seat.code?.startsWith('A700')) return '#3b82f6'
    if (seat.code?.startsWith('A710')) return '#22c55e'
    if (seat.code?.startsWith('A720')) return '#14b8a6'
    if (seat.code?.startsWith('A740')) return '#f97316'
    if (seat.code?.startsWith('A760')) return '#a855f7'
    if (seat.code?.startsWith('A770')) return '#ef4444'
    if (seat.code?.startsWith('A780')) return '#eab308'
    return '#64748b'
  }

  const spacing = 1.45
  const posX = seat.x * spacing
  const posZ = seat.z * spacing

  // ===== Kéo ghế mượt =====
  const isDragging = useRef(false)
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const intersection = useMemo(() => new THREE.Vector3(), [])
  const offset = useMemo(() => new THREE.Vector3(), [])

  const onPointerDown = (e: any) => {
    if (!isEditMode) return
    e.stopPropagation()
    isDragging.current = true
    setSelectedSeat(seat)
    gl.domElement.style.cursor = 'grabbing'

    // Tính offset để kéo không bị nhảy
    plane.projectPoint(e.point, intersection)
    offset.copy(intersection).sub(new THREE.Vector3(posX, 0, posZ))
  }

  const onPointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    gl.domElement.style.cursor = 'auto'

    // Lưu vị trí mới về database
    if (groupRef.current) {
      const newX = groupRef.current.position.x / spacing
      const newZ = groupRef.current.position.z / spacing

      // Cập nhật local
      setSeats(
        seats.map((s) =>
          s.id === seat.id ? { ...s, x: newX, z: newZ } : s
        )
      )

      // Lưu server
      fetch(`http://10.199.1.31:3001/api/seats/${seat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: newX, z: newZ }),
      }).catch(console.error)
    }
  }

  const onPointerMove = (e: any) => {
    if (!isDragging.current || !groupRef.current) return
    e.stopPropagation()

    const raycaster = e.ray
    if (raycaster.intersectPlane(plane, intersection)) {
      groupRef.current.position.x = intersection.x - offset.x
      groupRef.current.position.z = intersection.z - offset.z
      groupRef.current.position.y = 0
    }
  }

  return (
    <group
      ref={groupRef}
      position={[posX, 0, posZ]}
      rotation={[0, ((seat.rotation || 0) * Math.PI) / 180, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => {
        setHovered(true)
        if (isEditMode) gl.domElement.style.cursor = 'grab'
      }}
      onPointerOut={() => {
        setHovered(false)
        if (!isDragging.current) gl.domElement.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (!isEditMode) setSelectedSeat(seat)
      }}
    >
      {/* BÀN */}
      <mesh position={[0, 0.62, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      <mesh position={[-0.7, 0.31, 0.9]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.7, 0.31, 0.9]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[-0.7, 0.31, 0.5]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.7, 0.31, 0.5]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* MÁY TÍNH */}
      <mesh position={[0, 0.95, 0.75]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.95, 0.73]}>
        <boxGeometry args={[0.62, 0.38, 0.01]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.72, 0.75]}>
        <boxGeometry args={[0.12, 0.12, 0.08]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.66, 0.75]}>
        <boxGeometry args={[0.28, 0.03, 0.18]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.55, 0.82, 0.85]} castShadow>
        <boxGeometry args={[0.25, 0.4, 0.35]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* GHẾ */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.55, -0.24]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.08]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* NGƯỜI */}
      {!isEmpty && (
        <group position={[0, 0, 0.15]}>
          <primitive
            object={character}
            scale={1.5}
            rotation={[0, Math.PI / 2, 0]}
          />
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.46, 24]} />
            <meshStandardMaterial
              color={isSelected ? '#f43f5e' : hovered ? '#fbbf24' : getAccentColor()}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      )}

      {/* Tên */}
      {(hovered || isSelected) && (
        <Text
          position={[0, 1.9, 0]}
          fontSize={0.26}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000"
        >
          {seat.name || '空位'}
        </Text>
      )}
    </group>
  )
}

useGLTF.preload('/models/character3.glb')
