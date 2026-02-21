import { useState } from 'react'
import { MENU_OPTIONS } from '../data/menu'
import './MenuCard.css'

export default function MenuCard({ item, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState({})
  const [imageError, setImageError] = useState(false)
  const optionsList = item.options && item.options.length > 0 ? item.options : MENU_OPTIONS
  const soldOut = item.stock != null && item.stock <= 0

  const handleOptionChange = (optionId, checked) => {
    if (soldOut) return
    setSelectedOptions((prev) => ({ ...prev, [optionId]: checked }))
  }

  const handleAdd = () => {
    if (soldOut) return
    const options = optionsList.filter((opt) => selectedOptions[opt.id])
    onAddToCart(item, options)
  }

  const optionPrice = optionsList.reduce(
    (sum, opt) => sum + (selectedOptions[opt.id] ? opt.price : 0),
    0
  )
  const totalPrice = item.price + optionPrice

  return (
    <article className={`menu-card ${soldOut ? 'menu-card--sold-out' : ''}`}>
      {soldOut && <span className="menu-card__sold-out">품절</span>}
      <div className="menu-card__image">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="menu-card__img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="menu-card__image-placeholder">이미지</span>
        )}
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">{item.price.toLocaleString()}원</p>
      <p className="menu-card__desc">{item.description}</p>
      <div className="menu-card__options">
        {optionsList.map((opt) => (
          <label key={opt.id} className={`menu-card__option ${soldOut ? 'menu-card__option--disabled' : ''}`}>
            <input
              type="checkbox"
              checked={!!selectedOptions[opt.id]}
              disabled={soldOut}
              onChange={(e) => handleOptionChange(opt.id, e.target.checked)}
            />
            <span>
              {opt.label}(+{opt.price === 0 ? '0' : opt.price.toLocaleString()}원)
            </span>
          </label>
        ))}
      </div>
      <button type="button" className="menu-card__btn" onClick={handleAdd} disabled={soldOut}>
        {soldOut ? '품절' : '담기'}
      </button>
    </article>
  )
}
