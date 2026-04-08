import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { createOrder } from '../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiPhone, FiMail, FiMapPin, FiMessageSquare, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { SiWhatsapp } from 'react-icons/si'
import { GiImperialCrown } from 'react-icons/gi'
import { MdQrCode2 } from 'react-icons/md'

const UPI_ID = 'vijaycanteen@upi'
const UPI_NAME = 'Vijay Canteen'
const WHATSAPP_NUMBER = '919876543210' // replace with real number

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', address: '', orderNote: '' })
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)

  const gst = cartTotal * 0.05
  const grandTotal = cartTotal + gst

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handlePlaceOrder = async () => {
    if (!form.customerName.trim()) return toast.error('Please enter your name')
    if (!form.customerPhone.trim() || !/^[6-9]\d{9}$/.test(form.customerPhone.trim())) {
      return toast.error('Please enter a valid 10-digit phone number')
    }
    if (items.length === 0) return toast.error('Your cart is empty')

    setLoading(true)
    try {
      const res = await createOrder({
        ...form,
        items: items.map(i => ({ _id: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        paymentMethod,
      })
      setOrderPlaced(res.data.order)
      clearCart()

      if (paymentMethod === 'UPI') {
        const upiAmount = grandTotal.toFixed(2)
        const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(`Order ${res.data.order.orderNumber}`)}`
        window.location.href = upiLink
        setTimeout(() => {
          // fallback if deep link doesn't fire
        }, 2000)
      } else if (paymentMethod === 'WhatsApp') {
        const msg = `Hi! I'd like to pay for my order *${res.data.order.orderNumber}*.\n\nItems:\n${items.map(i => `• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}`).join('\n')}\n\n*Total: ₹${grandTotal.toFixed(2)}*\n\nName: ${form.customerName}\nPhone: ${form.customerPhone}`
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
        window.open(waLink, '_blank')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Order success screen ──
  if (orderPlaced) {
    return (
      <div className="page-wrapper min-h-screen flex items-center justify-center pt-20 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="premium-card rounded-3xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)' }}
          >
            <FiCheck className="text-dark-900 text-4xl font-bold" strokeWidth={3} />
          </motion.div>

          <GiImperialCrown className="text-gold-500 text-4xl mx-auto mb-3" />
          <h2 className="font-royal text-3xl text-cream-100 mb-2">Order Placed!</h2>
          <p className="text-cream-400 font-sans text-sm mb-5">
            Your order <span className="text-gold-400 font-medium">#{orderPlaced.orderNumber}</span> has been received.
          </p>

          <div className="bg-dark-600 rounded-xl p-4 mb-6 text-sm font-sans space-y-1.5">
            <div className="flex justify-between text-cream-400">
              <span>Total Amount</span>
              <span className="text-gold-400 font-semibold">₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cream-400">
              <span>Payment</span>
              <span className="text-cream-200">{orderPlaced.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-cream-400">
              <span>Status</span>
              <span className="text-yellow-400">Pending Confirmation</span>
            </div>
          </div>

          {orderPlaced.paymentMethod === 'UPI' && (
            <p className="text-xs text-cream-500 font-sans mb-5 bg-dark-600 rounded-xl p-3">
              📱 If UPI did not open automatically, please pay ₹{grandTotal.toFixed(2)} to <span className="text-gold-400">{UPI_ID}</span> and screenshot this screen as proof.
            </p>
          )}

          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold w-full py-3.5 rounded-xl text-sm tracking-wide uppercase"
            >
              Order More ♛
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-wrapper min-h-screen flex items-center justify-center pt-20 text-center px-5">
        <div>
          <p className="text-cream-400 font-sans text-sm mb-5">Your cart is empty. Add items before checkout.</p>
          <Link to="/menu">
            <button className="btn-gold px-8 py-3 rounded-xl text-sm tracking-wide uppercase">Browse Menu</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="py-10">
          <div className="flex items-center gap-3 mb-1">
            <GiImperialCrown className="text-gold-500 text-3xl" />
            <h1 className="font-royal text-4xl lg:text-5xl text-cream-100">Checkout</h1>
          </div>
          <p className="text-cream-500 font-sans text-sm ml-10">Fill in your details to complete the order</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Customer Details */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card rounded-2xl p-6">
              <h3 className="font-elegant text-gold-400 text-xl mb-5 pb-3 border-b border-gold-500/15">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="relative">
                  <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                    <input name="customerName" value={form.customerName} onChange={handleChange}
                      placeholder="Your full name" className="premium-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans" />
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                    <input name="customerPhone" value={form.customerPhone} onChange={handleChange}
                      placeholder="10-digit mobile" maxLength={10} className="premium-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans" />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Email (optional)</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                    <input name="customerEmail" value={form.customerEmail} onChange={handleChange}
                      placeholder="you@example.com" className="premium-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans" />
                  </div>
                </div>
                {/* Address */}
                <div>
                  <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Delivery Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                    <input name="address" value={form.address} onChange={handleChange}
                      placeholder="Your address" className="premium-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans" />
                  </div>
                </div>
              </div>
              {/* Note */}
              <div className="mt-4">
                <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Order Note (optional)</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3.5 top-3.5 text-gold-500/60" size={15} />
                  <textarea name="orderNote" value={form.orderNote} onChange={handleChange} rows={2}
                    placeholder="Any special instructions…"
                    className="premium-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-sans resize-none" />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card rounded-2xl p-6">
              <h3 className="font-elegant text-gold-400 text-xl mb-5 pb-3 border-b border-gold-500/15">
                Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI option */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('UPI')}
                  className={`cursor-pointer rounded-xl p-5 border transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-gold-500 bg-gold-500/8'
                      : 'border-dark-100 hover:border-gold-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MdQrCode2 className="text-gold-500 text-3xl" />
                    <div>
                      <p className="font-elegant text-cream-100 font-medium">UPI Payment</p>
                      <p className="text-xs text-cream-500 font-sans">Pay via UPI app</p>
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                        <FiCheck size={12} className="text-dark-900" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-cream-500 font-sans">Opens your UPI app (PhonePe, GPay, Paytm, etc.) to pay ₹{grandTotal.toFixed(2)}</p>
                </motion.div>

                {/* WhatsApp option */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('WhatsApp')}
                  className={`cursor-pointer rounded-xl p-5 border transition-all ${
                    paymentMethod === 'WhatsApp'
                      ? 'border-green-500 bg-green-500/8'
                      : 'border-dark-100 hover:border-green-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <SiWhatsapp className="text-green-400 text-3xl" />
                    <div>
                      <p className="font-elegant text-cream-100 font-medium">WhatsApp Pay</p>
                      <p className="text-xs text-cream-500 font-sans">Pay via WhatsApp</p>
                    </div>
                    {paymentMethod === 'WhatsApp' && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <FiCheck size={12} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-cream-500 font-sans">Opens WhatsApp chat with your order details & amount for payment confirmation</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Summary + Place Order ── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="premium-card rounded-2xl p-6 sticky top-24"
            >
              <h3 className="font-elegant text-gold-400 text-xl mb-5 pb-3 border-b border-gold-500/15">Order Summary</h3>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cream-200 font-sans truncate">{item.name}</p>
                      <p className="text-xs text-cream-500 font-sans">× {item.quantity}</p>
                    </div>
                    <p className="text-xs text-cream-200 font-sans flex-shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold-500/15 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-cream-400">Subtotal</span>
                  <span className="text-cream-200">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-cream-400">GST (5%)</span>
                  <span className="text-cream-200">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-cream-400">Delivery</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
              </div>

              <div className="border-t border-gold-500/20 pt-4 flex justify-between items-center mb-6">
                <span className="font-elegant text-cream-100 text-lg">Total</span>
                <span className="font-royal text-2xl"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 font-bold ${
                  loading ? 'opacity-60 cursor-not-allowed bg-gold-700 text-dark-900' : 'btn-gold shadow-gold'
                }`}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" /> Processing…</>
                ) : paymentMethod === 'UPI' ? (
                  <><MdQrCode2 size={18} /> Pay via UPI ♛</>
                ) : (
                  <><SiWhatsapp size={18} className="text-green-700" /> Pay via WhatsApp</>
                )}
              </motion.button>

              <Link to="/cart" className="flex items-center justify-center gap-1.5 mt-4 text-xs text-cream-500 hover:text-gold-400 transition-colors font-sans">
                <FiArrowLeft size={13} /> Back to Cart
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
