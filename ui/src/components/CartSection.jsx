import './CartSection.css'

export default function CartSection({ cart, onQuantityChange, onRemove, onSubmitOrder }) {
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const isEmpty = cart.length === 0

  return (
    <section className="cart">
      <h2 className="cart__title">장바구니</h2>
      {isEmpty ? (
        <p className="cart__empty">장바구니가 비어 있습니다. 메뉴를 담아 주세요.</p>
      ) : (
        <div className="cart__body">
          <div className="cart__left">
            <ul className="cart__list">
              {cart.map((item) => (
                <li key={item.key} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__name">
                      {item.name}
                      {item.optionLabels.length > 0 && ` (${item.optionLabels.join(', ')})`} X {item.quantity}
                    </span>
                  </div>
                  <span className="cart-item__price">{item.totalPrice.toLocaleString()}원</span>
                  <div className="cart-item__actions">
                    <button
                      type="button"
                      className="cart-item__qty-btn"
                      onClick={() => onQuantityChange(item.key, -1)}
                      aria-label="수량 감소"
                    >
                      −
                    </button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-item__qty-btn"
                      onClick={() => onQuantityChange(item.key, 1)}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => onRemove(item.key)}
                      aria-label="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cart__right">
            <p className="cart__total">총 금액 {totalAmount.toLocaleString()}원</p>
            <button
              type="button"
              className="cart__order-btn"
              onClick={onSubmitOrder}
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
