import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { Select, Input } from '../components/Inputs.jsx'
import { useMemo, useState } from 'react'
import katalogas from '../mock/katalogas.json'

export default function ServicesList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('viskas') // 'viskas' | 'draudigo-patvirtintos' | 'draudiko-nepatvirtintos'

  // Process katalogas data and add status based on TLK compensation
  const services = useMemo(() => {
    const list = Array.isArray(katalogas) ? katalogas : []
    return list.map((entry, idx) => {
      const code = String(entry.code || '').trim()
      const name = String(entry.name || '').replace(/\s+/g, ' ').trim()
      const unitPrice = String(entry.unitPrice || '0,00').trim()
      const vatRate = String(entry.vatRate || '0,00').trim()
      const tlkCompensation = String(entry.tlkCompensation || '0,00').trim()
      const validFrom = String(entry.validFrom || '').trim()
      const validTo = String(entry.validTo || '').trim()
      
      // Determine status based on TLK compensation
      const tlkValue = parseFloat(tlkCompensation.replace(',', '.')) || 0
      const status = tlkValue > 0 ? 'draudigo-patvirtintos' : 'draudiko-nepatvirtintos'
      
      return {
        id: `svc-${idx}`,
        code,
        name,
        unitPrice,
        vatRate,
        tlkCompensation,
        validFrom,
        validTo,
        status
      }
    })
  }, [])

  // Filter services based on search query and status filter
  const filteredServices = useMemo(() => {
    let filtered = services

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service =>
        service.code.toLowerCase().includes(query) ||
        service.name.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'viskas') {
      filtered = filtered.filter(service => service.status === statusFilter)
    }

    return filtered
  }, [services, searchQuery, statusFilter])

  // Currency helpers
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

  // Calculate total price including VAT
  function calculateTotalPrice(unitPrice, vatRate) {
    const unit = parseEur(unitPrice)
    const vat = parseEur(vatRate)
    const total = unit + (unit * vat / 100)
    return formatEur(total)
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('lt-LT')
    } catch {
      return dateString
    }
  }

  // Get status display info
  function getStatusInfo(status) {
    switch (status) {
      case 'draudigo-patvirtintos':
        return { label: 'Draudiko patvirtintos', color: 'bg-emerald-500' }
      case 'draudiko-nepatvirtintos':
        return { label: 'Draudiko nepatvirtintos', color: 'bg-rose-500' }
      default:
        return { label: 'Nežinoma', color: 'bg-gray-500' }
    }
  }

  return (
    <div>
      <section className="py-6">
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Paslaugų katalogas</h2>
            <div className="mt-6 border-t border-dashed" />
            
            {/* Search and Filter Row */}
            <div className="mt-4 flex flex-col sm:flex-row mb-6 gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ieškoti pagal paslaugos kodą arba pavadinimą..."
                  className="w-full h-10 mt-2"
                  type="search"
                />
              </div>
              <div className="sm:w-64">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-2" selectClassName="h-10">
                  <option value="viskas">Viskas</option>
                  <option value="draudigo-patvirtintos">Draudiko patvirtintos</option>
                  <option value="draudiko-nepatvirtintos">Draudiko nepatvirtintos</option>
                </Select>
              </div>
            </div>

            {/* Legend above table */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-1">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Draudiko patvirtintos</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-500" /> Draudiko nepatvirtintos</div>
            </div>

            {/* Services Table */}
            <div className="overflow-x-auto overflow-y-hidden rounded-lg border">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-600 sticky top-0">
                    <tr>
                      <th className="px-3 py-3 text-left">Kodas</th>
                      <th className="px-3 py-3 text-left">Pavadinimas</th>
                      <th className="px-3 py-3 text-right">Visa kaina (EUR)</th>
                      <th className="px-3 py-3 text-right">PVM tarifas (%)</th>
                      <th className="px-3 py-3 text-right">TLK komp. (EUR)</th>
                      <th className="px-3 py-3 text-center">Galioja nuo</th>
                      <th className="px-3 py-3 text-center">Galioja iki</th>
                      <th className="px-3 py-3 text-center">Būsena</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                        {searchQuery || statusFilter !== 'viskas' 
                          ? 'Pagal paieškos kriterijus paslaugų nerasta'
                          : 'Paslaugų nėra'
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => {
                      const statusInfo = getStatusInfo(service.status)
                      const totalPrice = calculateTotalPrice(service.unitPrice, service.vatRate)
                      
                      return (
                        <tr key={service.id} className="border-t border-gray-200 hover:bg-[var(--brand-light)]">
                          <td className="px-3 py-3 font-mono text-gray-900">{service.code}</td>
                          <td className="px-3 py-3 text-gray-900">{service.name}</td>
                          <td className="px-3 py-3 text-right tabular-nums text-gray-900">{totalPrice}</td>
                          <td className="px-3 py-3 text-right tabular-nums text-gray-900">{service.vatRate}%</td>
                          <td className="px-3 py-3 text-right tabular-nums text-gray-900">{service.tlkCompensation}</td>
                          <td className="px-3 py-3 text-center text-gray-600">{formatDate(service.validFrom)}</td>
                          <td className="px-3 py-3 text-center text-gray-600">{formatDate(service.validTo)}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-block h-3 w-3 rounded-sm ${statusInfo.color}`} />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                </table>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Rodyti {filteredServices.length} iš {services.length} paslaugų
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex gap-3">
                <Button variant="secondary">Importuoti</Button>
                <Button variant="secondary">Spausdinti</Button>
              </div>
              <div className="ml-auto">
                <Button>Nauja paslauga</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}