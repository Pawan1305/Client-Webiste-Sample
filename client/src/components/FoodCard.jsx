import React from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { FiPlus, FiStar } from 'react-icons/fi'
import { BiLeaf } from 'react-icons/bi'
import { MdOutdoorGrill } from 'react-icons/md'

const FoodCard = ({ item }) => {
  const { addToCart, items } = useCart()
  const inCart = items.find(i => i._id === item._id)

  const handleAdd = (e) => {
    e.stopPropagation()
    if (item.stock > 0 && item.isAvailable) addToCart(item)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="premium-card rounded-2xl overflow-hidden flex flex-col group cursor-default"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transition: 'transform 0.7s ease' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {item.isVeg ? (
            <span className="badge-veg" title="Vegetarian" />
          ) : (
            <span className="badge-nonveg" title="Non-Vegetarian" />
          )}
          {item.isFeatured && (
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', color: '#050505' }}>
              Chef's Pick
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {(!item.isAvailable || item.stock === 0) && (
          <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
            <span className="text-cream-400 text-sm font-sans tracking-widest uppercase border border-cream-400/40 px-4 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full glass-dark text-gold-400 border border-gold-500/20 font-sans">
            {item.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-elegant text-cream-100 text-lg leading-tight group-hover:text-gold-400 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <FiStar className="text-gold-400 fill-gold-400" size={13} />
            <span className="text-gold-400 text-xs font-sans">{item.rating?.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-cream-400 leading-relaxed mb-3 line-clamp-2">{item.description}</p>

        {/* Prep time + stock */}
        <div className="flex items-center gap-3 mb-3 text-xs text-cream-500 font-sans">
          <span>⏱ {item.prepTime}</span>
          <span className={`${item.stock < 5 ? 'text-red-400' : 'text-green-500'}`}>
            {item.stock > 0 ? `${item.stock} left` : 'Unavailable'}
          </span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-cream-500 font-sans">Price</span>
            <p className="font-royal text-xl font-semibold"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ₹{item.price}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={!item.isAvailable || item.stock === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans font-semibold tracking-wide transition-all ${
              !item.isAvailable || item.stock === 0
                ? 'opacity-40 cursor-not-allowed bg-dark-400 text-cream-500 border border-dark-200'
                : inCart
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50 hover:bg-gold-500/30'
                : 'btn-gold'
            }`}
          >
            <FiPlus size={14} />
            {inCart ? `In Cart (${inCart.quantity})` : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard
