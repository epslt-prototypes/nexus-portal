import { useMemo, useState } from 'react'
import { RadioGroup, NumberInput } from '../../components/Inputs'

export default function Troubleshoot() {
  const [tlkUsed, setTlkUsed] = useState('no') // yes | no
  const [atcExists, setAtcExists] = useState('no') // yes | no
  const [parentMapped, setParentMapped] = useState('no') // yes | no (only if ATC does not exist)
  const [mappingTarget, setMappingTarget] = useState('subrisk') // subrisk | parent_risk (only if ATC exists or parent is mapped)
  const [subriskBalance, setSubriskBalance] = useState('') // numeric, only when mappingTarget === 'subrisk'

  const result = useMemo(() => {
    const steps = []

    steps.push(`TLK used: ${tlkUsed}`)
    steps.push(`ATC exists: ${atcExists}`)

    let decision = '—'

    // If ATC does not exist, check whether parent exists and is mapped
    if (atcExists === 'no') {
      steps.push(`ATC parent exists and mapped: ${parentMapped}`)
      if (parentMapped === 'no') {
        decision = 'No compensation'
        return { steps, decision }
      }
    }

    // If we are here, either ATC exists or parent is mapped to something
    steps.push(`Mapping target: ${mappingTarget}`)

    if (mappingTarget === 'parent_risk') {
      decision = 'Compensate from risk'
      return { steps, decision }
    }

    // mappingTarget === 'subrisk'
    const balanceNum = Number(subriskBalance)
    const hasBalance = subriskBalance !== '' && !Number.isNaN(balanceNum) && balanceNum > 0
    steps.push(`Subrisk balance: ${subriskBalance || 'n/a'}`)

    if (hasBalance) {
      decision = 'Compensate from subrizika'
    } else {
      decision = 'Compensate from risk'
    }

    return { steps, decision }
  }, [tlkUsed, atcExists, parentMapped, mappingTarget, subriskBalance])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Compensation Troubleshooter</h1>
        <p className="text-sm text-gray-600">Provide minimal inputs to see decision and trace.</p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border bg-white p-4">
          <RadioGroup
            name="tlkUsed"
            value={tlkUsed}
            onChange={(e) => setTlkUsed(e.target.value)}
            label="1. TLK used?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        <div className="rounded-lg border bg-white p-4">
          <RadioGroup
            name="atcExists"
            value={atcExists}
            onChange={(e) => setAtcExists(e.target.value)}
            label="2. ATC code exists?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {atcExists === 'no' && (
          <div className="rounded-lg border bg-white p-4">
            <RadioGroup
              name="parentMapped"
              value={parentMapped}
              onChange={(e) => setParentMapped(e.target.value)}
              label="3. ATC parent exists and is mapped?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
            />
          </div>
        )}

        {(atcExists === 'yes' || parentMapped === 'yes') && (
          <div className="rounded-lg border bg-white p-4">
            <RadioGroup
              name="mappingTarget"
              value={mappingTarget}
              onChange={(e) => setMappingTarget(e.target.value)}
              label="4. Mapping target"
              options={[
                { value: 'subrisk', label: 'Subrisk' },
                { value: 'parent_risk', label: 'Parent risk' }
              ]}
            />
          </div>
        )}

        {(atcExists === 'yes' || parentMapped === 'yes') && mappingTarget === 'subrisk' && (
          <div className="rounded-lg border bg-white p-4">
            <NumberInput
              value={subriskBalance}
              onChange={(e) => setSubriskBalance(e.target.value)}
              placeholder="e.g. 10"
              label="5. Subrisk limit balance"
              min="0"
              step="1"
              className="w-40"
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm font-medium">Decision</div>
        <div className="rounded-md bg-gray-50 p-3 text-sm">{result.decision}</div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm font-medium">Trace</div>
        <ol className="list-decimal space-y-1 pl-6 text-sm text-gray-700">
          {result.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}


