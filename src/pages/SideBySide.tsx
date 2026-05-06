import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { BidderResult, CriterionResult, VerdictOutput } from '../types/api'
import CriterionResultComponent from '../components/CriterionResult'
import OverrideModal from '../components/OverrideModal'
import BBoxOverlay from '../components/BBoxOverlay'

interface SideBySideProps {
  tenderId: string
}

export default function SideBySide({ tenderId }: SideBySideProps) {
  const { bidderId } = useParams<{ bidderId: string }>()
  const navigate = useNavigate()
  const [bidder, setBidder] = useState<BidderResult | null>(null)
  const [selectedCriterion, setSelectedCriterion] = useState<CriterionResult | null>(null)
  const [showOverride, setShowOverride] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bidderId) return
    setLoading(false)
    setBidder({
      bidder_id: bidderId,
      bidder_name: 'Sharma Construction Pvt Ltd',
      criterion_results: [
        {
          criterion_id: 'C-001',
          criterion_label: 'Minimum Annual Turnover',
          verdict: 'NEEDS_REVIEW',
          ai_confidence: 0.65,
          verification_checks: [],
          yellow_flags: [{ trigger_type: 'ENTITY_MISMATCH', reason: 'Name mismatch between PAN and tender', affected_entity: 'company_name', confidence_delta: 0.15 }],
          evidence_refs: ['SEG-001'],
          reason: 'Entity name mismatch detected'
        },
        {
          criterion_id: 'C-002',
          criterion_label: 'GST Registration',
          verdict: 'ELIGIBLE',
          ai_confidence: 0.92,
          verification_checks: [
            { check_name: 'identity_binding', passed: true, detail: 'GSTIN valid format', confidence: 0.92 }
          ],
          yellow_flags: null,
          evidence_refs: ['SEG-002'],
          reason: 'GST registration verified'
        }
      ],
      overall_verdict: 'NEEDS_REVIEW',
      overall_confidence: 0.65,
      verdict_reason: 'Entity mismatch requires manual review'
    })
  }, [bidderId])

  if (!bidderId) {
    return <div className="text-center py-12 text-slate-500">Select a bidder from the queue</div>
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/queue')} className="text-blue-600 hover:text-blue-700">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{bidder?.bidder_name}</h2>
          <p className="text-slate-500">{bidder?.bidder_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">AI Reasoning</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            {bidder?.criterion_results.map((criterion) => (
              <div
                key={criterion.criterion_id}
                onClick={() => setSelectedCriterion(criterion)}
                className={`p-4 cursor-pointer hover:bg-slate-50 ${
                  selectedCriterion?.criterion_id === criterion.criterion_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <CriterionResultComponent criterion={criterion} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Source Document</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex items-center justify-center">
            {selectedCriterion ? (
              <BBoxOverlay
                pageNumber={1}
                bboxes={selectedCriterion.evidence_refs.map((ref, i) => ({ ref, x: 100 + i * 50, y: 100 + i * 30, w: 200, h: 40 }))}
              />
            ) : (
              <p className="text-slate-500">Select a criterion to view source evidence</p>
            )}
          </div>
        </div>
      </div>

      {selectedCriterion && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={() => setShowOverride(true)}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Override Verdict
          </button>
        </div>
      )}

      {showOverride && selectedCriterion && (
        <OverrideModal
          criterion={selectedCriterion}
          bidderId={bidderId}
          onClose={() => setShowOverride(false)}
          onSubmit={() => {
            setShowOverride(false)
            navigate('/queue')
          }}
        />
      )}
    </div>
  )
}