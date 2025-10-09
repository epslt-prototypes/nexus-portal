import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import { DateInput, Input } from '../../components/Inputs.jsx'
import { useMemo, useState } from 'react'
import { useI18n } from '../../theme/LanguageProvider'
import { Printer, FileText, FileDown, FileSpreadsheet } from 'lucide-react'

export default function Receipts() {
  const { t } = useI18n()
  const [receipts] = useState([
    {
      id: 'r-009000009390',
      number: '009000009390',
      createdAt: '2025-09-25T11:04:42',
      createdAtDisplay: '2025.09.25 11:04:42',
      totalEur: '250,00',
      insuredDueEur: '97,84',
    },
    {
      id: 'r-009000009382',
      number: '009000009382',
      createdAt: '2025-09-25T10:48:17',
      createdAtDisplay: '2025.09.25 10:48:17',
      totalEur: '30,00',
      insuredDueEur: '27,76',
    },
  ])

  const [dateFrom, setDateFrom] = useState('') // YYYY-MM-DD
  const [dateTo, setDateTo] = useState('') // YYYY-MM-DD
  const [receiptNumber, setReceiptNumber] = useState('')
  const [printOpen, setPrintOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  function withinDateRange(isoDateStr) {
    if (!isoDateStr) return true
    const d = new Date(isoDateStr)
    if (Number.isNaN(d.getTime())) return true
    if (dateFrom) {
      const df = new Date(dateFrom)
      if (d < df) return false
    }
    if (dateTo) {
      const dt = new Date(dateTo)
      dt.setHours(23, 59, 59, 999)
      if (d > dt) return false
    }
    return true
  }

  const filtered = useMemo(() => {
    return receipts.filter(r => {
      if (receiptNumber && !r.number.includes(receiptNumber.trim())) return false
      if (!withinDateRange(r.createdAt)) return false
      return true
    })
  }, [receipts, receiptNumber, dateFrom, dateTo])

  return (
    <section className="py-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{t('receiptsTitle')}</h2>
          <div className="mt-6 border-t border-dashed" />

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:gap-3">
            <Input
              label={t('receiptNumber')}
              placeholder={t('enterNumber')}
              value={receiptNumber}
              onChange={e => setReceiptNumber(e.target.value)}
              className="flex-1"
            />
            <DateInput
              label={t('dateFrom')}
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
            <DateInput
              label={t('dateTo')}
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>

          <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-lg border">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left">{t('receiptNumber')}</th>
                  <th className="px-3 py-2 text-left">{t('receiptCreatedAt')}</th>
                  <th className="px-3 py-2 text-right">{t('totalPrice')}</th>
                  <th className="px-3 py-2 text-right">{t('insuredDue')}</th>
                  <th className="px-2 py-2 w-12" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="bg-white">
                    <td className="px-3 py-2 border-t border-l border-gray-200 font-mono">{r.number}</td>
                    <td className="px-3 py-2 border-t border-gray-200">{r.createdAtDisplay}</td>
                    <td className="px-3 py-2 text-right tabular-nums border-t border-gray-200">{r.totalEur} €</td>
                    <td className="px-3 py-2 text-right tabular-nums border-t border-gray-200">{r.insuredDueEur} €</td>
                    <td className="px-2 py-2 border-t border-r border-gray-200">
                      <button
                        type="button"
                        className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                        aria-label={t('printReceipt')}
                        title={t('print')}
                        onClick={() => { setSelectedReceipt(r); setPrintOpen(true) }}
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>{t('noRecords')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            open={printOpen}
            onClose={() => setPrintOpen(false)}
            title={t('exportReceipt')}
            size="md"
            footer={(
              <>
                <Button variant="primary" onClick={() => setPrintOpen(false)}>{t('cancelAction')}</Button>
              </>
            )}
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t('receiptLabel')} {selectedReceipt?.number}</div>
                    <div className="mt-0.5 text-xs text-gray-600">{selectedReceipt?.createdAtDisplay}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{t('totalPriceShort')}</div>
                    <div className="text-sm font-semibold tabular-nums text-gray-900">{selectedReceipt?.totalEur} €</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-800">{t('chooseExportFormat')}</div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Button variant="secondary" onClick={() => { /* placeholder for DOCX generation */ setPrintOpen(false) }}>
                    <FileText className="mr-2 h-4 w-4 text-blue-600" /> {t('word')}
                  </Button>
                  <Button variant="secondary" onClick={() => { /* placeholder for PDF generation */ setPrintOpen(false) }}>
                    <FileDown className="mr-2 h-4 w-4 text-red-600" /> {t('pdf')}
                  </Button>
                  <Button variant="secondary" onClick={() => { /* placeholder for Excel generation */ setPrintOpen(false) }}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> {t('excel')}
                  </Button>
                </div>
                <p className="mt-3 text-xs text-gray-500">{t('fileWillDownload')}</p>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    </section>
  )
}





