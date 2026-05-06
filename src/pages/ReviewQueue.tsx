import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { VerdictOutput, BidderResult } from '../types/api'
import BidderCard from '../components/BidderCard'
import YellowFlagBadge from '../components/YellowFlagBadge'

interface ReviewQueueProps {
  tenderId: string
}

export default function ReviewQueue({ tenderId }: ReviewQueueProps) {
  const navigate = useNavigate()
  const [data, setData] = useState<VerdictOutput | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'NEEDS_REVIEW' | 'ELIGIBLE' | 'NOT_ELIGIBLE'>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!tenderId) return
    setLoading(false)
    setData({
      tender_id: tenderId,
      tender_name: 'Security Services 2025',
      bidders: [
        {
          bidder_id: 'B-001',
          bidder_name: 'Sharma Construction Pvt Ltd',
          criterion_results: [
            {
              criterion_id: 'C-001',
              criterion_label: 'Minimum Turnover',
              verdict: 'NEEDS_REVIEW',
              ai_confidence: 0.65,
              verification_checks: [],
              yellow_flags: [{ trigger_type: 'ENTITY_MISMATCH', reason: 'Name mismatch', affected_entity: 'company_name', confidence_delta: 0.15 }],
              evidence_refs: [],
              reason: 'Company name in PAN does not match tender'
            }
          ],
          overall_verdict: 'NEEDS_REVIEW',
          overall_confidence: 0.65,
          verdict_reason: 'Entity mismatch detected'
        },
        {
          bidder_id: 'B-002',
          bidder_name: 'ABC Enterprises',
          criterion_results: [
            {
              criterion_id: 'C-001',
              criterion_label: 'Minimum Turnover',
              verdict: 'ELIGIBLE',
              ai_confidence: 0.95,
              verification_checks: [{ check_name: 'identity_binding', passed: true, detail: 'Matched', confidence: 0.95 }],
              yellow_flags: null,
              evidence_refs: [],
              reason: 'All checks passed'
            }
          ],
          overall_verdict: 'ELIGIBLE',
          overall_confidence: 0.95,
          verdict_reason: 'All criteria met'
        }
      ],
      audit_records: [],
      yellow_flag_summary: { total: 1, by_type: { ENTITY_MISMATCH: 1 } }
    })
  }, [tenderId])

  const filteredBidders = data?.bidders.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.overall_verdict === filter
    const matchesSearch = b.bidder_name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  }) || []

  if (!tenderId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Select a tender from the Dashboard to view the review queue.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Review Queue</h2>
        <p className="text-slate-500">{data?.tender_name}</p>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search bidders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All</option>
          <option value="NEEDS_REVIEW">Needs Review</option>
          <option value="ELIGIBLE">Eligible</option>
          <option value="NOT_ELIGIBLE">Not Eligible</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="text-sm text-slate-600">{filteredBidders.length} bidders</span>
          {data?.yellow_flag_summary.total ? (
            <YellowFlagBadge count={data.yellow_flag_summary.total} />
          ) : null}
        </div>
        <div className="divide-y divide-slate-100">
          {filteredBidders.map((bidder) => (
            <div
              key={bidder.bidder_id}
              onClick={() => navigate(`/review/${bidder.bidder_id}`)}
              className="p-4 hover:bg-slate-50 cursor-pointer"
            >
              <BidderCard bidder={bidder} />
            </div>
          ))}
        </div>
        {filteredBidders.length === 0 && (
          <div className="p-8 text-center text-slate-500">No bidders found</div>
        )}
      </div>
    </div>
  )
}