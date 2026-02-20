import { useState } from 'react'
import { MENU_OPTIONS } from '../data/menu'
import './MenuCard.css'

export default function MenuCard({ item, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState({})

  const handleOptionChange = (optionId, checked) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: checked }))
  }

  const handleAdd = () => {
    const options = MENU_OPTIONS.filter((opt) => selectedOptions[opt.id])
    onAddToCart(item, options)
  }

  const optionPrice = MENU_OPTIONS.reduce(
    (sum, opt) => sum + (selectedOptions[opt.id] ? opt.price : 0),
    0
  )
  const totalPrice = item.price + optionPrice

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        <span className="menu-card__image-placeholder">이미지</span>
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">{item.price.toLocaleString()}원</p>
      <p className="menu-card__desc">{item.description}</p>
      <div className="menu-card__options">
        {MENU_OPTIONS.map((opt) => (
          <label key={opt.id} className="menu-card__option">
            <input
              type="checkbox"
              checked={!!selectedOptions[opt.id]}
              onChange={(e) => handleOptionChange(opt.id, e.target.checked)}
            />
            <span>
              {opt.label}(+{opt.price === 0 ? '0' : opt.price.toLocaleString()}원)
            </span>
          </label>
        ))}
      </div>
      <button type="button" className="menu-card__btn" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}
