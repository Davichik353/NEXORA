/** Pure inventory operations shared by checkout and order management. */
export type StockItem = { id: number; stock: number };
export type LineItem = { id: number; qty: number };
export function changeInventory<T extends StockItem>(
  products: T[],
  items: LineItem[],
  direction: "reserve" | "release",
): T[] {
  const quantities = new Map<number, number>();
  for (const item of items) {
    if (!Number.isInteger(item.qty) || item.qty <= 0)
      throw new Error("Некорректное количество товара");
    if (!products.some((p) => p.id === item.id))
      throw new Error("Товар не найден");
    quantities.set(item.id, (quantities.get(item.id) || 0) + item.qty);
  }
  return products.map((product) => {
    const quantity = quantities.get(product.id) || 0;
    const stock =
      product.stock + (direction === "release" ? quantity : -quantity);
    if (stock < 0) throw new Error("Недостаточно товара на складе");
    return { ...product, stock };
  });
}
export function discountedTotal(subtotal: number, discount: number): number {
  if (
    !Number.isFinite(subtotal) ||
    subtotal < 0 ||
    discount < 0 ||
    discount > 90
  )
    throw new Error("Некорректная сумма или скидка");
  return Math.round(subtotal * (1 - discount / 100));
}
