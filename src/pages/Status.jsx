import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { Select, DateInput } from '../components/Inputs.jsx'
import Modal from '../components/Modal.jsx'
import React, { useMemo, useState } from 'react'

export default function Status() {
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

  const [services] = useState([
    {
      id: 'srv-1',
      code: 'A112',
      name: 'Chirurgo, plaštakos chirurgo, ortopedo-traumatologo konsultacija',
      quantity: '1',
      unitPrice: '45,00',
      diseaseCode: 'H47.0',
      info: 'Nekompensuojama. Išnaudota arba buvo neskirta draudimo suma.',
      status: 'rejected',
      notCompensated: true,
      createdAt: '2025-06-01',
      enteredBy: 'sveikata1',
      insurerComment: 'Nekompensuojama pagal taisykles.',
      partnerComment: 'Prašome pateikti papildomus dokumentus.',
      authorizationNumber: '00900009390',
      authorizationDate: '2025-06-01',
      insuredName: 'Tomas Meškutavičius',
      cardNumber: '944039580000000000',
      personalCode: '47912121010',
    },
    {
      id: 'srv-2',
      code: 'B210',
      name: 'Gydytojo konsultacija',
      quantity: '2',
      unitPrice: '30,00',
      diseaseCode: 'A10.1',
      info: 'Laukiama draudiko patvirtinimo.',
      status: 'pending',
      notCompensated: false,
      tlkCompensation: '10,00',
      createdAt: '2025-06-15',
      enteredBy: 'sveikata1',
      insurerComment: 'Peržiūrima.',
      partnerComment: '—',
      authorizationNumber: '00900009390',
      authorizationDate: '2025-06-16',
      insuredName: 'Tomas Meškutavičius',
      cardNumber: '944039580000000000',
      personalCode: '47912121010',
    },
    {
      id: 'srv-3',
      code: 'C005',
      name: 'Rentgeno tyrimas',
      quantity: '1',
      unitPrice: '25,00',
      diseaseCode: 'B20.0',
      info: 'Patvirtinta kompensacija.',
      status: 'approved',
      notCompensated: false,
      tlkCompensation: '15,00',
      createdAt: '2025-07-05',
      enteredBy: 'sveikata1',
      insurerComment: 'Patvirtinta.',
      partnerComment: '—',
      authorizationNumber: '00900009390',
      authorizationDate: '2025-07-05',
      insuredName: 'Tomas Meškutavičius',
      cardNumber: '944039580000000000',
      personalCode: '47912121010',
    },
    {
      id: 'srv-4',
      code: 'D777',
      name: 'Papildomas tyrimas',
      quantity: '1',
      unitPrice: '55,00',
      diseaseCode: 'C30.0',
      info: 'Prašome patikslinti įrašytus duomenis.',
      status: 'needsClarification',
      notCompensated: false,
      tlkCompensation: '0,00',
      createdAt: '2025-07-10',
      enteredBy: 'sveikata1',
      insurerComment: 'Reikalingi papildomi duomenys.',
      partnerComment: 'Patikslinimas bus pateiktas.',
      authorizationNumber: '00900009390',
      authorizationDate: '2025-07-10',
      insuredName: 'Tomas Meškutavičius',
      cardNumber: '944039580000000000',
      personalCode: '47912121010',
    },
  ])

  const [hoveredServiceId, setHoveredServiceId] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all') // all | approved | pending | rejected | needsClarification
  const [dateFrom, setDateFrom] = useState('') // YYYY-MM-DD
  const [dateTo, setDateTo] = useState('') // YYYY-MM-DD
  const [userFilter, setUserFilter] = useState('all')

  const availableUsers = ['sveikata1']

  function withinDateRange(dateStr) {
    if (!dateStr) return true
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return true
    if (dateFrom) {
      const df = new Date(dateFrom)
      if (d < df) return false
    }
    if (dateTo) {
      const dt = new Date(dateTo)
      dt.setHours(23,59,59,999)
      if (d > dt) return false
    }
    return true
  }

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (userFilter !== 'all' && s.enteredBy !== userFilter) return false
      if (!withinDateRange(s.createdAt)) return false
      return true
    })
  }, [services, statusFilter, userFilter, dateFrom, dateTo])

  

  return (
    <section className="py-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Paslaugų būsena</h2>
          <div className="mt-6 border-t border-dashed" />
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:gap-3">
            <div className="relative w-full flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Būsena</label>
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                selectClassName="text-sm"
              >
                <option value="all">Visos</option>
                <option value="approved">Patvirtinti</option>
                <option value="pending">Laukiami</option>
                <option value="rejected">Atmesti</option>
                <option value="needsClarification">Būtina patikslinti</option>
              </Select>
            </div>
            <div className="relative w-full flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Vartotojas</label>
              <Select
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                selectClassName="text-sm"
              >
                <option value="all">Visi</option>
                {availableUsers.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </Select>
            </div>
            <DateInput
              label="Data nuo"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="h-10"
            />
            <DateInput
              label="Data iki"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Patvirtinta</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-500" /> Laukia patvirtinimo</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-500" /> Draudikas nekompensuoja</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-500" /> Būtina patikslinti</div>
          </div>

          <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-lg border">
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
                {filteredServices.map(svc => {
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
                  const displayVatRate = `0%`
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
                        onClick={() => { setSelectedService(svc); setDetailOpen(true) }}
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
                        onClick={() => { setSelectedService(svc); setDetailOpen(true) }}
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
                        onClick={() => { setSelectedService(svc); setDetailOpen(true) }}
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

          <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Paslaugos detalės">
            {selectedService && (
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div className="mb-1 text-gray-500">Pavadinimas</div>
                  <div className="text-gray-900">{selectedService.name}</div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Kodas</div>
                    <div className="font-mono text-gray-900">{selectedService.code}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Ligos kodas</div>
                    <div className="text-gray-900">{selectedService.diseaseCode}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Būsena</div>
                    <div className="text-gray-900">
                      <span className={`mr-2 inline-block h-3 w-3 rounded-sm align-middle ${selectedService.status === 'approved' ? 'bg-emerald-500' : selectedService.status === 'pending' ? 'bg-amber-500' : selectedService.status === 'needsClarification' ? 'bg-orange-500' : 'bg-rose-500'}`} />
                      <span className="align-middle">{selectedService.status === 'approved' ? 'Patvirtinta' : selectedService.status === 'pending' ? 'Laukia patvirtinimo' : selectedService.status === 'needsClarification' ? 'Būtina patikslinti' : 'Atmesta'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Paslaugos kodas</div>
                    <div className="font-mono text-gray-900">{selectedService.code}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Kiekis</div>
                    <div className="text-gray-900">{selectedService.quantity}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Vnt. kaina (EUR)</div>
                    <div className="text-gray-900">{selectedService.unitPrice}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Nuolaida</div>
                    <div className="text-gray-900">{selectedService.discountPercent || '0,00'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">TLK kompensacija (EUR)</div>
                    <div className="text-gray-900">{selectedService.tlkCompensation || '0,00'}</div>
                  </div>
                </div>

                <div className="border-t border-dashed" />

                {(() => {
                  const quantity = Math.max(parseInt(String(selectedService.quantity).replace(/\s/g, ''), 10) || 1, 1)
                  const unit = parseEur(selectedService.unitPrice)
                  const discountPct = parseEur(selectedService.discountPercent || '0,00')
                  const discountValPerUnit = unit * (discountPct / 100)
                  const discountValTotal = discountValPerUnit * quantity
                  const afterDiscountPerUnit = Math.max(unit - discountValPerUnit, 0)
                  const afterDiscountTotal = afterDiscountPerUnit * quantity
                  const tlkPerUnit = selectedService.notCompensated ? 0 : parseEur(selectedService.tlkCompensation || '0,00')
                  const tlkTotal = tlkPerUnit * quantity
                  const clientTotal = Math.max(afterDiscountTotal - tlkTotal, 0)
                  const totalWithVat = clientTotal
                  const vatRate = '0%'
                  const totalNoVat = afterDiscountTotal
                  const totalPrice = unit * quantity
                  return (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-gray-500">Visa kaina (EUR)</div>
                        <div className="text-gray-900">{formatEur(totalPrice)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">TLK nuolaida (EUR)</div>
                        <div className="text-gray-900">{formatEur(tlkTotal)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">Nuolaida (EUR)</div>
                        <div className="text-gray-900">{formatEur(discountValTotal)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">Draudiko mokama dalis (EUR)</div>
                        <div className="text-gray-900">{formatEur(tlkTotal)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">Sumokėta su PVM (EUR)</div>
                        <div className="text-gray-900">{formatEur(totalWithVat)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">PVM tarifas (%)</div>
                        <div className="text-gray-900">{vatRate}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-gray-500">Sumokėta be PVM (EUR)</div>
                        <div className="text-gray-900">{formatEur(totalNoVat)}</div>
                      </div>
                    </div>
                  )
                })()}

                <div className="border-t border-dashed" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Įvedė</div>
                    <div className="text-gray-900">{selectedService.enteredBy || '—'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Autorizacijos Nr.</div>
                    <div className="text-gray-900">{selectedService.authorizationNumber || '—'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Apdraustasis</div>
                    <div className="text-gray-900">{selectedService.insuredName || '—'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Data</div>
                    <div className="text-gray-900">{selectedService.createdAt || '—'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Kortelės numeris</div>
                    <div className="font-mono text-gray-900">{selectedService.cardNumber || '—'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Asmens kodas</div>
                    <div className="font-mono text-gray-900">{selectedService.personalCode || '—'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-gray-500">Partnerio komentaras</div>
                    <div className="text-gray-900">{selectedService.partnerComment || '—'}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Draudiko komentaras</div>
                    <div className="text-gray-900">{selectedService.insurerComment || '—'}</div>
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <Button onClick={() => setDetailOpen(false)}>Uždaryti</Button>
                </div>
              </div>
            )}
          </Modal>

        </Card>
      </div>
    </section>
  )
}


