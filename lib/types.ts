export interface MedicalReport {
  _id?: string
  userId: string
  title: string
  extractedText: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  category?: string
}

export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}