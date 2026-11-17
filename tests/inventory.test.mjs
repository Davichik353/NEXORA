import { test } from "node:test";
import assert from "node:assert/strict";
import { changeInventory, discountedTotal } from "../lib/inventory.ts";

test("purchase reserves stock; cancellation restores the exact quantity without mutating the original", () => {
  const original = [
    { id: 1, stock: 5, name: "Phone" },
    { id: 2, stock: 9 },
  ];
  const lines = [{ id: 1, qty: 2 }];
  const reserved = changeInventory(original, lines, "reserve");
  assert.equal(reserved[0].stock, 3);
  assert.equal(reserved[0].name, "Phone");
  assert.equal(reserved[1].stock, 9);
  assert.equal(original[0].stock, 5);
  assert.deepEqual(changeInventory(reserved, lines, "release"), original);
});
test("duplicate cart lines cannot bypass the stock limit", () => {
  assert.throws(
    () =>
      changeInventory(
        [{ id: 1, stock: 3 }],
        [
          { id: 1, qty: 2 },
          { id: 1, qty: 2 },
        ],
        "reserve",
      ),
    /Недостаточно/,
  );
});
test("missing items and invalid quantities cannot create an order", () => {
  assert.throws(
    () =>
      changeInventory([{ id: 1, stock: 3 }], [{ id: 2, qty: 1 }], "reserve"),
    /не найден/,
  );
  for (const qty of [0, -1, 1.5])
    assert.throws(
      () => changeInventory([{ id: 1, stock: 3 }], [{ id: 1, qty }], "reserve"),
      /Некорректное/,
    );
});
test("promo totals use the same rounded amount stored in the order", () => {
  assert.equal(discountedTotal(999, 10), 899);
  assert.equal(discountedTotal(1248, 15), 1061);
  assert.equal(discountedTotal(999, 0), 999);
  assert.throws(() => discountedTotal(999, 101));
});
