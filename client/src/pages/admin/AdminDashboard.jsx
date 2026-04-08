import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../../context/AdminAuthContext'
import {
  fetchItems, createItem, updateItem, deleteItem, updateStock,
  fetchOrders, updateOrderStatus, fetchDashboardStats
} from '../../utils/api'
import toast from 'react-hot-toast'
import {
  FiLogOut, FiPlus, FiEdit2, FiTrash2, FiPackage, FiShoppingBag,
  FiTrendingUp, FiAlertCircle, FiChevronDown, FiX, FiCheck, FiRefreshCw
} from 'react-icons/fi'
import { GiImperialCrown } from 'react-icons/gi'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']
const ORDER_STATUSES = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled']

const EMPTY_ITEM = {
  name: '', description: '', price: '', category: 'Specials',
  image: '', stock: '', isVeg: true, isFeatured: false, prepTime: '20-30 min', tags: ''
}

// ── Stat Card ──
const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="premium-card rounded-2xl p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-cream-500 font-sans tracking-wide uppercase mb-1">{label}</p>
        <p className="font-royal text-3xl" style={{ color }}>{value ?? '—'}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </motion.div>
)

// ── Item Form Modal ──
const ItemFormModal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item ? {
    ...item, tags: (item.tags || []).join(', ')
  } : EMPTY_ITEM)
  const [saving, setSaving] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock) return toast.error('Fill required fields')
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] }
      if (item?._id) await updateItem(item._id, payload)
      else await createItem(payload)
      onSave()
      onClose()
      toast.success(item ? 'Item updated!' : 'Item created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-card rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-elegant text-gold-400 text-xl">{item ? 'Edit Item' : 'Add New Item'}</h3>
          <button onClick={onClose} className="text-cream-500 hover:text-cream-100 transition-colors"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-cream-500 font-sans mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="Dish name" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-cream-500 font-sans mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} required
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans resize-none" placeholder="Describe the dish" />
            </div>
            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1">Price (₹) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1">Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0"
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1">Prep Time</label>
              <input name="prepTime" value={form.prepTime} onChange={handleChange}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="20-30 min" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-cream-500 font-sans mb-1">Image URL</label>
              <input name="image" value={form.image} onChange={handleChange}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-cream-500 font-sans mb-1">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-sm font-sans" placeholder="spicy, popular, must-try" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="accent-green-500" />
                <span className="text-xs text-cream-400 font-sans">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-gold-500" />
                <span className="text-xs text-cream-400 font-sans">Featured</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline-gold flex-1 py-2.5 rounded-xl text-sm font-sans">Cancel</button>
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-sans flex items-center justify-center gap-2"
            >
              {saving ? <><div className="w-3.5 h-3.5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />Saving…</> : <><FiCheck size={14} /> Save</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Main Dashboard ──
const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('items')
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [itemModal, setItemModal] = useState(null) // null=closed, {} = new, item = edit
  const [stockEdit, setStockEdit] = useState({}) // id: value map

  const loadItems = useCallback(async () => {
    setLoading(true)
    try { const r = await fetchItems({}); setItems(r.data.items) }
    catch { toast.error('Failed to load items') }
    finally { setLoading(false) }
  }, [])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try { const r = await fetchOrders({}); setOrders(r.data.orders) }
    catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }, [])

  const loadStats = useCallback(async () => {
    try { const r = await fetchDashboardStats(); setStats(r.data.stats) }
    catch { /* silent */ }
  }, [])

  useEffect(() => {
    loadStats()
    if (tab === 'items') loadItems()
    if (tab === 'orders') loadOrders()
  }, [tab, loadItems, loadOrders, loadStats])

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await deleteItem(id)
      toast.success('Item deleted')
      loadItems()
      loadStats()
    } catch { toast.error('Delete failed') }
  }

  const handleStockUpdate = async (id) => {
    const val = Number(stockEdit[id])
    if (isNaN(val) || val < 0) return toast.error('Invalid stock value')
    try {
      await updateStock(id, val)
      toast.success('Stock updated!')
      loadItems()
      loadStats()
      setStockEdit(s => { const n = { ...s }; delete n[id]; return n })
    } catch { toast.error('Stock update failed') }
  }

  const handleOrderStatus = async (id, orderStatus) => {
    try {
      await updateOrderStatus(id, { orderStatus })
      toast.success('Status updated')
      loadOrders()
      loadStats()
    } catch { toast.error('Update failed') }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const STATUS_COLORS = {
    Placed: '#C9A84C', Confirmed: '#3B82F6', Preparing: '#F59E0B',
    Ready: '#10B981', Delivered: '#6B7280', Cancelled: '#EF4444',
  }

  return (
    <div className="min-h-screen bg-dark-900 text-cream-100">

      {/* ── Topbar ── */}
      <div className="glass-dark border-b border-gold-500/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GiImperialCrown className="text-gold-500 text-2xl" />
            <span className="font-royal text-lg" style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-cream-500 font-sans">
              Welcome, <span className="text-gold-400">{admin?.username}</span>
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-sans flex items-center gap-1.5"
            >
              <FiLogOut size={14} /> Logout
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* ── Stats ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Items" value={stats.totalItems} icon={FiPackage} color="#C9A84C" />
            <StatCard label="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} color="#3B82F6" />
            <StatCard label="Today's Orders" value={stats.todayOrders} icon={FiTrendingUp} color="#10B981" />
            <StatCard label="Pending" value={stats.pendingOrders} icon={FiAlertCircle} color="#F59E0B" />
            <StatCard label="Revenue" value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`} icon={FiTrendingUp} color="#C9A84C" />
            <StatCard label="Low Stock" value={stats.lowStockItems} icon={FiAlertCircle} color="#EF4444" />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'items', label: '🍽️ Items' },
            { id: 'orders', label: '📦 Orders' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-sans transition-all ${
                tab === t.id ? 'btn-gold shadow-gold' : 'btn-outline-gold'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => { if (tab === 'items') loadItems(); else loadOrders(); loadStats() }}
            className="ml-auto btn-outline-gold p-2.5 rounded-xl"
            title="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>

        {/* ══════ ITEMS TAB ══════ */}
        {tab === 'items' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-elegant text-cream-100 text-2xl">Menu Items</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setItemModal({})}
                className="btn-gold px-5 py-2.5 rounded-xl text-sm font-sans flex items-center gap-2"
              >
                <FiPlus size={15} /> Add Item
              </motion.button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="premium-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-gold-500/10">
                        {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Update Stock', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs text-gold-500 tracking-wide uppercase font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {items.map((item, i) => (
                          <motion.tr
                            key={item._id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-dark-400/50 hover:bg-dark-600/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <img src={item.image} alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' }} />
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-cream-100 font-medium">{item.name}</p>
                              <p className="text-xs text-cream-500">{item.isVeg ? '🟢 Veg' : '🔴 Non-veg'}{item.isFeatured ? ' ⭐' : ''}</p>
                            </td>
                            <td className="px-4 py-3 text-cream-400">{item.category}</td>
                            <td className="px-4 py-3 text-gold-400 font-medium">₹{item.price}</td>
                            <td className="px-4 py-3">
                              <span className={`font-medium ${item.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                                {item.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                {item.isAvailable ? 'Available' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={stockEdit[item._id] ?? ''}
                                  onChange={e => setStockEdit(s => ({ ...s, [item._id]: e.target.value }))}
                                  placeholder={String(item.stock)}
                                  className="premium-input w-20 px-2 py-1.5 rounded-lg text-xs"
                                />
                                {stockEdit[item._id] !== undefined && (
                                  <button onClick={() => handleStockUpdate(item._id)}
                                    className="btn-gold px-2.5 py-1.5 rounded-lg text-xs">
                                    <FiCheck size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setItemModal(item)}
                                  className="text-gold-500/70 hover:text-gold-400 transition-colors p-1.5 rounded-lg hover:bg-gold-500/10">
                                  <FiEdit2 size={14} />
                                </button>
                                <button onClick={() => handleDeleteItem(item._id, item.name)}
                                  className="text-red-400/60 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                  {items.length === 0 && !loading && (
                    <div className="text-center py-12 text-cream-500 font-sans text-sm">
                      No items yet. Click "Add Item" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════ ORDERS TAB ══════ */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-elegant text-cream-100 text-2xl">Orders</h2>
              <span className="text-xs text-cream-500 font-sans">{orders.length} total</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {orders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="premium-card rounded-2xl p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-elegant text-gold-400 text-lg">{order.orderNumber}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-sans"
                              style={{ background: `${STATUS_COLORS[order.orderStatus]}20`, color: STATUS_COLORS[order.orderStatus], border: `1px solid ${STATUS_COLORS[order.orderStatus]}40` }}>
                              {order.orderStatus}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${order.paymentStatus === 'Completed' ? 'bg-green-500/15 text-green-400' : order.paymentStatus === 'Failed' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                              Payment: {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-sm text-cream-200 font-sans font-medium">{order.customerName}</p>
                          <p className="text-xs text-cream-500 font-sans">{order.customerPhone} {order.paymentMethod && `· ${order.paymentMethod}`}</p>
                          <p className="text-xs text-cream-500 font-sans mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-royal text-2xl" style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            ₹{order.totalAmount?.toFixed(2)}
                          </p>
                          <p className="text-xs text-cream-500 font-sans">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items?.map((it, j) => (
                          <span key={j} className="text-xs bg-dark-400 text-cream-400 px-2.5 py-1 rounded-lg font-sans">
                            {it.name} × {it.quantity}
                          </span>
                        ))}
                      </div>

                      {/* Status controls */}
                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-cream-500 font-sans mr-1">Update status:</span>
                        {ORDER_STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => handleOrderStatus(order._id, s)}
                            disabled={order.orderStatus === s}
                            className={`text-xs px-3 py-1.5 rounded-xl font-sans transition-all ${
                              order.orderStatus === s
                                ? 'opacity-40 cursor-default'
                                : 'hover:opacity-80'
                            }`}
                            style={{
                              background: `${STATUS_COLORS[s]}20`,
                              color: STATUS_COLORS[s],
                              border: `1px solid ${STATUS_COLORS[s]}40`
                            }}
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          onClick={() => handleOrderStatus(order._id, order.orderStatus) || updateOrderStatus(order._id, { paymentStatus: 'Completed' }).then(() => { toast.success('Payment marked complete'); loadOrders() })}
                          className="text-xs px-3 py-1.5 rounded-xl bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-colors font-sans"
                        >
                          ✓ Mark Paid
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {orders.length === 0 && !loading && (
                  <div className="text-center py-12 text-cream-500 font-sans text-sm premium-card rounded-2xl">
                    No orders yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Item Form Modal ── */}
      <AnimatePresence>
        {itemModal !== null && (
          <ItemFormModal
            item={itemModal?._id ? itemModal : null}
            onClose={() => setItemModal(null)}
            onSave={() => { loadItems(); loadStats() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard
