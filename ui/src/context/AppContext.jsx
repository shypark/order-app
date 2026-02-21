import { createContext, useContext, useState, useCallback } from 'react'
import { api } from '../api/client'

// 관리자 화면에서만 사용. 재고 카드에 표시할 메뉴는 API 재고 목록 기준으로 함.
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.getOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('주문 목록 조회 실패:', err)
      setOrders([])
    }
  }, [])

  const loadInventory = useCallback(async () => {
    try {
      const data = await api.getInventory()
      setInventory(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('재고 조회 실패:', err)
      setInventory([])
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status)
      await loadOrders()
    } catch (err) {
      console.error('주문 상태 변경 실패:', err)
      throw err
    }
  }, [loadOrders])

  const updateInventory = useCallback(async (menuId, delta) => {
    try {
      await api.updateStock(menuId, { delta })
      await loadInventory()
    } catch (err) {
      console.error('재고 수정 실패:', err)
      throw err
    }
  }, [loadInventory])

  const value = {
    orders,
    inventory,
    loadOrders,
    loadInventory,
    updateOrderStatus,
    updateInventory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
