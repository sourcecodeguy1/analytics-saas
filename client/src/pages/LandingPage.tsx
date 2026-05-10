import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, BarChart3, TrendingUp, FileText, Download, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const features = [
  { icon: BarChart3, title: 'Real-time Metrics', description: 'Monitor key performance indicators as they happen.' },
  { icon: TrendingUp, title: 'Growth Trends', description: 'Visualize month-over-month growth with beautiful charts.' },
  { icon: FileText, title: 'Custom Reports', description: 'Generate and download detailed reports on demand.' },
  { icon: Download, title: 'CSV Exports', description: 'Export any dataset to CSV for further analysis.' },
  { icon: Zap, title: '90-Day History', description: 'Access up to 90 days of historical data at a glance.' },
  { icon: BarChart3, title: 'Conversion Tracking', description: 'Track user conversion funnels end-to-end.' },
]

const plans = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    description: 'Great for exploring the platform.',
    features: ['3 core KPI metrics', '7-day data history', 'Basic dashboard', 'Email support'],
    cta: 'Get started free',
    highlight: false,
    plan: null,
  },
  {
    name: 'Pro',
    price: { monthly: '$9.99/mo', annual: '$99/yr' },
    description: 'Everything you need to grow.',
    badge: 'Most Popular',
    features: ['6 full metrics', '90-day data history', 'Advanced charts', 'CSV exports', 'Unlimited reports', 'Priority support'],
    cta: 'Start Pro',
    highlight: true,
    plan: 'monthly',
  },
]

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <span className="font-semibold text-gray-900 text-lg">Analytica</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
          <Button onClick={() => navigate('/register')}>Get started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200">Analytics made simple</Badge>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Understand your data,<br />grow your business
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Analytica gives you real-time dashboards, trend analysis, and exportable reports — all in one clean interface.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/register')}>Start for free</Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')}>View demo</Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to make better decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-gray-100">
                <CardContent className="pt-6">
                  <f.icon className="h-8 w-8 text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-gray-500 mb-8">Start free. Upgrade when you're ready.</p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billing === 'annual' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annual <span className="text-green-600 font-semibold ml-1">Save 17%</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.highlight ? 'border-indigo-500 border-2 shadow-lg' : 'border-gray-200'}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white">{plan.badge}</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <span className="text-2xl font-bold text-gray-900">{plan.price[billing]}</span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? 'default' : 'outline'}
                    onClick={() => navigate(plan.plan ? `/register?plan=${billing}` : '/register')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Analytica. Built as a portfolio demo.
      </footer>
    </div>
  )
}
