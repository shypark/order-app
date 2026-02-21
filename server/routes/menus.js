const express = require('express');
const { query } = require('../db');

const router = express.Router();

// GET /api/menus - 메뉴 목록 (includeStock=1 이면 재고 포함, 관리자용)
router.get('/', async (req, res) => {
  try {
    const includeStock = req.query.includeStock === '1';
    const menusResult = await query(`
      SELECT id, code, name, description, price, image${includeStock ? ', stock' : ''}
      FROM menus ORDER BY id
    `);
    const optionsResult = await query('SELECT id, name, price FROM options ORDER BY id');
    const options = optionsResult.rows.map((r) => ({ id: r.id, label: r.name, price: Number(r.price) }));
    const menuOptionsResult = await query('SELECT menu_id, option_id FROM menu_options');
    const menuOptionsMap = {};
    menuOptionsResult.rows.forEach((r) => {
      if (!menuOptionsMap[r.menu_id]) menuOptionsMap[r.menu_id] = [];
      menuOptionsMap[r.menu_id].push(r.option_id);
    });
    const menus = menusResult.rows.map((r) => {
      const optIds = menuOptionsMap[r.id] || [];
      const menuOptions = options.filter((o) => optIds.includes(o.id));
      const row = {
        id: r.code,
        name: r.name,
        description: r.description,
        price: Number(r.price),
        image: r.image,
        options: menuOptions,
      };
      if (includeStock) row.stock = Number(r.stock);
      return row;
    });
    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/menus/:id/stock - 재고 수정 (id = menu code)
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id: code } = req.params;
    const { delta, stock } = req.body;
    if (delta != null) {
      await query(
        'UPDATE menus SET stock = GREATEST(0, stock + $1) WHERE code = $2 RETURNING id, code, stock',
        [parseInt(delta, 10), code]
      );
    } else if (stock != null) {
      await query('UPDATE menus SET stock = GREATEST(0, $1) WHERE code = $2 RETURNING id, code, stock', [
        parseInt(stock, 10),
        code,
      ]);
    } else {
      return res.status(400).json({ error: 'delta or stock required' });
    }
    const r = await query('SELECT code, stock FROM menus WHERE code = $1', [code]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Menu not found' });
    res.json({ id: r.rows[0].code, stock: Number(r.rows[0].stock) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menus/inventory - 관리자 재고 목록 (메뉴 코드 + 재고)
router.get('/inventory', async (req, res) => {
  try {
    const r = await query('SELECT code, name, stock FROM menus ORDER BY id');
    res.json(r.rows.map((row) => ({ id: row.code, name: row.name, stock: Number(row.stock) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
