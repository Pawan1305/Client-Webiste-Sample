import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiArrowRight, FiShoppingCart } from 'react-icons/fi'
import { GiImperialCrown } from 'react-icons/gi'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="page-wrapper min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-5"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <GiImperialCrown className="text-gold-500/30 text-5xl mx-auto mb-4" />
          <h2 className="font-royal text-4xl text-cream-100 mb-3">Your cart is empty</h2>
          <p className="text-cream-500 font-sans text-sm mb-8">Add some royal flavours to your cart</p>
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-wide uppercase flex items-center gap-2 mx-auto"
            >
              <FiShoppingCart size={16} /> Browse Menu
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const gst = cartTotal * 0.05
  const grandTotal = cartTotal + gst

  return (
    <div className="page-wrapper min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <GiImperialCrown className="text-gold-500 text-3xl" />
            <h1 className="font-royal text-4xl lg:text-5xl text-cream-100">Your Cart</h1>
          </div>
          <p className="text-cream-500 font-sans text-sm ml-10">{items.length} item{items.length > 1 ? 's' : ''} selected</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Item list ── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="premium-card rounded-2xl p-4 flex gap-4 items-center"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-elegant text-cream-100 text-lg truncate">{item.name}</h3>
                    <p className="text-xs text-cream-500 font-sans mt-0.5">{item.category}</p>
                    <p className="font-royal text-lg mt-1"
                      style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gold-500/40 text-gold-500 flex items-center justify-center hover:bg-gold-500/10 transition-colors"
                    >
                      <FiMinus size={13} />
                    </motion.button>
                    <span className="text-cream-100 font-sans font-medium w-6 text-center">{item.quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gold-500/40 text-gold-500 flex items-center justify-center hover:bg-gold-500/10 transition-colors"
                    >
                      <FiPlus size={13} />
                    </motion.button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right ml-2 min-w-[60px]">
                    <p className="text-xs text-cream-500 font-sans">Total</p>
                    <p className="font-elegant text-cream-100 font-medium">₹{item.price * item.quantity}</p>
                  </div>

                  {/* Remove */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400/60 hover:text-red-400 transition-colors ml-1 p-1"
                  >
                    <FiTrash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-cream-500 hover:text-red-400 transition-colors font-sans tracking-wide flex items-center gap-1.5 border border-dark-200 px-4 py-2 rounded-xl hover:border-red-400/30"
              >
                <FiTrash2 size={13} /> Clear Cart
              </button>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="premium-card rounded-2xl p-6 sticky top-24"
            >
              <h3 className="font-elegant text-gold-400 text-xl mb-5 pb-3 border-b border-gold-500/15">
                Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm font-sans">
                    <span className="text-cream-400 truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="text-cream-200 flex-shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold-500/15 pt-4 space-y-2.5">
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
                  <span className="text-green-400 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gold-500/20 mt-4 pt-4 flex justify-between items-center mb-6">
                <span className="font-elegant text-cream-100 text-lg">Grand Total</span>
                <span className="font-royal text-2xl"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/checkout')}
                className="btn-gold w-full py-3.5 rounded-xl text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2 shadow-gold"
              >
                Proceed to Checkout <FiArrowRight size={16} />
              </motion.button>

              <Link to="/menu" className="flex items-center justify-center gap-1.5 mt-4 text-xs text-cream-500 hover:text-gold-400 transition-colors font-sans">
                <FiArrowLeft size={13} /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
