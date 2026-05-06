import axios from 'axios'
import type { VerdictOutput, BidderResult, HumanOverrideInput, AuditRecordEntry } from '../types/api'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

export async function getReviewQueue(tenderId: string): Promise<VerdictOutput> {
  const { data } = await api.get<VerdictOutput>('/review/queue', { params: { tender_id: tenderId } })
  return data
}

export async function getCriterionDetail(criterionId: string): Promise<CriterionResult> {
  const { data } = await api.get<CriterionResult>(`/review/criterion/${criterionId}`)
  return data
}

export async function applyOverride(input: HumanOverrideInput): Promise<AuditRecordEntry> {
  const { data } = await api.post<AuditRecordEntry>('/override/apply', input)
  return data
}

export async function generateReport(tenderId: string, format: 'pdf' | 'json' | 'xlsx' = 'pdf'): Promise<Blob> {
  const { data } = await api.get(`/report/generate`, {
    params: { tender_id: tenderId, format },
    responseType: 'blob'
  })
  return data
}

export async function downloadReport(tenderId: string, format: string): Promise<Blob> {
  const { data } = await api.get(`/report/download/${format}`, {
    params: { tender_id: tenderId },
    responseType: 'blob'
  })
  return data
}