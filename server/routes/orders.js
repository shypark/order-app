const express = require('express');
const { query, getPool } = require('../db');

const router = express.Router();

// GET /api/orders - 주문 목록 (관리자)
router.get('/', async (req, res) => {
  try {
    const statusFilter = req.query.status;
    let sql = `
      SELECT o.id, o.created_at, o.status, o.total_amount,
             (SELECT json_agg(json_build_object('menuId', m.code, 'name', oi.menu_name, 'optionLabels', oi.option_labels, 'quantity', oi.quantity, 'unitPrice', oi.unit_price, 'totalPrice', oi.total_price))
              FROM order_items oi JOIN menus m ON m.id = oi.menu_id WHERE oi.order_id = o.id) AS items
      FROM orders o ORDER BY o.created_at DESC
    `;
    const params = [];
    if (statusFilter) {
      sql = `
        SELECT o.id, o.created_at, o.status, o.total_amount,
               (SELECT json_agg(json_build_object('menuId', m.code, 'name', oi.menu_name, 'optionLabels', oi.option_labels, 'quantity', oi.quantity, 'unitPrice', oi.unit_price, 'totalPrice', oi.total_price))
                FROM order_items oi JOIN menus m ON m.id = oi.menu_id WHERE oi.order_id = o.id) AS items
        FROM orders o WHERE o.status = $1 ORDER BY o.created_at DESC
      `;
      params.push(statusFilter);
    }
    const r = await query(sql, params);
    const orders = r.rows.map((row) => ({
      id: String(row.id),
      createdAt: row.created_at,
      items: (row.items || []).map((it) => ({ ...it, optionLabels: it.optionLabels || [] })),
      totalAmount: Number(row.total_amount),
      status: row.status,
    }));
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id - 주문 단건 조회
router.get('/:id', async (req, res) => {
  try {
    const r = await query(
      `SELECT o.id, o.created_at, o.status, o.total_amount,
              (SELECT json_agg(json_build_object('menuId', m.code, 'name', oi.menu_name, 'optionLabels', oi.option_labels, 'quantity', oi.quantity, 'unitPrice', oi.unit_price, 'totalPrice', oi.total_price))
               FROM order_items oi JOIN menus m ON m.id = oi.menu_id WHERE oi.order_id = o.id) AS items
       FROM orders o WHERE o.id = $1`,
      [req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const row = r.rows[0];
    res.json({
      id: String(row.id),
      createdAt: row.created_at,
      items: (row.items || []).map((it) => ({ ...it, optionLabels: it.optionLabels || [] })),
      totalAmount: Number(row.total_amount),
      status: row.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders - 주문 생성 및 재고 차감
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    if (!Array.isArray(items) || items.length === 0 || totalAmount == null) {
      return res.status(400).json({ error: 'items and totalAmount required' });
    }
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const orderResult = await client.query(
        'INSERT INTO orders (status, total_amount) VALUES ($1, $2) RETURNING id, created_at, status, total_amount',
        ['pending', totalAmount]
      );
      const orderId = orderResult.rows[0].id;
      const menuIdByCode = {};
      const codeResult = await client.query('SELECT id, code FROM menus');
      codeResult.rows.forEach((r) => { menuIdByCode[r.code] = r.id; });
      for (const it of items) {
        const menuId = menuIdByCode[it.menuId] ?? it.menuId;
        const optionLabels = Array.isArray(it.optionLabels) ? it.optionLabels : [];
        await client.query(
          'INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, total_price, option_labels) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [orderId, menuId, it.name || '', it.quantity, it.unitPrice, it.totalPrice, JSON.stringify(optionLabels)]
        );
        await client.query('UPDATE menus SET stock = GREATEST(0, stock - $1) WHERE id = $2', [it.quantity, menuId]);
      }
      await client.query('COMMIT');
      res.status(201).json({
        id: String(orderId),
        createdAt: orderResult.rows[0].created_at,
        status: orderResult.rows[0].status,
        totalAmount: Number(orderResult.rows[0].total_amount),
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id - 주문 상태 변경
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'received', 'making', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const r = await query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status', [status, req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ id: String(r.rows[0].id), status: r.rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
