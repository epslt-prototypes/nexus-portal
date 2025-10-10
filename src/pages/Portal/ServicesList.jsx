import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { Select, Input, TableInput } from '../../components/Inputs.jsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../../theme/LanguageProvider'
import { usePageTitle } from '../../theme/PageTitleProvider'
import { Upload, Download, Plus, CheckCircle, Clock, Rows2, Rows3, Edit2, Check, X } from 'lucide-react'

// Status chip component
const StatusChip = ({ status, label }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'insurer-approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'insurer-not-approved':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'insurer-approved':
        return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
      case 'insurer-not-approved':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />
      default:
        return null
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {getStatusIcon(status)}
      {label}
    </span>
  )
}

// Editable field component
const EditableField = ({ 
  value, 
  onSave, 
  type = 'text', 
  className = '', 
  placeholder = '',
  align = 'left',
  formatValue = (val) => val,
  parseValue = (val) => val,
  isCompactView = false,
  controlsOnLeft = false,
  // single-edit mode controls
  cellId,
  editingCellId,
  setEditingCellId,
  // numeric constraints
  isNumeric = false,
}) => {
  const [editValue, setEditValue] = useState(value)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const isEditing = editingCellId === cellId
  const [invalid, setInvalid] = useState(false)
  const [shakeTick, setShakeTick] = useState(0)

  const handleClick = () => {
    if (!isEditing) {
      setEditingCellId(cellId)
    }
  }

  const handleSave = () => {
    // Validate numeric fields
    if (isNumeric) {
      const s = String(editValue).trim()
      const separators = (s.match(/[.,]/g) || []).length
      const validChars = /^\d*(?:[.,]?\d*)$/.test(s)
      const notEmptyNumber = s !== '' && !/^[.,]+$/.test(s)
      if (!(validChars && separators <= 1 && notEmptyNumber)) {
        setInvalid(true)
        setShakeTick((n) => n + 1)
        return
      }
    }
    onSave(parseValue(editValue))
    setEditingCellId(null)
  }

  const handleCancel = () => {
    setEditValue(value)
    setEditingCellId(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Sync current value when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditValue(value)
      setInvalid(false)
      // If numeric, select all contents upon entering edit mode
      if (isNumeric) {
        setTimeout(() => {
          try {
            if (inputRef.current) inputRef.current.select()
          } catch {}
        }, 0)
      }
    }
  }, [isEditing, value])

  // Cancel when clicking outside the cell while editing
  useEffect(() => {
    if (!isEditing) return
    function onDocMouseDown(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) {
        handleCancel()
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [isEditing])

  const textAlignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
  // While editing date fields, align container to the right so the input hugs the right edge
  const effectiveAlignClass = isEditing && type === 'date' ? 'text-right' : textAlignClass
  // Use CSS variables for density so compact/comfort can be controlled centrally
  const paddingClass = 'px-[var(--cell-px)] py-[var(--cell-py)]'

  return (
    <div
      ref={containerRef}
      className={`relative group ${paddingClass} ${className} ${isEditing ? 'cursor-text' : 'cursor-pointer'}`}
      style={isEditing ? { '--cell-py': 'calc(var(--cell-py) - 1px)' } : undefined}
      onClick={handleClick}
      role="button"
    >
      {/* Content area */}
      {isEditing ? (
        <div className={`${effectiveAlignClass}`}>
          <TableInput
            ref={inputRef}
            type={type}
            key={shakeTick}
            value={editValue}
            onChange={(e) => {
              const raw = e.target.value
              const next = isNumeric ? raw.replace(/[^0-9.,]/g, '') : raw
              setEditValue(next)
              if (invalid) setInvalid(false)
            }}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              if (isNumeric) {
                try { e.target.select() } catch {}
              }
            }}
            className={`${type === 'date' ? 'w-[14ch] text-right' : 'w-full'} ${type === 'date' ? '' : textAlignClass} ${invalid ? 'ring-1 ring-red-300 focus:ring-red-400 text-red-700' : ''}`}
            placeholder={placeholder}
            autoFocus
            style={invalid ? { animation: 'shake 120ms ease-in-out 0s 2' } : undefined}
          />
        </div>
      ) : (
        <div className={`${textAlignClass}`}>
          <span className="block truncate">{formatValue(value)}</span>
        </div>
      )}

      {/* Right controls - always present to avoid layout shifts */}
      <div className={`absolute ${controlsOnLeft ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 flex items-center gap-1 z-10`}>
        {!isEditing ? (
          <button
            onClick={handleClick}
            className={`${controlsOnLeft ? '' : ''} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto text-gray-400 hover:text-gray-600`}
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        ) : (
          <>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
              className="p-0.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
              title="Save"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
              className="px-0.5 py-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Empty state component
const EmptyState = ({ isFiltered, onClearFilters }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {isFiltered ? 'No services match your filters' : 'No services available'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
      {isFiltered 
        ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
        : 'Services will appear here once they are added to the catalog.'
      }
    </p>
    {isFiltered && (
      <Button variant="secondary" onClick={onClearFilters} className="text-sm">
        Clear filters
      </Button>
    )}
  </div>
)

export default function ServicesList() {
  const { t, lang } = useI18n()
  const { setTitle } = usePageTitle()
  useEffect(() => {
    setTitle(t('servicesCatalogTitle'))
    return () => setTitle('')
  }, [t, setTitle])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'insurer-approved' | 'insurer-not-approved'
  const [katalogas, setKatalogas] = useState([])
  const [isCompactView, setIsCompactView] = useState(false)
  const [editableServices, setEditableServices] = useState([])
  const [editingCellId, setEditingCellId] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/mock/katalogas.json')
        const data = await res.json()
        setKatalogas(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Failed to load katalogas mock:', e)
        setKatalogas([])
      }
    }
    load()
  }, [])

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
      const status = tlkValue > 0 ? 'insurer-approved' : 'insurer-not-approved'
      
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
  }, [katalogas])

  // Update editableServices when services change
  useEffect(() => {
    setEditableServices(services)
  }, [services])

  // Update service field
  const updateServiceField = (serviceId, field, value) => {
    setEditableServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, [field]: value }
          : service
      )
    )
  }

  // Filter services based on search query and status filter
  const filteredServices = useMemo(() => {
    let filtered = editableServices

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service =>
        service.code.toLowerCase().includes(query) ||
        service.name.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter)
    }

    return filtered
  }, [editableServices, searchQuery, statusFilter])

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

  // Normalizers for inputs
  function normalizeAmountInput(input) {
    if (input == null) return '0,00'
    const s = String(input).trim()
    if (!s) return '0,00'
    // Accept both comma and dot as decimal separators, ignore percent sign
    const normalized = s.replace(/%/g, '').replace(/\s/g, '').replace(',', '.')
    const value = Number(normalized)
    if (!isFinite(value)) return '0,00'
    return formatEur(value)
  }

  function normalizePercentInput(input) {
    if (input == null) return '0,00'
    const s = String(input).trim()
    if (!s) return '0,00'
    // Strip percent sign and spaces, accept comma or dot
    const normalized = s.replace(/%/g, '').replace(/\s/g, '').replace(',', '.')
    const value = Number(normalized)
    if (!isFinite(value)) return '0,00'
    // Keep as plain number string with comma separator; caller can add % for display
    return formatEur(value)
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB')
    } catch {
      return dateString
    }
  }

  // Get status display info
  function getStatusInfo(status) {
    switch (status) {
      case 'insurer-approved':
        return { label: 'Approved', status: 'insurer-approved' }
      case 'insurer-not-approved':
        return { label: 'Pending', status: 'insurer-not-approved' }
      default:
        return { label: 'Unknown', status: 'unknown' }
    }
  }

  // Clear filters function
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
  }

  return (
    <div className="h-full bg-gray-50 pt-4">
      <div className="h-full flex flex-col">
        <style>{`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-1px); }
            100% { transform: translateX(0); }
          }
        `}</style>
        {/* Fixed Action Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholderServices')}
                  className="w-full h-10"
                  type="search"
                />
              </div>
              
              {/* Filter Chips */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('insurer-approved')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'insurer-approved'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setStatusFilter('insurer-not-approved')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'insurer-not-approved'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="secondary" size="md">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="md">
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 bg-white">
          {filteredServices.length === 0 ? (
            <EmptyState 
              isFiltered={searchQuery || statusFilter !== 'all'} 
              onClearFilters={clearFilters}
            />
          ) : (
            <div className="h-full overflow-auto" style={{ '--cell-px': '1rem', '--cell-py': isCompactView ? '0.375rem' : '0.75rem' }}>
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '1%' }} />
                  <col />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '155px' }} />
                  <col style={{ width: '155px' }} />
                  <col style={{ width: '1%' }} />
                </colgroup>
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
                  <tr>
                    {/* Service Info Group */}
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-left font-semibold text-gray-900 bg-blue-50/30 border-r border-gray-200">{t('thCode')}</th>
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-left font-semibold text-gray-900 bg-blue-50/30 border-r border-gray-300">{t('thName')}</th>
                    
                    {/* Financial Data Group */}
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-right font-medium text-gray-600 bg-emerald-50/30 border-r border-gray-200">{t('thTotalPriceEur')}</th>
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-right font-medium text-gray-600 bg-emerald-50/30 border-r border-gray-200">{t('thVatRatePct')}</th>
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-right font-medium text-gray-600 bg-emerald-50/30 border-r border-gray-300">{t('thTlkCompEur')}</th>
                    
                    {/* Validity & Status Group */}
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-center font-medium text-gray-600 bg-amber-50/30 border-r border-gray-200">{t('thValidFrom')}</th>
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-center font-medium text-gray-600 bg-amber-50/30 border-r border-gray-200">{t('thValidTo')}</th>
                    <th className="px-[var(--cell-px)] py-[var(--cell-py)] text-left font-semibold text-gray-900 bg-amber-50/30">{t('thStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredServices.map((service, index) => {
                    const statusInfo = getStatusInfo(service.status)
                    const totalPrice = calculateTotalPrice(service.unitPrice, service.vatRate)
                    const isEven = index % 2 === 0
                    
                    return (
                      <tr 
                        key={service.id} 
                        className={`hover:bg-gradient-to-r hover:from-[var(--brand-light)] hover:to-transparent hover:text-[color:var(--brand-primary)] transition-colors ${isEven ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        {/* Service Info Group */}
                        <td className={`min-w-0 whitespace-nowrap font-mono text-sm font-medium text-gray-900 bg-blue-50/20 border-r border-gray-200`}>
                          <EditableField
                            value={service.code}
                            onSave={(value) => updateServiceField(service.id, 'code', value)}
                            className="font-mono"
                            placeholder="Enter service code"
                            isCompactView={isCompactView}
                            cellId={`${service.id}-code`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                          />
                        </td>
                        <td className={`min-w-0 max-w-[40ch] overflow-hidden text-sm font-medium text-gray-900 bg-blue-50/20 border-r border-gray-300`}>
                          <EditableField
                            value={service.name}
                            onSave={(value) => updateServiceField(service.id, 'name', value)}
                            placeholder="Enter service name"
                            isCompactView={isCompactView}
                            cellId={`${service.id}-name`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                          />
                        </td>
                        
                        {/* Financial Data Group */}
                        <td className={`min-w-0 whitespace-nowrap text-right text-sm tabular-nums text-gray-600 bg-emerald-50/20 border-r border-gray-200`}>
                          <EditableField
                            value={service.unitPrice}
                            onSave={(value) => updateServiceField(service.id, 'unitPrice', value)}
                            align="right"
                            className="tabular-nums"
                            placeholder="0,00"
                            formatValue={(val) => normalizeAmountInput(val)}
                            parseValue={(val) => normalizeAmountInput(val)}
                            isCompactView={isCompactView}
                            controlsOnLeft={true}
                            cellId={`${service.id}-unitPrice`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                            isNumeric
                          />
                        </td>
                        <td className={`min-w-0 whitespace-nowrap text-right text-sm tabular-nums text-gray-600 bg-emerald-50/20 border-r border-gray-200`}>
                          <EditableField
                            value={service.vatRate}
                            onSave={(value) => updateServiceField(service.id, 'vatRate', value)}
                            align="right"
                            className="tabular-nums"
                            placeholder="0,00"
                            formatValue={(val) => `${normalizePercentInput(val)}%`}
                            parseValue={(val) => normalizePercentInput(val)}
                            isCompactView={isCompactView}
                            controlsOnLeft={true}
                            cellId={`${service.id}-vatRate`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                            isNumeric
                          />
                        </td>
                        <td className={`min-w-0 whitespace-nowrap text-right text-sm tabular-nums text-gray-600 bg-emerald-50/20 border-r border-gray-300`}>
                          <EditableField
                            value={service.tlkCompensation}
                            onSave={(value) => updateServiceField(service.id, 'tlkCompensation', value)}
                            align="right"
                            className="tabular-nums"
                            placeholder="0,00"
                            formatValue={(val) => normalizeAmountInput(val)}
                            parseValue={(val) => normalizeAmountInput(val)}
                            isCompactView={isCompactView}
                            controlsOnLeft={true}
                            cellId={`${service.id}-tlkCompensation`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                            isNumeric
                          />
                        </td>
                        
                        {/* Validity & Status Group */}
                        <td className={`min-w-0 whitespace-nowrap text-center text-sm text-gray-500 bg-amber-50/20 border-r border-gray-200`}>
                          <EditableField
                            value={service.validFrom}
                            onSave={(value) => updateServiceField(service.id, 'validFrom', value)}
                            align="center"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            formatValue={(val) => formatDate(val)}
                            parseValue={(val) => val}
                            isCompactView={isCompactView}
                            controlsOnLeft={true}
                            cellId={`${service.id}-validFrom`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                          />
                        </td>
                        <td className={`min-w-0 whitespace-nowrap text-center text-sm text-gray-500 bg-amber-50/20 border-r border-gray-200`}>
                          <EditableField
                            value={service.validTo}
                            onSave={(value) => updateServiceField(service.id, 'validTo', value)}
                            align="center"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            formatValue={(val) => formatDate(val)}
                            parseValue={(val) => val}
                            isCompactView={isCompactView}
                            controlsOnLeft={true}
                            cellId={`${service.id}-validTo`}
                            editingCellId={editingCellId}
                            setEditingCellId={setEditingCellId}
                          />
                        </td>
                        <td className={`whitespace-nowrap px-[var(--cell-px)] py-[var(--cell-py)] bg-amber-50/20`}>
                          <StatusChip status={statusInfo.status} label={statusInfo.label} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredServices.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredServices.length} of {editableServices.length} services
              </div>
              <button
                onClick={() => setIsCompactView(!isCompactView)}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                title={isCompactView ? 'Switch to comfort view' : 'Switch to compact view'}
              >
                {isCompactView ? (
                  <Rows2 className="w-4 h-4 text-gray-600" />
                ) : (
                  <Rows3 className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}