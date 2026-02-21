import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import './AdminPage.css'

function getInventoryStatus(stock) {
  if (stock === 0) return { label: '품절', className: 'inventory-status--out' }
  if (stock < 5) return { label: '주의', className: 'inventory-status--low' }
  return { label: '정상', className: 'inventory-status--ok' }
}

function formatOrderDate(date) {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

export default function AdminPage() {
  const { orders, inventory, loadOrders, loadInventory, updateOrderStatus, updateInventory } = useApp()

  useEffect(() => {
    loadOrders()
    loadInventory()
  }, [loadOrders, loadInventory])

  const totalOrders = orders.length
  const receivedCount = orders.filter((o) => o.status === 'received').length
  const makingCount = orders.filter((o) => o.status === 'making').length
  const doneCount = orders.filter((o) => o.status === 'done').length

  const visibleOrders = orders.filter((o) => o.status !== 'done')

  return (
    <div className="admin-page">
      <section className="admin-section admin-dashboard">
        <h2 className="admin-section__title">관리자 대시보드</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="dashboard-card__label">총 주문</span>
            <span className="dashboard-card__value">{totalOrders}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card__label">주문 접수</span>
            <span className="dashboard-card__value">{receivedCount}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card__label">제조 중</span>
            <span className="dashboard-card__value">{makingCount}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card__label">제조 완료</span>
            <span className="dashboard-card__value">{doneCount}</span>
          </div>
        </div>
      </section>

      <section className="admin-section admin-inventory">
        <h2 className="admin-section__title">재고 현황</h2>
        <div className="inventory-cards">
          {inventory.map(({ id, name, stock }) => {
            const status = getInventoryStatus(stock)
            return (
              <div key={id} className="inventory-card">
                <span className="inventory-card__name">{name}</span>
                <div className="inventory-card__stock-row">
                  <span className="inventory-card__stock">{stock}개</span>
                  <span className={`inventory-card__status ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div className="inventory-card__actions">
                  <button
                    type="button"
                    className="inventory-card__btn inventory-card__btn--minus"
                    onClick={() => updateInventory(id, -1)}
                    disabled={stock <= 0}
                    aria-label="재고 감소"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="inventory-card__btn inventory-card__btn--plus"
                    onClick={() => updateInventory(id, 1)}
                    aria-label="재고 증가"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="admin-section admin-orders">
        <h2 className="admin-section__title">주문 현황</h2>
        {visibleOrders.length === 0 ? (
          <p className="admin-orders__empty">접수 대기 또는 진행 중인 주문이 없습니다.</p>
        ) : (
          <ul className="order-list">
            {visibleOrders.map((order) => (
              <li key={order.id} className="order-card">
                <div className="order-card__header">
                  <time className="order-card__date">
                    {formatOrderDate(order.createdAt)}
                  </time>
                  <span className={`order-card__status order-card__status--${order.status}`}>
                    {order.status === 'pending' && '대기'}
                    {order.status === 'received' && '주문 접수'}
                    {order.status === 'making' && '제조 중'}
                  </span>
                </div>
                <ul className="order-card__items">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="order-card__item">
                      {item.name}
                      {item.optionLabels?.length > 0 && ` (${item.optionLabels.join(', ')})`} X {item.quantity}{' '}
                      — {Number(item.totalPrice).toLocaleString()}원
                    </li>
                  ))}
                </ul>
                <div className="order-card__footer">
                  <span className="order-card__total">
                    총 {Number(order.totalAmount).toLocaleString()}원
                  </span>
                  {order.status === 'pending' && (
                    <button
                      type="button"
                      className="order-card__action order-card__action--primary"
                      onClick={() => updateOrderStatus(order.id, 'received')}
                    >
                      주문 접수
                    </button>
                  )}
                  {order.status === 'received' && (
                    <button
                      type="button"
                      className="order-card__action order-card__action--primary"
                      onClick={() => updateOrderStatus(order.id, 'making')}
                    >
                      제조 시작
                    </button>
                  )}
                  {order.status === 'making' && (
                    <button
                      type="button"
                      className="order-card__action order-card__action--secondary"
                      onClick={() => updateOrderStatus(order.id, 'done')}
                    >
                      제조 완료
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
