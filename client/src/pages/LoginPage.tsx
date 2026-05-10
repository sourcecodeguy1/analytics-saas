import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const loginAsDemo = async () => {
    setLoading(true)
    try {
      await login('free@demo.com', 'password')
      navigate('/dashboard')
    } catch {
      setError('Demo account unavailable.')
    } finally {
      setLoading(false)
    }
  }

  const loginAsPro = async () => {
    setLoading(true)
    try {
      await login('pro@demo.com', 'password')
      navigate('/dashboard')
    } catch {
      setError('Demo account unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BarChart3 className="h-7 w-7 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">Analytica</span>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">or try a demo</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={loginAsDemo} disabled={loading} className="text-xs">
                Free Demo
              </Button>
              <Button variant="outline" onClick={loginAsPro} disabled={loading} className="text-xs text-indigo-600 border-indigo-300">
                Pro Demo
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline font-medium">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
