import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Lấy tất cả ghế
app.get('/api/seats', async (_req, res) => {
  try {
    const seats = await prisma.seats.findMany({
      orderBy: [{ floor_id: 'asc' }, { z: 'asc' }, { x: 'asc' }]
    })
    res.json(seats)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch seats' })
  }
})

// Lấy ghế theo tầng
app.get('/api/seats/floor/:floorId', async (req, res) => {
  try {
    const floorId = parseInt(req.params.floorId)
    const seats = await prisma.seats.findMany({
      where: { floor_id: floorId },
      orderBy: [{ z: 'asc' }, { x: 'asc' }]
    })
    res.json(seats)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch seats' })
  }
})

// Thêm ghế mới
app.post('/api/seats', async (req, res) => {
  try {
    const data = req.body
    const seat = await prisma.seats.create({ data })
    res.json(seat)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create seat' })
  }
})

// Cập nhật ghế
app.put('/api/seats/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body
    const updated = await prisma.seats.update({
      where: { id },
      data
    })
    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update seat' })
  }
})

// Xóa ghế
app.delete('/api/seats/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.seats.delete({ where: { id } })
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete seat' })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running at http://0.0.0.0:${PORT}`)
})
