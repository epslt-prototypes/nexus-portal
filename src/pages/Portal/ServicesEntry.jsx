import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import { FloatingInput, Checkbox } from '../../components/Inputs.jsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { PinGroup } from '../../components/Inputs.jsx'
import { useI18n } from '../../theme/LanguageProvider'

export default function ServicesEntry() {
  const { t } = useI18n()
  const [katalogas, setKatalogas] = useState([])

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
  const schema = useMemo(() => z.object({
    c1: z.string().regex(/^\d{2}$/, '2 skaitmenys'),
    c2: z.string().regex(/^\d{4}$/, '4 skaitmenys'),
    c3: z.string().regex(/^\d{3}$/, '3 skaitmenys'),
    id4: z.string().regex(/^\d{4}$/, '4 skaitmenys'),
  }), [])

  const { register, handleSubmit, formState: { errors }, setFocus, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })
  const [authorized, setAuthorized] = useState(() => {
    try {
      return localStorage.getItem('cardAuthorized') === 'true'
    } catch (e) {
      return false
    }
  })
  const [cardData, setCardData] = useState({
    cardNumber: '944039580000000000',
    personalCode: '47912121010'
  })
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [serviceModalMode, setServiceModalMode] = useState('add')
  const [services, setServices] = useState([
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
    },
  ])
  const [hoveredServiceId, setHoveredServiceId] = useState(null)
  const [balancesModalOpen, setBalancesModalOpen] = useState(false)
  const [serviceForm, setServiceForm] = useState({
    id: '',
    code: '',
    name: '',
    quantity: '1',
    unitPrice: '0,00',
    discountPercent: '0,00',
    tlkCompensation: '0,00',
    diseaseCode: '',
    info: '',
    status: 'pending',
    notCompensated: true,
  })
  const [serviceErrors, setServiceErrors] = useState({ diseaseCode: '' })
  const catalog = useMemo(() => {
    const list = Array.isArray(katalogas) ? katalogas : []
    return list.map((entry, idx) => {
      const code = String(entry.code || '').trim()
      const name = String(entry.name || '').replace(/\s+/g, ' ').trim()
      const unitPrice = String(entry.unitPrice || '0,00').trim()
      const vatRate = String(entry.vatRate || '').trim()
      const tlkCompensation = String(entry.tlkCompensation || '0,00').trim()
      const discountPercent = String(entry.discountPercent || '0,00').trim()
      return {
        id: `cat-${idx}`,
        code,
        name,
        unitPrice,
        vatRate,
        tlkCompensation,
        discountPercent,
        label: `${code} ${name} (${unitPrice} EUR)`
      }
    })
  }, [katalogas])

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchInputRef = useRef(null)
  const searchWrapperRef = useRef(null)
  const diseaseInputRef = useRef(null)

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter(item =>
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q)
    )
  }, [catalog, query])
  useEffect(() => {
    function onDocClick(e) {
      if (!showDropdown) return
      if (!searchWrapperRef.current) return
      if (!searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showDropdown])
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
  const computed = useMemo(() => {
    const quantity = Math.max(parseInt(String(serviceForm.quantity).replace(/\s/g, ''), 10) || 1, 1)
    const unit = parseEur(serviceForm.unitPrice)
    const discountPct = parseEur(serviceForm.discountPercent)
    const discountValuePerUnit = unit * (discountPct / 100)
    const discountValueTotal = discountValuePerUnit * quantity
    const afterDiscountPerUnit = Math.max(unit - discountValuePerUnit, 0)
    const afterDiscountTotal = afterDiscountPerUnit * quantity
    const tlkPerUnit = serviceForm.notCompensated ? 0 : parseEur(serviceForm.tlkCompensation)
    const tlkTotal = tlkPerUnit * quantity
    const finalClientPerUnit = Math.max(afterDiscountPerUnit - tlkPerUnit, 0)
    const finalClientTotal = Math.max(afterDiscountTotal - tlkTotal, 0)
    return {
      quantity,
      discountValuePerUnit,
      discountValueTotal,
      afterDiscountPerUnit,
      afterDiscountTotal,
      tlkPerUnit,
      tlkTotal,
      finalClientPerUnit,
      finalClientTotal,
    }
  }, [serviceForm])
  const group1Ref = useRef(null)
  const group2Ref = useRef(null)
  const group3Ref = useRef(null)
  const idRef = useRef(null)
  const submitRef = useRef(null)

  useMemo(() => {
    setTimeout(() => group1Ref.current?.focusFirst?.(), 0)
  }, [])

  const c1 = watch('c1');
  const c2 = watch('c2');
  const c3 = watch('c3');

  function onInputAdvance(e, next) {
    const { maxLength, value } = e.target
    if (value && value.length >= maxLength && next) setFocus(next)
  }

  const onSubmit = (data) => {
    try {
      localStorage.setItem('cardAuthorized', 'true')
      const completeCardNumber = `9440395800${data.c1}${data.c2}${data.c3}`
      const personalCode = `479121210${data.id4}`
      setCardData({
        cardNumber: completeCardNumber,
        personalCode: personalCode
      })
    } catch (e) { /* no-op */ }
    setAuthorized(true)
  }

  function handleLogout() {
    try {
      localStorage.removeItem('cardAuthorized')
    } catch (e) { /* no-op */ }
    setAuthorized(false)
    setTimeout(() => group1Ref.current?.focusFirst?.(), 0)
  }

  function openAddService() {
    setServiceForm({
      id: '',
      code: '',
      name: '',
      quantity: '1',
      unitPrice: '0,00',
      discountPercent: '0,00',
      tlkCompensation: '0,00',
      diseaseCode: '',
      info: '',
      status: 'pending',
      notCompensated: true,
    })
    setServiceErrors({ diseaseCode: '' })
    setServiceModalMode('add')
    setServiceModalOpen(true)
    setQuery('')
    setShowDropdown(false)
  }

  function openEditService(svc) {
    setServiceForm({
      id: svc.id,
      code: svc.code,
      name: svc.name,
      quantity: svc.quantity,
      unitPrice: svc.unitPrice,
      discountPercent: svc.discountPercent || '0,00',
      tlkCompensation: svc.tlkCompensation || '0,00',
      diseaseCode: svc.diseaseCode,
      info: svc.info,
      status: svc.status || (svc.notCompensated ? 'rejected' : 'pending'),
      notCompensated: !!svc.notCompensated,
    })
    setServiceErrors({ diseaseCode: '' })
    setServiceModalMode('edit')
    setServiceModalOpen(true)
    setQuery(`${svc.code} ${svc.name}`.trim())
    setShowDropdown(false)
  }

  function handleFormChange(field, value) {
    setServiceForm(prev => ({ ...prev, [field]: value }))
    if (field === 'diseaseCode' && value) {
      setServiceErrors(prev => ({ ...prev, diseaseCode: '' }))
    }
  }

  function handleSaveService() {
    if (!serviceForm.diseaseCode || !serviceForm.diseaseCode.trim()) {
      setServiceErrors(prev => ({ ...prev, diseaseCode: 'Privalomas laukelis' }))
      setTimeout(() => diseaseInputRef.current?.focus?.(), 0)
      return
    }
    if (serviceModalMode === 'edit' && serviceForm.id) {
      setServices(prev => prev.map(s => s.id === serviceForm.id ? { ...s, ...serviceForm } : s))
    } else if (serviceModalMode === 'add') {
      const newId = `srv-${Date.now()}`
      setServices(prev => [...prev, { ...serviceForm, id: newId, status: 'pending' }])
    }
    setServiceModalOpen(false)
  }

  function handleRemoveService() {
    if (serviceModalMode === 'edit' && serviceForm.id) {
      setServices(prev => prev.filter(s => s.id !== serviceForm.id))
    }
    setServiceModalOpen(false)
  }

  return (
    <div>
      {!authorized ? (
        <section className="py-6">
          <div className="grid gap-6">
            <Card className="p-8">
              <h2 className="text-center text-2xl font-semibold text-gray-800">{t('insuredService')}</h2>
              <div className="mt-6 border-t border-dashed" />

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 mx-auto max-w-xl">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{t('cardNumber')}</label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono">9440395800</span>
                    <span className="text-gray-400">-</span>
                    <PinGroup ref={group1Ref} length={2} name="c1" setValue={(name, value) => setValue(name, value)} error={errors.c1?.message} onComplete={() => group2Ref.current?.focusFirst?.()} />
                    <span className="text-gray-400">-</span>
                    <PinGroup ref={group2Ref} length={4} name="c2" setValue={(name, value) => setValue(name, value)} error={errors.c2?.message} onComplete={() => group3Ref.current?.focusFirst?.()} />
                    <span className="text-gray-400">-</span>
                    <PinGroup ref={group3Ref} length={3} name="c3" setValue={(name, value) => setValue(name, value)} error={errors.c3?.message} onComplete={() => idRef.current?.focusFirst?.()} />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">{t('personalCodeLast4')}</label>
                  <PinGroup ref={idRef} length={4} name="id4" setValue={(name, value) => setValue(name, value)} error={errors.id4?.message} onComplete={() => submitRef.current?.focus()} />
                  {!errors.id4 && <div className="mt-1 text-xs text-gray-500">{t('enter4digits')}</div>}
                </div>

                <div className="mt-8 flex gap-3">
                  <Button ref={submitRef} type="submit">{t('authorize')}</Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-6">
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-500">{t('cardNumber')}</div>
                  <div className="font-mono">{cardData.cardNumber}</div>
                  <div className="text-gray-500">{t('insurancePeriod')}</div>
                  <div>2019-04-01 – 2029-12-14</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-500">{t('insured')}</div>
                  <div>Tomas Meškutavičius</div>
                  <div className="text-gray-500">{t('personalCode')}</div>
                  <div>{cardData.personalCode}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center">
                <Button variant="secondary" onClick={handleLogout}>{t('logoutCard')}</Button>
                <div className="ml-auto">
                  <Button onClick={() => setBalancesModalOpen(true)}>{t('insuranceBalances')}</Button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> {t('approved')}</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-amber-500" /> {t('pendingApproval')}</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-500" /> {t('insurerNotCompensated')}</div>
              </div>

              <div className="mt-2 overflow-x-auto overflow-y-hidden rounded-lg border">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-right">{t('totalPrice')}</th>
                      <th className="px-3 py-2 text-right">{t('tlkPart')}</th>
                      <th className="px-3 py-2 text-right">{t('discount')}</th>
                      <th className="px-3 py-2 text-right">{t('insurerPays')}</th>
                      <th className="px-3 py-2 text-right">{t('clientPays')}</th>
                      <th className="px-3 py-2 text-right">{t('vatRate')}</th>
                      <th className="px-3 py-2 text-right">{t('amountWithoutVat')}</th>
                      <th className="px-3 py-2 text-left">{t('diseaseCode')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(svc => {
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
                      const statusColor = svc.status === 'approved' ? 'bg-emerald-500' : svc.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                      const statusLabel = svc.status === 'approved' ? 'Patvirtinta' : svc.status === 'pending' ? 'Laukia patvirtinimo' : 'Atmesta'
                      const flaggedRow = svc.status === 'rejected' || svc.notCompensated
                      const isHovered = hoveredServiceId === svc.id
                      const hoverBg = isHovered ? 'bg-[var(--brand-light)]' : 'bg-white'
                      return (
                        <React.Fragment key={svc.id}>
                          <tr
                            key={`${svc.id}-identity`}
                            className={`cursor-pointer ${hoverBg}`}
                            onClick={() => openEditService(svc)}
                            onMouseEnter={() => setHoveredServiceId(svc.id)}
                            onMouseLeave={() => setHoveredServiceId(null)}
                          >
                            <td className="px-3 py-1 text-sm border-t border-l border-r border-gray-200" colSpan={8}>
                              <span className="font-medium">{svc.name}</span>
                              <span className="mx-2 text-gray-400">·</span>
                              <span className="font-mono text-gray-700">{t('code')} {svc.code}</span>
                              <span className="mx-2 text-gray-400">·</span>
                              <span className="text-gray-700">{displayQuantity}</span>
                            </td>
                          </tr>
                          <tr
                            key={`${svc.id}-financials`}
                            className={`cursor-pointer ${hoverBg}`}
                            onClick={() => openEditService(svc)}
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
                            onClick={() => openEditService(svc)}
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
                    <tr className="border-t bg-gray-50 hover:bg-gray-100">
                      <td className="px-3 py-2 text-center" colSpan={8}>
                        <Button size="sm" variant="secondary" onClick={openAddService}>{t('newService')}</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="w-full max-w-sm rounded-lg border p-4">
                  {(() => {
                    const totals = services.reduce((acc, svc) => {
                      const quantity = Math.max(parseInt(String(svc.quantity).replace(/\s/g, ''), 10) || 1, 1)
                      const unit = parseEur(svc.unitPrice)
                      const discountPct = parseEur(svc.discountPercent || '0,00')
                      const discountValPerUnit = unit * (discountPct / 100)
                      const discountValTotal = discountValPerUnit * quantity
                      const afterDiscountPerUnit = Math.max(unit - discountValPerUnit, 0)
                      const afterDiscountTotal = afterDiscountPerUnit * quantity
                      const tlkPerUnit = svc.notCompensated ? 0 : parseEur(svc.tlkCompensation || '0,00')
                      const tlkTotal = tlkPerUnit * quantity
                      const clientTotal = Math.max(afterDiscountTotal - tlkTotal, 0)
                      
                      acc.totalToPay += clientTotal
                      acc.totalCompensated += tlkTotal
                      acc.totalDiscount += discountValTotal
                      return acc
                    }, { totalToPay: 0, totalCompensated: 0, totalDiscount: 0 })
                    
                    return (
                      <>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{t('totalToPay')}</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalToPay)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                          <span>{t('totalCompensated')}</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalCompensated)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                          <span>{t('totalDiscount')}</span>
                          <span className="font-semibold text-gray-900">{formatEur(totals.totalDiscount)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="ml-auto flex gap-3">
                  <Button variant="secondary">{t('viewReceipt')}</Button>
                  <Button>{t('confirmProvision')}</Button>
                </div>
              </div>
              <Modal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} title={serviceModalMode === 'edit' ? t('editService') : t('newService')}>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div ref={searchWrapperRef} className="relative mt-2 w-full">
                    <FloatingInput
                      id="svc-search"
                      ref={searchInputRef}
                      value={query}
                      onFocus={() => setShowDropdown(true)}
                      onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
                      onKeyDown={e => { if (e.key === 'Escape') setShowDropdown(false) }}
                      placeholder=" "
                      label={t('serviceCodeOrName')}
                    />
                    {showDropdown && (
                      <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow">
                        {filteredCatalog.length === 0 ? (
                          <div className="px-3 py-2 text-gray-500">{t('nothingFound')}</div>
                        ) : (
                          filteredCatalog.map(item => (
                            <div
                              key={item.id}
                              className="cursor-pointer px-3 py-2 hover:bg-gray-50"
                              onMouseDown={() => {
                                setServiceForm(prev => ({
                                  ...prev,
                                  code: item.code,
                                  name: item.name,
                                  unitPrice: String(item.unitPrice),
                                  discountPercent: String(item.discountPercent || '0,00'),
                                  tlkCompensation: String(item.tlkCompensation || '0,00')
                                }))
                                setQuery(`${item.code} ${item.name}`)
                                setShowDropdown(false)
                              }}
                            >
                              <div className="font-medium">
                                {item.code} {item.name}
                              </div>
                              <div className="text-xs text-gray-500">{item.unitPrice} EUR{item.vatRate ? ` · PVM ${item.vatRate}%` : ''}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput
                      id="svc-qty"
                      value={serviceForm.quantity}
                      onChange={e => handleFormChange('quantity', e.target.value)}
                      placeholder=" "
                      label={t('quantity')}
                    />
                    <FloatingInput
                      id="svc-discount"
                      value={serviceForm.discountPercent}
                      onChange={e => handleFormChange('discountPercent', e.target.value)}
                      placeholder=" "
                      label={t('discountPct')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-gray-700">{t('unitPriceEur')}</label>
                      <div className="select-none text-sm font-semibold text-gray-900 tabular-nums">{serviceForm.unitPrice}</div>
                    </div>
                    <div>
                      <label className="mb-1 block text-gray-700">{t('discountValueEur')}</label>
                      <div className="select-none text-sm font-semibold text-gray-900 tabular-nums">{formatEur(computed.discountValueTotal)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Checkbox
                      id="tlk"
                      checked={serviceForm.notCompensated === false ? true : false}
                      onChange={e => handleFormChange('notCompensated', !e.target.checked)}
                      label={t('applyTlkComp')}
                    />
                    <FloatingInput
                      id="svc-tlk"
                      value={serviceForm.tlkCompensation}
                      onChange={e => handleFormChange('tlkCompensation', e.target.value)}
                      placeholder=" "
                      label={t('tlkCompEur')}
                    />
                  </div>
                  <FloatingInput
                    id="svc-disease"
                    ref={diseaseInputRef}
                    value={serviceForm.diseaseCode}
                    onChange={e => handleFormChange('diseaseCode', e.target.value)}
                    placeholder=" "
                    label={t('diseaseCode')}
                    error={serviceErrors.diseaseCode}
                    className={serviceErrors.diseaseCode ? 'border-red-300 focus:border-red-500' : ''}
                  />
                  <div>
                    <label className="mb-1 block text-gray-700">{t('priceEur')}</label>
                    <div className="select-none text-base font-bold text-gray-900 tabular-nums">{formatEur(computed.finalClientTotal)}</div>
                  </div>
                </div>
                {serviceModalMode === 'edit' ? (
                  <div className="mt-6 flex items-center">
                    <Button variant="secondary" onClick={handleRemoveService}>{t('remove')}</Button>
                    <div className="ml-auto">
                      <Button onClick={handleSaveService}>{t('save')}</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveService}>{t('add')}</Button>
                  </div>
                )}
              </Modal>

              <Modal
                open={balancesModalOpen}
                onClose={() => setBalancesModalOpen(false)}
                title={t('insuranceBalances')}
                size="4xl"
              >
                <div className="max-h-[70vh] overflow-auto">
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto text-sm">
                      <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Pavadinimas</th>
                          <th className="px-3 py-2 text-right">Kompensacija</th>
                          <th className="px-3 py-2 text-right">Draudimo suma</th>
                          <th className="px-3 py-2 text-right">Limitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Reabilitacija ir sveikatinimo paslaugos</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Reabilitacinis gydymas I</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">137,55</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Profilaktiniai sveikatos patikrinimai</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Vakcinacija</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">81,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Kritinių ligų gydymas</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Kritinių ligų gydymas I</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">97,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Dantų gydymas, burnos higiena, protezavimas</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Dantų gydymas, burnos higiena</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">121,10</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Protezavimas ir implantavimas</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Ortodontinis gydymas</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Kita</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Kritinių ligų draudimas</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">125,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Šeimos planavimas ir nėščiųjų priežiūra</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">205,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Oftalmologija ir optikos prekės</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">29,54</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Optika ir susijusios paslaugos</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Akinių rėmeliai</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Sveikatingumo paslaugos</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">181,74</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Vaistai</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">272,84</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Receptiniai vaistai, medicinos pagalbos priemonės</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">92,84</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Vakcinacija</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">19,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-900">Visos medicinos paslaugos</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Bazinių paslaugų paketas</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Apsauginiai akiniai (Akiniai nuo saulės)</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Papildomas paslaugų paketas</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 pl-6 text-gray-700">Grožio/ higienos prekės</td>
                          <td className="px-3 py-2 text-right tabular-nums">100,00</td>
                          <td className="px-3 py-2 text-right tabular-nums">999,00</td>
                          <td className="px-3 py-2" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" onClick={() => setBalancesModalOpen(false)}>{t('close')}</Button>
                </div>
              </Modal>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}


