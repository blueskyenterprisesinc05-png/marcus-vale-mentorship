'use client'

import { useEffect, useState, useTransition } from 'react'
import { ArrowUpRight, Check, LogOut, Trash2, X, AlertTriangle, Eye, ShieldAlert, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import {
  updateApplicationStatus,
  addMentorNote,
  deleteApplication,
} from '../actions/application'

// Client-side initialization using public keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

type Application = {
  id: string
  created_at: string
  name: string
  email: string
  experience: string
  market: string
  challenge: string
  process: string
  goal: string
  commitment: string
  status: 'new' | 'reviewing' | 'accepted' | 'declined'
  notes: string | null
  reviewed_at: string | null
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, startLoginTransition] = useTransition()

  const [applications, setApplications] = useState<Application[]>([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [isPending, startActionTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // 1. Auth check
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      
      // Ensure only the correct reviewer is logged in
      if (session?.user && session.user.email === 'blues@example.com') {
        setUser(session.user)
        fetchApplications()
      } else {
        setUser(null)
      }
      setLoadingUser(false)
    }
    checkUser()
  }, [])

  // 2. Fetch applications
  async function fetchApplications() {
    setLoadingApps(true)
    try {
      // Query applications via public client. Wait, since public select is restricted by RLS to authenticated admins,
      // this select will only succeed if the user is logged in!
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      setApplications(data || [])
    } catch (err: any) {
      toast.error('Failed to load applications: ' + err.message)
    } finally {
      setLoadingApps(false)
    }
  }

  // 3. Login handler
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return

    startLoginTransition(async () => {
      try {
        if (email !== 'blues@example.com') {
          toast.error('Access denied: Unauthorized email.')
          return
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        if (data.user) {
          setUser(data.user)
          toast.success('Logged in successfully!')
          fetchApplications()
        }
      } catch (err: any) {
        toast.error('Authentication failed: ' + err.message)
      }
    })
  }

  // 4. Logout handler
  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setApplications([])
    setSelectedApp(null)
    toast.info('Signed out.')
  }

  // 5. Update Status handler
  function handleStatusUpdate(id: string, status: 'new' | 'reviewing' | 'accepted' | 'declined') {
    startActionTransition(async () => {
      const result = await updateApplicationStatus(id, status)
      if (result.success) {
        toast.success(`Status updated to ${status}`)
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        )
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status } : null))
        }
      } else {
        toast.error(result.message)
      }
    })
  }

  // 6. Save Notes handler
  function handleSaveNotes(id: string) {
    startActionTransition(async () => {
      const result = await addMentorNote(id, editingNotes)
      if (result.success) {
        toast.success('Notes saved successfully!')
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, notes: editingNotes } : app))
        )
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, notes: editingNotes } : null))
        }
      } else {
        toast.error(result.message)
      }
    })
  }

  // 7. Delete Application handler
  function handleDelete(id: string) {
    startActionTransition(async () => {
      const result = await deleteApplication(id)
      if (result.success) {
        toast.success('Application deleted.')
        setApplications((prev) => prev.filter((app) => app.id !== id))
        if (selectedApp?.id === id) {
          setSelectedApp(null)
        }
        setShowDeleteConfirm(null)
      } else {
        toast.error(result.message)
      }
    })
  }

  // Filter logic
  const filteredApps = applications.filter((app) =>
    filterStatus === 'all' ? true : app.status === filterStatus
  )

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#111311] flex items-center justify-center text-[#e9e7df]">
        <Loader2 className="animate-spin text-[#c6a06a]" size={36} />
      </div>
    )
  }

  // If not logged in, show premium Login Form
  if (!user) {
    return (
      <div className="min-h-screen bg-[#111311] flex items-center justify-center p-6 text-[#e9e7df]">
        <div className="w-full max-w-md bg-[#191c18] border border-[#343832] p-8 rounded-lg shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#c6a06a] to-[#d6b57f]" />
          <h2 className="text-xl font-bold tracking-tight text-center mb-1">
            MARCUS <span className="text-[#a7aaa1]">VALE</span>
          </h2>
          <p className="text-xs text-[#a7aaa1] text-center mb-8 uppercase tracking-widest font-mono">
            MENTOR REVIEW PORTAL
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#c6a06a] uppercase tracking-wider block">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                className="w-full bg-[#111311] border border-[#343832] rounded p-3 text-sm focus:outline-none focus:border-[#c6a06a] font-mono"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#c6a06a] uppercase tracking-wider block">
                PASSWORD
              </label>
              <input
                type="password"
                required
                className="w-full bg-[#111311] border border-[#343832] rounded p-3 text-sm focus:outline-none focus:border-[#c6a06a] font-mono"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#c6a06a] hover:bg-[#d6b57f] text-[#111311] py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  Verifying Credentials <Loader2 className="animate-spin" size={16} />
                </>
              ) : (
                <>
                  Access Review Portal <ArrowUpRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard layout
  return (
    <div className="min-h-screen bg-[#111311] text-[#e9e7df] p-6 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-b border-[#343832] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            MARCUS <span className="text-[#a7aaa1]">VALE</span>
          </h1>
          <p className="text-[10px] font-mono text-[#c6a06a] uppercase tracking-wider">
            Admin Review Dashboard • {user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchApplications}
            disabled={loadingApps}
            className="px-4 py-2 border border-[#343832] hover:bg-[#191c18] rounded text-xs transition-colors font-mono"
          >
            Refresh List
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/50 rounded text-xs transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Panel */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-1 bg-[#191c18] border border-[#343832] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono">
              Applications ({filteredApps.length})
            </h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#111311] border border-[#343832] rounded text-xs p-1 focus:outline-none focus:border-[#c6a06a] font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {loadingApps ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#c6a06a]" size={28} />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12 text-[#a7aaa1] text-xs font-mono">
              No applications found.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app)
                      setEditingNotes(app.notes || '')
                    }}
                    className={`p-4 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#20251f] border-[#c6a06a]'
                        : 'bg-[#111311] border-[#343832] hover:border-[#a7aaa1]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm truncate max-w-[150px]">{app.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase ${
                          app.status === 'accepted'
                            ? 'bg-green-950/60 text-green-400 border border-green-900/50'
                            : app.status === 'declined'
                            ? 'bg-red-950/60 text-red-400 border border-red-900/50'
                            : app.status === 'reviewing'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-900/50'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#a7aaa1] font-mono flex justify-between">
                      <span>{app.market}</span>
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedApp ? (
            <div className="bg-[#191c18] border border-[#343832] rounded-lg p-6 space-y-6 relative">
              <div className="flex items-center justify-between border-b border-[#343832] pb-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedApp.name}</h2>
                  <p className="text-xs text-[#c6a06a] font-mono">{selectedApp.email}</p>
                </div>
                <div className="text-[10px] text-[#a7aaa1] font-mono text-right">
                  Submitted: {new Date(selectedApp.created_at).toLocaleString()}
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex flex-wrap items-center gap-3 bg-[#111311] p-4 rounded border border-[#343832]">
                <span className="text-xs font-mono text-[#a7aaa1] uppercase">Update Status:</span>
                <div className="flex gap-2">
                  {(['reviewing', 'accepted', 'declined'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedApp.id, status)}
                      disabled={isPending}
                      className={`text-xs px-3 py-1.5 rounded transition-all font-mono uppercase ${
                        selectedApp.status === status
                          ? status === 'accepted'
                            ? 'bg-green-950 text-green-400 border border-green-800'
                            : status === 'declined'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-transparent border border-[#343832] text-[#a7aaa1] hover:text-[#e9e7df] hover:border-[#a7aaa1]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    01 Experience
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60">
                    {selectedApp.experience}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    02 Markets
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60">
                    {selectedApp.market}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    03 Biggest Challenge
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60 whitespace-pre-wrap">
                    {selectedApp.challenge}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    04 Current Process
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60 whitespace-pre-wrap">
                    {selectedApp.process}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    05 Mentorship Goal
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60 whitespace-pre-wrap">
                    {selectedApp.goal}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#c6a06a] uppercase tracking-wider block mb-1">
                    06 Commitment
                  </span>
                  <p className="text-sm bg-[#111311] p-3 rounded border border-[#343832]/60">
                    {selectedApp.commitment}
                  </p>
                </div>
              </div>

              {/* Private Notes */}
              <div className="border-t border-[#343832] pt-6 space-y-3">
                <label className="text-xs font-mono text-[#c6a06a] uppercase tracking-wider block">
                  Private Mentor Notes
                </label>
                <textarea
                  className="w-full bg-[#111311] border border-[#343832] rounded p-3 text-sm focus:outline-none focus:border-[#c6a06a] min-h-[100px]"
                  placeholder="Add private observations, call notes, or follow up ideas..."
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                />
                <button
                  onClick={() => handleSaveNotes(selectedApp.id)}
                  disabled={isPending}
                  className="bg-[#c6a06a] hover:bg-[#d6b57f] text-[#111311] px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2"
                >
                  Save Notes
                </button>
              </div>

              {/* Destructive Actions */}
              <div className="border-t border-red-950/40 pt-6 flex justify-end">
                {showDeleteConfirm === selectedApp.id ? (
                  <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/40 p-3 rounded">
                    <span className="text-xs text-red-400 font-mono flex items-center gap-1">
                      <AlertTriangle size={14} /> Confirm delete?
                    </span>
                    <button
                      onClick={() => handleDelete(selectedApp.id)}
                      className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1 border border-[#343832] hover:bg-[#111311] rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(selectedApp.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-900/50 hover:bg-red-950/20 text-red-400 rounded text-xs transition-colors font-mono uppercase"
                  >
                    <Trash2 size={14} /> Delete Application
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#191c18] border border-[#343832] rounded-lg p-12 text-center text-[#a7aaa1] flex flex-col items-center justify-center min-h-[400px]">
              <Eye size={48} className="mb-4 text-[#343832]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider font-mono mb-1">
                Select an Application
              </h3>
              <p className="text-xs">Choose an applicant from the sidebar to review answers, update status, and add notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
