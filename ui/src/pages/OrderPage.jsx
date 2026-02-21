import { useState, useCallback } from 'react'
import { COFFEE_MENU } from '../data/menu'
import { useApp } from '../context/AppContext'
import MenuCard from '../components/MenuCard'
import CartSection from '../components/CartSection'
import './OrderPage.css'

function makeCartKey(menuId, options) {
  const optionIds = options.map((o) => o.id).sort()
  return `${menuId}:${optionIds.join(',')}`
}

export default function OrderPage() {
  const [cart, setCart] = useState([])
  const { addOrder } = useApp()

  const addToCart = useCallback((item, options) => {
    const optionLabels = options.map((o) => o.label)
    const optionPrice = options.reduce((sum, o) => sum + o.price, 0)
    const unitPrice = item.price + optionPrice
    const key = makeCartKey(item.id, options)

    setCart((prev) => {
      const existing = prev.find((c) => c.key === key)
      if (existing) {
        return prev.map((c) =>
          c.key === key
            ? {
                ...c,
                quantity: c.quantity + 1,
                totalPrice: (c.quantity + 1) * c.unitPrice,
              }
            : c
        )
      }
      return [
        ...prev,
        {
          key,
          menuId: item.id,
          name: item.name,
          optionLabels,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice,
        },
      ]
    })
  }, [])

  const changeQuantity = useCallback((key, delta) => {
    setCart((prev) => {
      const item = prev.find((c) => c.key === key)
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) return prev.filter((c) => c.key !== key)
      return prev.map((c) =>
        c.key === key
          ? {
              ...c,
              quantity: newQty,
              totalPrice: newQty * c.unitPrice,
            }
          : c
      )
    })
  }, [])

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((c) => c.key !== key))
  }, [])

  const submitOrder = useCallback(() => {
    if (cart.length === 0) return
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    addOrder(cart, totalAmount)
    setCart([])
    alert('주문이 접수되었습니다.')
  }, [cart, addOrder])

  return (
    <div className="order-page">
      <section className="order-page__menu">
        <h2 className="order-page__menu-title">메뉴</h2>
        <div className="order-page__menu-grid">
          {COFFEE_MENU.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
      <CartSection
        cart={cart}
        onQuantityChange={changeQuantity}
        onRemove={removeFromCart}
        onSubmitOrder={submitOrder}
      />
    </div>
  )
}
