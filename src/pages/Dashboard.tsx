import { useState, useEffect } from 'react'
import type { VerdictOutput } from '../types/api'

interface DashboardProps {
  onSelectTender: (tenderId: string) => void
}

interface TenderSummary {
  tender_id: string
  tender_name: string
  bidder_count: number
  status: string
}

export default function Dashboard({ onSelectTender }: DashboardProps) {
  const [recentTenders, setRecentTenders] = useState<TenderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
    setRecentTenders([
      { tender_id: 'CRPF-2025-014', tender_name: 'Security Services 2025', bidder_count: 12, status: 'COMPLETED' },
      { tender_id: 'CRPF-2025-013', tender_name: 'IT Infrastructure', bidder_count: 8, status: 'IN_PROGRESS' },
      { tender_id: 'CRPF-2025-012', tender_name: 'Medical Supplies', bidder_count: 15, status: 'PENDING' }
    ])
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Overview of recent tender evaluations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Tenders</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">19</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Recent Tenders</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Tender ID</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Name</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Bidders</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left p-4 text-sm font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentTenders.map((tender) => (
              <tr key={tender.tender_id} className="border-t border-slate-100">
                <td className="p-4 text-sm">{tender.tender_id}</td>
                <td className="p-4 text-sm">{tender.tender_name}</td>
                <td className="p-4 text-sm">{tender.bidder_count}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      tender.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : tender.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tender.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onSelectTender(tender.tender_id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}