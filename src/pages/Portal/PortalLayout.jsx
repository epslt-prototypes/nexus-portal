import Card from '../../components/Card.jsx'
import { Outlet } from 'react-router-dom'
import { useI18n } from '../../theme/LanguageProvider'

export default function PortalLayout() {
  const { t } = useI18n()
  return (
    <div className="h-full">
      <section className="h-full">
        <div className="h-full">
          <Card className="h-full rounded-none p-0">
            <div className="flex h-full flex-col">
              <div className="px-6">
                {/* Child pages should render their own titles */}
              </div>
              <div className="flex-1 min-h-0">
                <div className="h-full overflow-auto">
                  <Outlet />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}


