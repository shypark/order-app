import { createContext, useContext, useState, useCallback } from 'react'

// 재고 현황에 사용할 메뉴 ID (PRD: 아메리카노 ICE/HOT, 카페라떼 HOT)
export const INVENTORY_MENU_IDS = ['americano-ice', 'americano-hot', 'cafe-latte-hot']

const defaultInventory = Object.fromEntries(INVENTORY_MENU_IDS.map((id) => [id, 10]))

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(defaultInventory)

  const addOrder = useCallback((cartItems, totalAmount) => {
    const id = `order-${Date.now()}`
    const items = cartItems.map(({ name, optionLabels, quantity, unitPrice, totalPrice }) => ({
      name,
      optionLabels,
      quantity,
      unitPrice,
      totalPrice,
    }))
    setOrders((prev) => [
      ...prev,
      {
        id,
        createdAt: new Date(),
        items,
        totalAmount,
        status: 'pending', // 대기 → 주문 접수 → 제조 중 → 제조 완료
      },
    ])
  }, [])

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }, [])

  const updateInventory = useCallback((menuId, delta) => {
    setInventory((prev) => ({
      ...prev,
      [menuId]: Math.max(0, (prev[menuId] ?? 0) + delta),
    }))
  }, [])

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    inventory,
    updateInventory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
