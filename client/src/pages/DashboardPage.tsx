import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, TrendingUp, Users, Zap, FileText, Download, Lock, LogOut, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

interface Metric {
  label: string
  value: string | number
  change: string
}

interface Report {
  name: string
  date: string
  type: string
}

interface ChartPoint {
  month: string
  users: number
  revenue: number
}

interface DashboardData {
  metrics: Metric[]
  is_pro: boolean
  chart_data?: ChartPoint[]
  reports?: Report[]
}

const changeColor = (change: string) =>
  change.startsWith('+') ? 'text-green-600' : 'text-red-500'

const metricIcons = [BarChart3, Users, TrendingUp, Zap, TrendingUp, BarChart3]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [canceledAt, setCanceledAt] = useState<string | null>(null)

  const isPro = user?.subscription_status === 'active'

  useEffect(() => {
    const endpoint = isPro ? '/dashboard/pro' : '/dashboard/free'
    api.get(endpoint)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [isPro])

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setCheckoutLoading(true)
    try {
      const res = await api.post('/subscription/checkout', { plan })
      window.location.href = res.data.url
    } catch {
      setCheckoutLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelConfirm) {
      setCancelConfirm(true)
      return
    }
    setCancelLoading(true)
    try {
      const res = await api.post('/subscription/cancel')
      setCanceledAt(res.data.ends_at ?? 'the end of your billing period')
      setCancelConfirm(false)
    } catch {
      setCancelLoading(false)
      setCancelConfirm(false)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-gray-900">Analytica</span>
          </div>
          <div className="flex items-center gap-3">
            {isPro && <Badge className="bg-indigo-600 text-white"><Crown className="h-3 w-3 mr-1" />Pro</Badge>}
            <span className="text-sm text-gray-600">{user?.name}</span>
            {isPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={cancelLoading}
                className={cancelConfirm ? 'text-red-600 hover:text-red-700' : 'text-gray-500'}
              >
                {cancelLoading ? 'Canceling...' : cancelConfirm ? 'Confirm cancel?' : 'Cancel plan'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Log out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {canceledAt && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
            Your subscription has been canceled. You'll keep Pro access until <strong>{canceledAt}</strong>, after which your account will revert to the free plan.
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isPro ? 'Full analytics — Pro plan' : 'Free plan · 3 metrics included'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(isPro ? 6 : 3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 h-24 bg-gray-100 rounded-lg" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {data?.metrics.map((metric, i) => {
                const Icon = metricIcons[i] ?? BarChart3
                return (
                  <Card key={metric.label} className="border-gray-100">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{metric.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                          <p className={`text-xs mt-1 font-medium ${changeColor(metric.change)}`}>{metric.change} this month</p>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pro: Charts */}
            {isPro && data?.chart_data && (
              <Card className="mb-8 border-gray-100">
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Revenue & Users — Last 4 Months</h2>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-100">
                          <th className="text-left pb-2">Month</th>
                          <th className="text-right pb-2">Users</th>
                          <th className="text-right pb-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.chart_data.map((row) => (
                          <tr key={row.month} className="border-b border-gray-50">
                            <td className="py-3 font-medium text-gray-700">{row.month}</td>
                            <td className="py-3 text-right text-gray-600">{row.users.toLocaleString()}</td>
                            <td className="py-3 text-right text-green-600 font-medium">${row.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pro: Reports */}
            {isPro && data?.reports && (
              <Card className="mb-8 border-gray-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Reports</h2>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" /> Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.reports.map((report) => (
                      <div key={report.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{report.name}</p>
                            <p className="text-xs text-gray-400">{report.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Free: Upgrade prompt */}
            {!isPro && (
              <Card className="border-indigo-200 bg-indigo-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Unlock the full picture</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upgrade to Pro for 6 metrics, 90-day history, revenue charts, and CSV exports.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => handleUpgrade('monthly')} disabled={checkoutLoading}>
                          {checkoutLoading ? 'Loading...' : 'Upgrade for $9.99/mo'}
                        </Button>
                        <Button variant="outline" onClick={() => handleUpgrade('annual')} disabled={checkoutLoading}>
                          Annual — $99/yr (save 17%)
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
