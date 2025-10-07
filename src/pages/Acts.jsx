import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import { DateInput, Input } from '../components/Inputs.jsx'
import React, { useMemo, useState } from 'react'
import { Printer, FileText, FileDown, FileSpreadsheet } from 'lucide-react'
import generatedActs from '../mock/generated_acts.json'

export default function Acts() {
  function parseEur(value) {
    if (value == null) return 0
    const normalized = String(value).replace(/\s/g, '').replace(',', '.')
    const num = Number(normalized)
    return isNaN(num) ? 0 : num
  }
  function formatEur(num) {
    const fixed = (Number(num) || 0).toFixed(2)
    return fixed.replace('.', ',')
  }

  const [acts] = useState([
    {
      id: 'act-202210121',
      number: 'Aktas202210121',
      status: 'Patvirtinta',
      totalEur: '10,00',
      totalNoVatEur: '8,26',
      createdAt: '2022-10-12T00:00:00',
      createdAtDisplay: '2022-10-12',
      invoiceReceivedAt: '2022-10-12T00:00:00',
      invoiceReceivedAtDisplay: '2022-10-12',
      enteredBy: 'sveikata1',
      services: [
        {
          id: 'srv-a1',
          code: 'A112',
          name: 'Chirurgo konsultacija',
          quantity: '1',
          unitPrice: '45,00',
          diseaseCode: 'H47.0',
          info: 'Patvirtinta kompensacija.',
          status: 'approved',
          notCompensated: false,
          createdAt: '2022-10-12',
          enteredBy: 'sveikata1',
          tlkCompensation: '15,00',
          vatRate: 21, // PVM tarifas (%)
        },
        {
          id: 'srv-a2',
          code: 'B210',
          name: 'Gydytojo konsultacija',
          quantity: '2',
          unitPrice: '30,00',
          diseaseCode: 'A10.1',
          info: 'Patvirtinta kompensacija.',
          status: 'approved',
          notCompensated: false,
          tlkCompensation: '10,00',
          vatRate: 21, // PVM tarifas (%)
          createdAt: '2022-10-12',
          enteredBy: 'sveikata1',
        },
      ],
    },
    ...generatedActs
  ])

  const [dateFrom, setDateFrom] = useState('') // YYYY-MM-DD
  const [dateTo, setDateTo] = useState('') // YYYY-MM-DD
  const [searchQuery, setSearchQuery] = useState('')

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
    return acts.filter(a => {
      if (!withinDateRange(a.createdAt)) return false
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const searchableText = [
          a.number,
          a.status,
          a.totalEur,
          a.totalNoVatEur,
          a.createdAtDisplay,
          a.invoiceReceivedAtDisplay,
          a.enteredBy
        ].join(' ').toLowerCase()
        
        return searchableText.includes(query)
      }
      
      return true
    })
  }, [acts, dateFrom, dateTo, searchQuery])

  const [selectedAct, setSelectedAct] = useState(null)
  const [hoveredServiceId, setHoveredServiceId] = useState(null)
  const [printOpen, setPrintOpen] = useState(false)

  return (
    <section className="py-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-start">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedAct ? selectedAct.number : 'Apmokėjimo aktai'}</h2>
            {selectedAct && (
              <div className="ml-auto">
                <button
                  type="button"
                  className="focus-ring inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 hover:bg-gray-50"
                  onClick={() => setSelectedAct(null)}
                >
                  Uždaryti
                </button>
              </div>
            )}
          </div>
          <div className="mt-6 border-t border-dashed" />

          {!selectedAct && (
            <>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <Input
                  label="Ieškoti"
                  placeholder="Ieškoti pagal bet kurį lauką..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-3">
                  <DateInput
                    label="Data nuo"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                  />
                  <DateInput
                    label="Data iki"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-lg border">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left whitespace-nowrap">Reikalavimo akto Nr.</th>
                      <th className="px-3 py-2 text-left w-full">Apmokėjimo būklė</th>
                      <th className="px-3 py-2 text-right">Suma (EUR)</th>
                      <th className="px-3 py-2 text-right">Suma be PVM (EUR)</th>
                      <th className="px-3 py-2 text-left">Sudarymo data</th>
                      <th className="px-3 py-2 text-left">SF gavimo data</th>
                      <th className="px-3 py-2 text-left">Įvedė</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id} className="bg-white cursor-pointer hover:bg-[var(--brand-light)]" onClick={() => setSelectedAct(a)}>
                        <td className="px-3 py-2 border-t border-l border-gray-200 whitespace-nowrap">{a.number}</td>
                        <td className="px-3 py-2 border-t border-gray-200 w-full whitespace-nowrap">
                          <span className={`font-medium ${
                            a.status === 'Patvirtinta' ? 'text-green-600' :
                            a.status === 'Laukia patvirtinimo' ? 'text-yellow-600' :
                            a.status === 'Atmesta' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums border-t border-gray-200 whitespace-nowrap">{a.totalEur} €</td>
                        <td className="px-3 py-2 text-right tabular-nums border-t border-gray-200 whitespace-nowrap">{a.totalNoVatEur} €</td>
                        <td className="px-3 py-2 border-t border-gray-200 whitespace-nowrap">{a.createdAtDisplay}</td>
                        <td className="px-3 py-2 border-t border-gray-200 whitespace-nowrap">{a.invoiceReceivedAtDisplay}</td>
                        <td className="px-3 py-2 border-t border-r border-gray-200 whitespace-nowrap">{a.enteredBy}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>Įrašų nerasta pagal pasirinktus filtrus</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {selectedAct && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-gray-500">Suformavimo data</div>
                  <div className="text-gray-900">{selectedAct.createdAtDisplay}</div>
                </div>
                <div>
                  <div className="mb-1 text-gray-500">SF gavimo data</div>
                  <div className="text-gray-900">{selectedAct.invoiceReceivedAtDisplay}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-green-500" /> Patvirtinta</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-yellow-500" /> Laukia patvirtinimo</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-500" /> Atmesta</div>
              </div>

              <div className="mt-2 overflow-x-auto overflow-y-hidden rounded-lg border">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-right">Visa kaina (EUR)</th>
                      <th className="px-3 py-2 text-right">TLK dalis (EUR)</th>
                      <th className="px-3 py-2 text-right">Nuolaida (EUR)</th>
                      <th className="px-3 py-2 text-right">Draudiko mokama dalis</th>
                      <th className="px-3 py-2 text-right">Kliento mokama dalis</th>
                      <th className="px-3 py-2 text-right">PVM tarifas (proc.)</th>
                      <th className="px-3 py-2 text-right">Suma be PVM (EUR)</th>
                      <th className="px-3 py-2 text-left">Ligos kodas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAct.services.map(svc => {
                      const quantity = Math.max(parseInt(String(svc.quantity).replace(/\s/g, ''), 10) || 1, 1)
                      const unit = parseEur(svc.unitPrice)
                      const discountPct = parseEur(svc.discountPercent || '0,00')
                      const discountValPerUnit = unit * (discountPct / 100)
                      const discountValTotal = discountValPerUnit * quantity
                      const afterDiscountPerUnit = Math.max(unit - discountValPerUnit, 0)
                      const afterDiscountTotal = afterDiscountPerUnit * quantity
                      const tlkPerUnit = svc.notCompensated ? 0 : parseEur(svc.tlkCompensation || '0,00')
                      const tlkTotal = tlkPerUnit * quantity
                      const clientPerUnit = Math.max(afterDiscountPerUnit - tlkPerUnit, 0)
                      const clientTotal = Math.max(afterDiscountTotal - tlkTotal, 0)
                      const displayQuantity = `${quantity} vnt`
                      const displayTotal = `${formatEur(unit * quantity)} €`
                      const displayTLK = `${formatEur(tlkTotal)} €`
                      const displayDiscount = `${formatEur(discountValTotal)} €`
                      const displayInsurer = `${formatEur(tlkTotal)} €`
                      const displayClient = `${formatEur(clientTotal)} €`
                      const displayVatRate = `${svc.vatRate || 0}%`
                      const displayNoVat = `${formatEur(afterDiscountTotal)} €`
                      const statusColor = svc.status === 'approved' ? 'bg-emerald-500' : svc.status === 'pending' ? 'bg-amber-500' : svc.status === 'needsClarification' ? 'bg-orange-500' : 'bg-rose-500'
                      const statusLabel = svc.status === 'approved' ? 'Patvirtinta' : svc.status === 'pending' ? 'Laukia patvirtinimo' : svc.status === 'needsClarification' ? 'Būtina patikslinti' : 'Atmesta'
                      const isHovered = hoveredServiceId === svc.id
                      const hoverBg = isHovered ? 'bg-[var(--brand-light)]' : 'bg-white'
                      return (
                        <React.Fragment key={svc.id}>
                          <tr
                            key={`${svc.id}-identity`}
                            className={`cursor-pointer ${hoverBg}`}
                            onMouseEnter={() => setHoveredServiceId(svc.id)}
                            onMouseLeave={() => setHoveredServiceId(null)}
                          >
                            <td className="px-3 py-1 text-sm border-t border-l border-r border-gray-200" colSpan={8}>
                              <span className="font-medium">{svc.name}</span>
                              <span className="mx-2 text-gray-400">·</span>
                              <span className="font-mono text-gray-700">Kodas {svc.code}</span>
                              <span className="mx-2 text-gray-400">·</span>
                              <span className="text-gray-700">{displayQuantity}</span>
                            </td>
                          </tr>
                          <tr
                            key={`${svc.id}-financials`}
                            className={`cursor-pointer ${hoverBg}`}
                            onMouseEnter={() => setHoveredServiceId(svc.id)}
                            onMouseLeave={() => setHoveredServiceId(null)}
                          >
                            <td className="px-3 py-1 text-right tabular-nums border-l border-gray-200">{displayTotal}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayTLK}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayDiscount}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayInsurer}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayClient}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayVatRate}</td>
                            <td className="px-3 py-1 text-right tabular-nums">{displayNoVat}</td>
                            <td className="px-3 py-1 border-r border-gray-200">{svc.diseaseCode}</td>
                          </tr>
                          <tr
                            key={`${svc.id}-status`}
                            className={`cursor-pointer ${hoverBg}`}
                            onMouseEnter={() => setHoveredServiceId(svc.id)}
                            onMouseLeave={() => setHoveredServiceId(null)}
                          >
                            <td className="px-3 py-1 text-xs text-gray-700 border-b border-l border-r border-gray-200" colSpan={8}>
                              <span className={`mr-2 inline-block h-3 w-3 rounded-sm align-middle ${statusColor}`} />
                              <span className="font-medium mr-2 align-middle">{statusLabel}</span>
                              <span className="text-gray-600 align-middle">{svc.info}</span>
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap items-start gap-4">
                <div className="order-2 mt-2 md:order-1">
                  <Button
                    variant="secondary"
                    onClick={() => setPrintOpen(true)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Spausdinti
                  </Button>
                </div>
                <div className="ml-auto order-1 w-full max-w-sm rounded-lg border p-4 md:order-2">
                  {(() => {
                    const totals = selectedAct.services.reduce((acc, svc) => {
                      const quantity = Math.max(parseInt(String(svc.quantity).replace(/\s/g, ''), 10) || 1, 1)
                      const unit = parseEur(svc.unitPrice)
                      const discountPct = parseEur(svc.discountPercent || '0,00')
                      const discountValPerUnit = unit * (discountPct / 100)
                      const discountValTotal = discountValPerUnit * quantity
                      const afterDiscountPerUnit = Math.max(unit - discountValPerUnit, 0)
                      const afterDiscountTotal = afterDiscountPerUnit * quantity
                      const tlkPerUnit = svc.notCompensated ? 0 : parseEur(svc.tlkCompensation || '0,00')
                      const tlkTotal = tlkPerUnit * quantity
                      const vatRate = svc.vatRate || 0
                      
                      // Calculate VAT amounts based on the mapping requirements
                      // Draudiko mokama suma su PVM (EUR) = tlkTotal
                      // Draudiko mokama suma be PVM (EUR) = tlkTotal / (1 + vatRate/100)
                      // PVM (EUR) = tlkTotal - (tlkTotal / (1 + vatRate/100))
                      const insurerAmountWithVat = tlkTotal
                      const insurerAmountWithoutVat = vatRate > 0 ? insurerAmountWithVat / (1 + vatRate / 100) : insurerAmountWithVat
                      const vatAmount = insurerAmountWithVat - insurerAmountWithoutVat
                      
                      acc.totalInsurerWithoutVat += insurerAmountWithoutVat
                      acc.totalVat += vatAmount
                      acc.totalInsurerWithVat += insurerAmountWithVat
                      return acc
                    }, { totalInsurerWithoutVat: 0, totalVat: 0, totalInsurerWithVat: 0 })
                    return (
                      <>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Viso be PVM (EUR)</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalInsurerWithoutVat)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                          <span>PVM (EUR)</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalVat)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                          <span>Viso (EUR)</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalInsurerWithVat)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </>
          )}
        </Card>

        <Modal
          open={printOpen}
          onClose={() => setPrintOpen(false)}
          title="Eksportuoti aktą"
          size="md"
          footer={(
            <>
              <Button variant="primary" onClick={() => setPrintOpen(false)}>Atšaukti</Button>
            </>
          )}
        >
          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">Aktas {selectedAct?.number}</div>
                  <div className="mt-0.5 text-xs text-gray-600">{selectedAct?.createdAtDisplay}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">Viso (EUR)</div>
                  <div className="text-sm font-semibold tabular-nums text-gray-900">
                    {selectedAct ? (() => {
                      const totalInsurerWithVat = selectedAct.services.reduce((acc, svc) => {
                        const quantity = Math.max(parseInt(String(svc.quantity).replace(/\s/g, ''), 10) || 1, 1)
                        const tlkPerUnit = svc.notCompensated ? 0 : parseEur(svc.tlkCompensation || '0,00')
                        const tlkTotal = tlkPerUnit * quantity
                        return acc + tlkTotal
                      }, 0)
                      return `${formatEur(totalInsurerWithVat)} €`
                    })() : '0,00 €'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-800">Pasirinkite eksporto formatą</div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button variant="secondary" onClick={() => { /* placeholder for DOCX generation */ setPrintOpen(false) }}>
                  <FileText className="mr-2 h-4 w-4 text-blue-600" /> Word
                </Button>
                <Button variant="secondary" onClick={() => { /* placeholder for PDF generation */ setPrintOpen(false) }}>
                  <FileDown className="mr-2 h-4 w-4 text-red-600" /> PDF
                </Button>
                <Button variant="secondary" onClick={() => { /* placeholder for Excel generation */ setPrintOpen(false) }}>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Excel
                </Button>
              </div>
              <p className="mt-3 text-xs text-gray-500">Failas bus atsisiųstas į jūsų įrenginį.</p>
            </div>
          </div>
        </Modal>
    </div>
    </section>
  )
}





