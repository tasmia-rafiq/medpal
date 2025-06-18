import clientPromise from './mongodb'
import { MedicalReport } from './types'
import { ObjectId } from 'mongodb'

export async function saveReport(report: Omit<MedicalReport, '_id'>) {
  const client = await clientPromise
  const db = client.db('medpal')
  const collection = db.collection<MedicalReport>('reports')
  
  const result = await collection.insertOne({
    ...report,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  return result.insertedId.toString()
}

export async function getUserReports(userId: string): Promise<MedicalReport[]> {
  const client = await clientPromise
  const db = client.db('medpal')
  const collection = db.collection<MedicalReport>('reports')
  
  const reports = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  
  return reports.map(report => ({
    ...report,
    _id: report._id?.toString(),
  }))
}

export async function getReport(reportId: string, userId: string): Promise<MedicalReport | null> {
  const client = await clientPromise
  const db = client.db('medpal')
  const collection = db.collection<MedicalReport>('reports')
  
  const report = await collection.findOne({
    _id: new ObjectId(reportId),
    userId,
  })
  
  if (!report) return null
  
  return {
    ...report,
    _id: report._id.toString(),
  }
}

export async function deleteReport(reportId: string, userId: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db('medpal')
  const collection = db.collection<MedicalReport>('reports')
  
  const result = await collection.deleteOne({
    _id: new ObjectId(reportId),
    userId,
  })
  
  return result.deletedCount === 1
}

export async function updateReport(
  reportId: string,
  userId: string,
  updates: Partial<Pick<MedicalReport, 'title' | 'tags' | 'category'>>
): Promise<boolean> {
  const client = await clientPromise
  const db = client.db('medpal')
  const collection = db.collection<MedicalReport>('reports')
  
  const result = await collection.updateOne(
    {
      _id: new ObjectId(reportId),
      userId,
    },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  )
  
  return result.modifiedCount === 1
}