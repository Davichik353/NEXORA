"use client";
import { changeInventory, discountedTotal } from "../lib/inventory";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Warehouse,
  ChartNoAxesCombined,
  TicketPercent,
  UserRoundCog,
  Settings,
  CircleHelp,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Download,
  CalendarDays,
  MoreHorizontal,
  X,
  Check,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Monitor,
  Smartphone,
  Headphones,
  Watch,
  Tablet,
  Laptop,
  Menu,
  LogOut,
  Store,
  Globe,
  CircleDollarSign,
  CreditCard,
  Truck,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Minus,
  Eye,
  Mail,
  Send,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  image: string;
  sku: string;
  description: string;
};
type Order = {
  id: string;
  name: string;
  email: string;
  date: string;
  total: number;
  status: string;
  items: { id: number; qty: number; price: number }[];
  address?: string;
};
type Promo = { code: string; discount: number; active: boolean };
type Staff = { name: string; email: string; role: string };
type DB = {
  products: Product[];
  orders: Order[];
  promos: Promo[];
  staff: Staff[];
};
const initialProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Смартфоны",
    price: 999,
    cost: 760,
    stock: 24,
    image: "iphone",
    sku: "APL-IP15P-256",
    description:
      "Титановый корпус. Чип A17 Pro. Профессиональная камера 48 Мп. 256 ГБ памяти для всего, что важно.",
  },
  {
    id: 2,
    name: "MacBook Pro 14″",
    brand: "Apple",
    category: "Ноутбуки",
    price: 1999,
    cost: 1550,
    stock: 12,
    image: "macbook",
    sku: "APL-MBP14-M3",
    description:
      "Мощность чипа M3, дисплей Liquid Retina XDR и до 18 часов автономной работы. 16 ГБ / 512 ГБ.",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Аудио",
    price: 349,
    cost: 230,
    stock: 38,
    image: "sony",
    sku: "SNY-WHXM5-BLK",
    description:
      "Ваше личное пространство. Беспроводные наушники с интеллектуальным шумоподавлением и 30 часами музыки.",
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Часы",
    price: 399,
    cost: 285,
    stock: 8,
    image: "watch",
    sku: "APL-AW9-45",
    description:
      "Следите за активностью, оставайтесь на связи и заботьтесь о здоровье. Алюминиевый корпус, 45 мм.",
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "Аудио",
    price: 249,
    cost: 170,
    stock: 46,
    image: "airpods",
    sku: "APL-APP2-WHT",
    description:
      "Активное шумоподавление, пространственное аудио и удобный зарядный футляр USB-C.",
  },
  {
    id: 6,
    name: "iPad Air",
    brand: "Apple",
    category: "Планшеты",
    price: 599,
    cost: 420,
    stock: 17,
    image: "ipad",
    sku: "APL-IPA-256",
    description:
      "Для больших идей. Яркий экран 10,9 дюйма, мощный процессор и поддержка Apple Pencil.",
  },
  {
    id: 7,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Смартфоны",
    price: 1199,
    cost: 900,
    stock: 6,
    image: "samsung",
    sku: "SAM-S24U-256",
    description:
      "Смартфон с Galaxy AI, камерой 200 Мп и встроенным S Pen. 256 ГБ.",
  },
  {
    id: 8,
    name: "AirPods Max",
    brand: "Apple",
    category: "Аудио",
    price: 549,
    cost: 390,
    stock: 15,
    image: "keyboard",
    sku: "APL-APM-SLV",
    description:
      "Высококачественный звук, мягкие амбушюры и исключительное качество сборки.",
  },
];
const names = [
  ["Александр Петров", "alex.petrov@mail.ru"],
  ["Мария Иванова", "m.ivanova@gmail.com"],
  ["Дмитрий Смирнов", "d.smirnov@mail.ru"],
  ["Анна Козлова", "anna.k@gmail.com"],
  ["Михаил Волков", "m.volkov@mail.ru"],
  ["Екатерина Соколова", "kate.s@gmail.com"],
  ["Артём Морозов", "a.morozov@mail.ru"],
  ["София Лебедева", "sofia.l@gmail.com"],
];
const seed: DB = {
  products: initialProducts,
  orders: Array.from({ length: 34 }, (_, i) => {
    const p = initialProducts[i % 8];
    return {
      id: `NX-${1048 - i}`,
      name: names[i % 8][0],
      email: names[i % 8][1],
      date: `2026-11-${String(17 - Math.floor(i / 2)).padStart(2, "0")}T${String(14 - (i % 6)).padStart(2, "0")}:30:00+05:00`,
      total: p.price,
      status: [
        "Оплачен",
        "В обработке",
        "Отправлен",
        "Доставлен",
        "Доставлен",
        "Отменён",
      ][i % 6],
      items: [{ id: p.id, qty: 1, price: p.price }],
    };
  }),
  promos: [
    { code: "NEXORA10", discount: 10, active: true },
    { code: "WELCOME15", discount: 15, active: true },
    { code: "SUMMER20", discount: 20, active: false },
  ],
  staff: [
    { name: "Александр Петров", email: "alex@nexora.store", role: "Владелец" },
    { name: "Мария Иванова", email: "maria@nexora.store", role: "Менеджер" },
    {
      name: "Дмитрий Смирнов",
      email: "dmitry@nexora.store",
      role: "Кладовщик",
    },
  ],
};
const nav = [
  { key: "dashboard", label: "Обзор", icon: LayoutDashboard },
  { key: "products", label: "Товары", icon: Package },
  { key: "orders", label: "Заказы", icon: ShoppingBag },
  { key: "customers", label: "Клиенты", icon: Users },
  { key: "inventory", label: "Склад", icon: Warehouse },
  { key: "analytics", label: "Аналитика", icon: ChartNoAxesCombined },
  { key: "promotions", label: "Промокоды", icon: TicketPercent },
  { key: "staff", label: "Сотрудники", icon: UserRoundCog },
];
const colors = ["#4169ed", "#8aabfa", "#b9cdfb", "#e4ebfa"];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const num = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
const date = (d: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Tashkent",
  }).format(new Date(d));
const initials = (s: string) =>
  s
    .split(" ")
    .map((a) => a[0])
    .slice(0, 2)
    .join("");
function Badge({ status }: { status: string }) {
  return (
    <span
      className={
        "badge " +
        (status === "Оплачен" || status === "Доставлен"
          ? "green"
          : status === "Отправлен"
            ? "blue"
            : status === "Отменён"
              ? "gray"
              : "orange")
      }
    >
      <i />
      {status}
    </span>
  );
}
function ProductPic({ p }: { p: Product }) {
  return (
    <img
      src={"/assets/" + p.image + ".webp"}
      alt={p.name}
      width="56"
      height="56"
    />
  );
}
export default function Commerce() {
  const [db, setDB] = useState<DB>(seed);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [mode, setMode] = useState("admin");
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все статусы");
  const [period, setPeriod] = useState("30");
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [category, setCategory] = useState("Все товары");
  const [brand, setBrand] = useState("Все бренды");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [account, setAccount] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [showFavs, setShowFavs] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [userMenu, setUserMenu] = useState(false);
  const [chartMode, setChartMode] = useState("revenue");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora-db-v1");
      if (saved) setDB(JSON.parse(saved));
      const c = localStorage.getItem("nexora-cart");
      if (c) setCart(JSON.parse(c));
      const f = localStorage.getItem("nexora-favs");
      if (f) setFavs(JSON.parse(f));
      const a = localStorage.getItem("nexora-account");
      if (a) setAccount(JSON.parse(a));
    } catch {}
    const route = new URLSearchParams(location.search);
    setPage(route.get("view") || "dashboard");
    setMode(route.get("mode") === "shop" ? "shop" : "admin");
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      localStorage.setItem("nexora-db-v1", JSON.stringify(db));
      localStorage.setItem("nexora-cart", JSON.stringify(cart));
      localStorage.setItem("nexora-favs", JSON.stringify(favs));
      localStorage.setItem("nexora-account", JSON.stringify(account));
    }
  }, [db, cart, favs, account, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
        setMobile(false);
        setUserMenu(false);
      }
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [modal]);
  function go(p: string, m = mode) {
    setPage(p);
    setMode(m);
    setQuery("");
    setFilter("Все статусы");
    setOrderPage(1);
    setMobile(false);
    history.pushState({}, "", `?mode=${m}&view=${p}`);
  }
  useEffect(() => {
    const pop = () => {
      const s = new URLSearchParams(location.search);
      setMode(s.get("mode") || "admin");
      setPage(s.get("view") || "dashboard");
      setQuery("");
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const orders = useMemo(
    () =>
      db.orders.filter(
        (o) =>
          Date.parse(o.date) >=
          Date.parse("2026-11-18T00:00:00+05:00") - Number(period) * 86400000,
      ),
    [db.orders, period],
  );
  const valid = orders.filter((o) => o.status !== "Отменён");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const customerList = useMemo(
    () =>
      Array.from(new Set(db.orders.map((o) => o.email))).map((email) => {
        const list = db.orders.filter((o) => o.email === email);
        return {
          email,
          name: list[0].name,
          orders: list.length,
          total: list
            .filter((o) => o.status !== "Отменён")
            .reduce((s, o) => s + o.total, 0),
          last: list[0].date,
        };
      }),
    [db.orders],
  );
  const profit = valid.reduce(
    (s, o) =>
      s +
      o.items.reduce(
        (v, i) =>
          v +
          (i.price - (db.products.find((p) => p.id === i.id)?.cost || 0)) *
            i.qty,
        0,
      ),
    0,
  );
  const graph = Array.from(
    { length: Number(period) === 7 ? 7 : 15 },
    (_, i) => {
      const d = new Date("2026-11-17T12:00:00+05:00");
      d.setDate(d.getDate() - (Number(period) === 7 ? 6 - i : 28 - i * 2));
      const end = new Date(d);
      end.setDate(end.getDate() + (Number(period) === 7 ? 1 : 2));
      const os = valid.filter(
        (o) => new Date(o.date) >= d && new Date(o.date) < end,
      );
      return {
        label: new Intl.DateTimeFormat("ru-RU", {
          day: "numeric",
          month: "short",
          timeZone: "Asia/Tashkent",
        }).format(d),
        revenue: os.reduce((s, o) => s + o.total, 0),
        orders: os.length,
      };
    },
  );
  const cats = ["Смартфоны", "Ноутбуки", "Аудио", "Другие"];
  const catData = cats.map((name, i) => ({
    name,
    value: valid.reduce(
      (s, o) =>
        s +
        o.items.reduce((v, it) => {
          const p = db.products.find((p) => p.id === it.id);
          return (
            v +
            ((
              i === 3
                ? !cats.slice(0, 3).includes(p?.category || "")
                : p?.category === name
            )
              ? it.price * it.qty
              : 0)
          );
        }, 0),
      0,
    ),
  }));
  const best = db.products
    .map((p) => ({
      ...p,
      sold: valid.reduce(
        (s, o) =>
          s +
          o.items.filter((i) => i.id === p.id).reduce((v, i) => v + i.qty, 0),
        0,
      ),
    }))
    .sort((a, b) => b.sold - a.sold);
  const filteredOrders = db.orders.filter(
    (o) =>
      (filter === "Все статусы" || o.status === filter) &&
      `${o.id} ${o.name} ${o.email}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const filteredProducts = db.products.filter((p) =>
    `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
  );
  const storeProducts = db.products
    .filter(
      (p) =>
        (category === "Все товары" || p.category === category) &&
        (brand === "Все бренды" || p.brand === brand) &&
        p.price <= maxPrice &&
        (!showFavs || favs.includes(p.id)) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.price - b.price
        : sort === "desc"
          ? b.price - a.price
          : 0,
    );
  const totalCart = cart.reduce(
    (s, i) => s + (db.products.find((p) => p.id === i.id)?.price || 0) * i.qty,
    0,
  );
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  function add(p: Product) {
    const qty = cart.find((i) => i.id === p.id)?.qty || 0;
    if (qty >= p.stock) {
      setToast("Достигнут доступный остаток");
      return;
    }
    setCart(
      cart.some((i) => i.id === p.id)
        ? cart.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { id: p.id, qty: 1 }],
    );
    setToast(p.name + " — в корзине");
  }
  function changeQty(id: number, delta: number) {
    setCart(
      cart.flatMap((i) => {
        if (i.id !== id) return [i];
        const q = i.qty + delta;
        if (q > (db.products.find((p) => p.id === id)?.stock || 0)) {
          setToast("Недостаточно товара на складе");
          return [i];
        }
        return q > 0 ? [{ ...i, qty: q }] : [];
      }),
    );
  }
  function exportCSV() {
    const rows =
      page === "products" || page === "inventory"
        ? [
            ["SKU", "Товар", "Цена", "Остаток"],
            ...db.products.map((p) => [p.sku, p.name, p.price, p.stock]),
          ]
        : page === "customers"
          ? [
              ["Имя", "Email", "Заказы", "Покупки"],
              ...customerList.map((c) => [c.name, c.email, c.orders, c.total]),
            ]
          : [
              ["Заказ", "Клиент", "Email", "Дата", "Сумма USD", "Статус"],
              ...orders.map((o) => [
                o.id,
                o.name,
                o.email,
                date(o.date),
                o.total,
                o.status,
              ]),
            ];
    const blob = new Blob(
      [
        "\uFEFF" +
          rows
            .map((r) =>
              r
                .map((v) => '"' + String(v).replaceAll('"', '""') + '"')
                .join(";"),
            )
            .join("\n"),
      ],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexora-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Отчёт выгружен в CSV");
  }
  function statusChange(o: Order, status: string) {
    if (o.status === "Отменён" && status !== "Отменён") {
      if (
        o.items.some(
          (i) => (db.products.find((p) => p.id === i.id)?.stock || 0) < i.qty,
        )
      ) {
        setToast("Недостаточно товара для восстановления заказа");
        return;
      }
    }
    setDB((prev) => ({
      ...prev,
      orders: prev.orders.map((x) => (x.id === o.id ? { ...x, status } : x)),
      products:
        o.status !== "Отменён" && status === "Отменён"
          ? changeInventory(prev.products, o.items, "release")
          : o.status === "Отменён" && status !== "Отменён"
            ? changeInventory(prev.products, o.items, "reserve")
            : prev.products,
    }));
    setOrder({ ...o, status });
    setToast("Статус заказа обновлён");
  }
  function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart.length) return;
    if (
      cart.some(
        (i) => i.qty > (db.products.find((p) => p.id === i.id)?.stock || 0),
      )
    ) {
      setToast("Остатки изменились. Проверьте корзину");
      return;
    }
    const f = new FormData(e.currentTarget);
    const o: Order = {
      id:
        "NX-" +
        (Math.max(...db.orders.map((o) => Number(o.id.split("-")[1]))) + 1),
      name: String(f.get("name")),
      email: String(f.get("email")),
      address: String(f.get("address")),
      date: new Date().toISOString(),
      total: discountedTotal(totalCart, discount),
      status: "Оплачен",
      items: cart.map((i) => ({
        ...i,
        price: db.products.find((p) => p.id === i.id)!.price,
      })),
    };
    setDB({
      ...db,
      orders: [o, ...db.orders],
      products: changeInventory(db.products, cart, "reserve"),
    });
    setOrder(o);
    setCart([]);
    setDiscount(0);
    setPromo("");
    setModal("success");
  }
  function editProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p: Product = {
      id: selected?.id || Date.now(),
      name: String(f.get("name")),
      brand: String(f.get("brand")),
      category: String(f.get("category")),
      price: Number(f.get("price")),
      cost: Number(f.get("cost")),
      stock: Number(f.get("stock")),
      sku: String(f.get("sku")),
      description: String(f.get("description")),
      image: selected?.image || "iphone",
    };
    if (p.cost > p.price) {
      setToast("Себестоимость не должна превышать цену");
      return;
    }
    if (db.products.some((x) => x.sku === p.sku && x.id !== p.id)) {
      setToast("Товар с таким SKU уже существует");
      return;
    }
    setDB({
      ...db,
      products: selected
        ? db.products.map((x) => (x.id === p.id ? p : x))
        : [p, ...db.products],
    });
    setModal(null);
    setToast(selected ? "Товар обновлён" : "Товар добавлен");
  }
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModal("search");
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const [notifications, setNotifications] = useState(false);
  const [settings, setSettings] = useState({
    store: "Nexora Store",
    email: "hello@nexora.store",
  });
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora-settings");
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector(
      "[role=dialog]",
    ) as HTMLElement | null;
    const first = dialog?.querySelector<HTMLElement>(
      "input,button,select,textarea,a[href]",
    );
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialog) return;
      const nodes = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input,select,textarea,a[href]",
        ),
      );
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modal]);
  const Button = ({
    children,
    onClick,
    primary = false,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    primary?: boolean;
  }) => (
    <button className={primary ? "btn primary" : "btn"} onClick={onClick}>
      {children}
    </button>
  );
  function OrdersTable({ compact = false }: { compact?: boolean }) {
    const list = compact
      ? db.orders.slice(0, 5)
      : filteredOrders.slice((orderPage - 1) * 8, orderPage * 8);
    return (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Клиент</th>
              {!compact && <th>Товары</th>}
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((o, i) => (
              <tr
                key={o.id}
                onClick={() => {
                  setOrder(o);
                  setModal("order");
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setOrder(o);
                    setModal("order");
                  }
                }}
              >
                <td className="order-id">#{o.id}</td>
                <td>
                  <div className="person">
                    <span className={"avatar a" + (i % 5)}>
                      {initials(o.name)}
                    </span>
                    <span>
                      <strong>{o.name}</strong>
                      {!compact && <small>{o.email}</small>}
                    </span>
                  </div>
                </td>
                {!compact && (
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)} шт.</td>
                )}
                <td className="muted">{date(o.date)}</td>
                <td className="amount">{money(o.total)}</td>
                <td>
                  <Badge status={o.status} />
                </td>
                <td>
                  <ChevronRight size={15} className="muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div className="empty">
            Заказы не найдены. Измените поиск или фильтр.
          </div>
        )}
      </div>
    );
  }
  function Metrics() {
    return (
      <div className="metrics">
        {[
          {
            label: "Общая выручка",
            value: money(revenue),
            icon: CircleDollarSign,
            foot: `${valid.length} оплаченных заказов`,
            trend: "За выбранный период",
            spark: [20, 25, 18, 35, 28, 43, 38, 54, 50, 62],
          },
          {
            label: "Заказы",
            value: num(orders.length),
            icon: ShoppingBag,
            foot: `${orders.filter((o) => o.status === "В обработке").length} ожидают обработки`,
            trend: "Все статусы",
            spark: [15, 25, 20, 35, 24, 32, 40, 37, 55, 48],
          },
          {
            label: "Клиенты",
            value: num(new Set(orders.map((o) => o.email)).size),
            icon: Users,
            foot: "Уникальные покупатели",
            trend: "За выбранный период",
            spark: [20, 19, 28, 25, 33, 39, 35, 48, 42, 57],
          },
          {
            label: "Средний чек",
            value: money(valid.length ? revenue / valid.length : 0),
            icon: CreditCard,
            foot: "По оплаченным заказам",
            trend: "Без отменённых",
            spark: [20, 27, 22, 36, 31, 39, 35, 48, 40, 53],
          },
        ].map((m, i) => (
          <div className="metric card" key={m.label}>
            <div className="metric-top">
              <span>{m.label}</span>
              <m.icon size={18} />
            </div>
            <div className="metric-main">
              <b>{m.value}</b>
              <svg
                viewBox="0 0 100 50"
                width="94"
                height="46"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={"g" + i} x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#4875ef" stopOpacity=".14" />
                    <stop offset="1" stopColor="#4875ef" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={
                    "M0,50 " +
                    m.spark
                      .map((v, j) => `L${j * 11},${60 - v * 0.7}`)
                      .join(" ") +
                    " L99,50Z"
                  }
                  fill={`url(#g${i})`}
                />
                <polyline
                  points={m.spark
                    .map((v, j) => `${j * 11},${60 - v * 0.7}`)
                    .join(" ")}
                  stroke="#6086ef"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div className="metric-note">
              <span className="positive">
                <ArrowUpRight size={13} />
                {m.trend}
              </span>
            </div>
            <small>{m.foot}</small>
          </div>
        ))}
      </div>
    );
  }
  function ChartPanel() {
    return (
      <div className="card chart-panel">
        <div className="panel-heading">
          <div>
            <h2>Динамика продаж</h2>
            <p>Как развивается ваш бизнес</p>
          </div>
          <div className="segmented">
            <button
              className={chartMode === "revenue" ? "active" : ""}
              onClick={() => setChartMode("revenue")}
            >
              Выручка
            </button>
            <button
              className={chartMode === "orders" ? "active" : ""}
              onClick={() => setChartMode("orders")}
            >
              Заказы
            </button>
          </div>
        </div>
        <div className="chart-legend">
          <span>
            <i /> {chartMode === "revenue" ? "Выручка" : "Заказы"}
          </span>
          <b>{chartMode === "revenue" ? money(revenue) : orders.length}</b>
          <span className="muted">за период</span>
        </div>
        <div className="revenue-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graph}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4470ef" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#4470ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#eef0f5"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={36}
                tick={{ fontSize: 11, fill: "#9299a8" }}
                dy={8}
              />
              <YAxis
                tickFormatter={(v) =>
                  chartMode === "revenue"
                    ? v >= 1000
                      ? "$" + v / 1000 + "k"
                      : "$" + v
                    : v
                }
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9299a8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #edf0f5",
                  fontSize: 12,
                }}
                formatter={(v) => [
                  chartMode === "revenue" ? money(Number(v)) : v,
                  chartMode === "revenue" ? "Выручка" : "Заказы",
                ]}
              />
              <Area
                type="monotone"
                dataKey={chartMode}
                stroke="#4169ed"
                strokeWidth={2.5}
                fill="url(#area)"
                activeDot={{ r: 5, strokeWidth: 3, stroke: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  function CategoryPanel() {
    return (
      <div className="card category-panel">
        <div className="panel-heading">
          <div>
            <h2>Продажи по категориям</h2>
            <p>Распределение выручки</p>
          </div>
          <button
            className="icon-btn"
            aria-label="Открыть аналитику"
            onClick={() => go("analytics")}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={catData}
                dataKey="value"
                innerRadius={65}
                outerRadius={88}
                paddingAngle={4}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {catData.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => money(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <small>Всего продаж</small>
            <strong>{valid.length}</strong>
          </div>
        </div>
        <div className="category-legend">
          {catData.map((c, i) => (
            <div key={c.name}>
              <span>
                <i style={{ background: colors[i] }} />
                {c.name}
              </span>
              <b>{revenue ? Math.round((c.value / revenue) * 100) : 0}%</b>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function dashboard() {
    return (
      <>
        <Metrics />
        <div className="charts-grid">
          <ChartPanel />
          <CategoryPanel />
        </div>
        <div className="bottom-grid">
          <section className="card orders-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Последние заказы{" "}
                  <span className="count-chip">{db.orders.length}</span>
                </h2>
                <p>Новые покупки в вашем магазине</p>
              </div>
              <button className="text-btn" onClick={() => go("orders")}>
                Все заказы <ArrowRight size={14} />
              </button>
            </div>
            <OrdersTable compact />
          </section>
          <section className="card best-panel">
            <div className="panel-heading">
              <div>
                <h2>Популярные товары</h2>
                <p>Лидеры продаж за период</p>
              </div>
              <button
                className="icon-btn"
                onClick={() => go("products")}
                aria-label="Все товары"
              >
                <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="best-list">
              {best.slice(0, 4).map((p, i) => (
                <button
                  className="best-item"
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    setModal("product");
                  }}
                >
                  <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                  <ProductPic p={p} />
                  <span className="best-name">
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </span>
                  <span>
                    <b>{money(p.price * p.sold)}</b>
                    <small>{p.sold} продаж</small>
                  </span>
                </button>
              ))}
            </div>
            <button className="best-footer" onClick={() => go("analytics")}>
              Посмотреть аналитику <ArrowRight size={14} />
            </button>
          </section>
        </div>
        <div className="data-note">
          <span className="live-dot" />
          Демонстрационные данные · Изменения сохраняются в этом браузере
          <span>
            Обновлено только что <RefreshCw size={12} />
          </span>
        </div>
      </>
    );
  }
  function productsPage(inventory = false) {
    return (
      <section className="card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              placeholder="Поиск по названию или SKU…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <span className="muted">{filteredProducts.length} товаров</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Товар</th>
                <th>SKU</th>
                <th>Категория</th>
                <th>{inventory ? "Остаток" : "Цена"}</th>
                <th>{inventory ? "Статус запаса" : "В наличии"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <ProductPic p={p} />
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.brand}</small>
                      </span>
                    </div>
                  </td>
                  <td className="muted">{p.sku}</td>
                  <td>{p.category}</td>
                  <td className="amount">
                    {inventory ? p.stock + " шт." : money(p.price)}
                  </td>
                  <td>
                    {inventory ? (
                      <span
                        className={
                          "badge " + (p.stock < 10 ? "orange" : "green")
                        }
                      >
                        <i />
                        {p.stock < 10 ? "Заканчивается" : "В наличии"}
                      </span>
                    ) : (
                      <span className={p.stock < 10 ? "stock-low" : ""}>
                        {p.stock} шт.
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      aria-label={"Изменить " + p.name}
                      onClick={() => {
                        setSelected(p);
                        setModal(inventory ? "stock" : "edit");
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredProducts.length && (
            <div className="empty">Товары не найдены</div>
          )}
        </div>
        <div className="table-footer">
          Всего {db.products.length} товаров{" "}
          <span>
            {db.products.reduce((s, p) => s + p.stock, 0)} единиц на складе
          </span>
        </div>
      </section>
    );
  }
  function ordersPage() {
    return (
      <section className="card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              placeholder="Номер заказа, имя или email…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOrderPage(1);
              }}
            />
          </label>
          <select
            aria-label="Статус заказа"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setOrderPage(1);
            }}
          >
            {[
              "Все статусы",
              "В обработке",
              "Оплачен",
              "Отправлен",
              "Доставлен",
              "Отменён",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <OrdersTable />
        <div className="table-footer">
          Показано {Math.min((orderPage - 1) * 8 + 1, filteredOrders.length)}–
          {Math.min(orderPage * 8, filteredOrders.length)} из{" "}
          {filteredOrders.length}
          <div className="pagination">
            <button
              disabled={orderPage === 1}
              onClick={() => setOrderPage(orderPage - 1)}
            >
              Назад
            </button>
            <span>{orderPage}</span>
            <button
              disabled={orderPage * 8 >= filteredOrders.length}
              onClick={() => setOrderPage(orderPage + 1)}
            >
              Далее
            </button>
          </div>
        </div>
      </section>
    );
  }
  function customersPage() {
    const cs = customerList.filter((c) =>
      (c.name + " " + c.email).toLowerCase().includes(query.toLowerCase()),
    );
    return (
      <section className="card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти клиента…"
            />
          </label>
          <span className="muted">{cs.length} клиентов</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Заказы</th>
                <th>Сумма покупок</th>
                <th>Последняя покупка</th>
                <th>Сегмент</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cs.map((c, i) => (
                <tr
                  key={c.email}
                  onClick={() => {
                    setOrder(db.orders.find((o) => o.email === c.email)!);
                    setModal("customer");
                  }}
                >
                  <td>
                    <div className="person">
                      <span className={"avatar a" + (i % 5)}>
                        {initials(c.name)}
                      </span>
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>{c.orders}</td>
                  <td className="amount">{money(c.total)}</td>
                  <td className="muted">{date(c.last)}</td>
                  <td>
                    <span
                      className={"badge " + (c.total > 4000 ? "blue" : "gray")}
                    >
                      {c.total > 4000
                        ? "VIP-клиент"
                        : c.orders > 1
                          ? "Постоянный"
                          : "Новый"}
                    </span>
                  </td>
                  <td>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!cs.length && <div className="empty">Клиенты не найдены</div>}
        </div>
      </section>
    );
  }
  function promosPage() {
    return (
      <div className="promo-grid">
        {db.promos.map((p) => (
          <div className="card promo-card" key={p.code}>
            <div className="promo-top">
              <div className="promo-icon">
                <TicketPercent size={23} />
              </div>
              <span className={"badge " + (p.active ? "green" : "gray")}>
                {p.active ? "Активен" : "Отключён"}
              </span>
            </div>
            <h2>{p.discount}% скидка</h2>
            <p>На все товары в магазине</p>
            <button
              className="promo-code"
              onClick={() => {
                navigator.clipboard?.writeText(p.code);
                setToast("Промокод скопирован");
              }}
            >
              {p.code}
              <Copy size={16} />
            </button>
            <button
              className="btn full"
              onClick={() => {
                setDB({
                  ...db,
                  promos: db.promos.map((x) =>
                    x.code === p.code ? { ...x, active: !x.active } : x,
                  ),
                });
                setToast(
                  p.active ? "Промокод отключён" : "Промокод активирован",
                );
              }}
            >
              {p.active ? "Отключить" : "Активировать"}
            </button>
          </div>
        ))}
      </div>
    );
  }
  function staffPage() {
    return (
      <section className="card">
        <div className="panel-heading">
          <div>
            <h2>Команда NEXORA</h2>
            <p>
              Демонстрация ролей сотрудников. Реальная авторизация не
              подключена.
            </p>
          </div>
          <span className="count-chip">{db.staff.length}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Сотрудник</th>
                <th>Роль</th>
                <th>Возможности</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {db.staff.map((s, i) => (
                <tr key={s.email}>
                  <td>
                    <div className="person">
                      <span className={"avatar a" + i}>{initials(s.name)}</span>
                      <span>
                        <strong>{s.name}</strong>
                        <small>{s.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={"badge " + (i === 0 ? "blue" : "gray")}>
                      {s.role}
                    </span>
                  </td>
                  <td className="muted">
                    {s.role === "Владелец"
                      ? "Полный доступ"
                      : s.role === "Менеджер"
                        ? "Заказы и клиенты"
                        : "Товары и остатки"}
                  </td>
                  <td>
                    {i > 0 && (
                      <button
                        className="icon-btn"
                        aria-label="Удалить сотрудника"
                        onClick={() => {
                          setDB({
                            ...db,
                            staff: db.staff.filter((x) => x.email !== s.email),
                          });
                          setToast("Сотрудник удалён из демокоманды");
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  const titles: Record<string, [string, string]> = {
    dashboard: [
      "Обзор бизнеса",
      "Всё, что нужно знать о вашем магазине сегодня.",
    ],
    products: ["Товары", "Управляйте ассортиментом и ценами вашего магазина."],
    orders: ["Заказы", "От первой покупки до успешной доставки."],
    customers: ["Клиенты", "Знакомьтесь с теми, кто выбирает NEXORA."],
    inventory: ["Склад", "Держите остатки под контролем."],
    analytics: ["Аналитика", "Превращайте данные в решения для бизнеса."],
    promotions: ["Промокоды", "Дайте покупателям ещё один повод вернуться."],
    staff: ["Сотрудники", "Ваша команда и её роли."],
    settings: ["Настройки", "Настройте рабочее пространство под себя."],
    help: ["Центр помощи", "Как пользоваться NEXORA Commerce."],
  };
  return (
    <>
      {mode === "admin" ? (
        <div className="admin-app">
          <aside className={"sidebar " + (mobile ? "open" : "")}>
            <a
              href="?mode=admin&view=dashboard"
              className="brand"
              onClick={(e) => {
                e.preventDefault();
                go("dashboard", "admin");
              }}
            >
              <span className="brand-mark">N</span>
              <span>
                NEXORA<small>COMMERCE</small>
              </span>
            </a>
            <button className="workspace" onClick={() => setModal("workspace")}>
              <span className="workspace-icon">
                <Store size={19} />
              </span>
              <span>
                <strong>{settings.store}</strong>
                <small>Рабочее пространство</small>
              </span>
              <ChevronDown size={15} />
            </button>
            <div className="nav-label">УПРАВЛЕНИЕ</div>
            <nav>
              {nav.slice(0, 6).map((n) => (
                <button
                  key={n.key}
                  className={page === n.key ? "selected" : ""}
                  onClick={() => go(n.key)}
                >
                  <n.icon size={19} />
                  {n.label}
                  {n.key === "orders" && (
                    <span className="nav-count">
                      {
                        db.orders.filter((o) => o.status === "В обработке")
                          .length
                      }
                    </span>
                  )}
                  {page === n.key && <span className="nav-indicator" />}
                </button>
              ))}
              <div className="nav-label">ИНСТРУМЕНТЫ</div>
              {nav.slice(6).map((n) => (
                <button
                  key={n.key}
                  className={page === n.key ? "selected" : ""}
                  onClick={() => go(n.key)}
                >
                  <n.icon size={19} />
                  {n.label}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="store-callout">
                <span>
                  <span className="live-dot" />
                  ВАШ МАГАЗИН
                </span>
                <strong>Всё готово к продажам</strong>
                <p>
                  Посмотрите на магазин
                  <br />
                  глазами покупателя.
                </p>
                <button onClick={() => go("catalog", "shop")}>
                  Открыть магазин <ArrowUpRight size={15} />
                </button>
              </div>
              <button
                className={page === "settings" ? "selected" : ""}
                onClick={() => go("settings")}
              >
                <Settings size={18} />
                Настройки
              </button>
              <button
                className={page === "help" ? "selected" : ""}
                onClick={() => go("help")}
              >
                <CircleHelp size={18} />
                Помощь и поддержка
              </button>
              <div className="sidebar-profile">
                <span className="avatar profile-avatar">АП</span>
                <span>
                  <strong>Александр Петров</strong>
                  <small>Владелец магазина</small>
                </span>
                <button
                  aria-label="Профиль"
                  onClick={() => setModal("profile")}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </aside>
          {mobile && (
            <div className="mobile-scrim" onClick={() => setMobile(false)} />
          )}
          <div className="main-shell">
            <header className="topbar">
              <div className="breadcrumb">
                <button
                  className="icon-btn mobile-menu"
                  aria-label="Меню"
                  onClick={() => setMobile(true)}
                >
                  <Menu size={21} />
                </button>
                <span>Рабочее пространство</span>
                <ChevronRight size={14} />
                <strong>{titles[page]?.[0] || "Обзор"}</strong>
              </div>
              <div className="top-actions">
                <button
                  className="global-search"
                  onClick={() => setModal("search")}
                >
                  <Search size={17} />
                  <span>Поиск по платформе...</span>
                  <kbd>⌘ K</kbd>
                </button>
                <button
                  className="icon-btn notification-btn"
                  aria-label="Уведомления"
                  onClick={() => setNotifications(!notifications)}
                >
                  <Bell size={19} />
                  <i />
                </button>
                <span className="top-divider" />
                <button
                  className="top-profile"
                  onClick={() => setUserMenu(!userMenu)}
                >
                  <span className="avatar profile-avatar">АП</span>
                  <ChevronDown size={13} />
                </button>
              </div>
              {notifications && (
                <div className="notifications card">
                  <div className="panel-heading">
                    <h2>Уведомления</h2>
                    <button
                      className="icon-btn"
                      aria-label="Закрыть"
                      onClick={() => setNotifications(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      go("orders");
                      setNotifications(false);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>
                      <strong>Заказы ждут обработки</strong>
                      <small>
                        {
                          db.orders.filter((o) => o.status === "В обработке")
                            .length
                        }{" "}
                        заказов · посмотреть
                      </small>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      go("inventory");
                      setNotifications(false);
                    }}
                  >
                    <Warehouse size={18} />
                    <span>
                      <strong>Проверьте остатки</strong>
                      <small>
                        {db.products.filter((p) => p.stock < 10).length} товаров
                        заканчиваются
                      </small>
                    </span>
                  </button>
                </div>
              )}
              {userMenu && (
                <div className="user-dropdown card">
                  <button
                    onClick={() => {
                      setModal("profile");
                      setUserMenu(false);
                    }}
                  >
                    Профиль владельца
                  </button>
                  <button
                    onClick={() => {
                      go("catalog", "shop");
                      setUserMenu(false);
                    }}
                  >
                    Перейти в магазин
                  </button>
                </div>
              )}
            </header>
            <main className="admin-main">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    ВАШ БИЗНЕС ПОД КОНТРОЛЕМ <span>DEMO</span>
                  </div>
                  <h1>
                    {titles[page]?.[0] || "Обзор бизнеса"}
                    {page === "dashboard" && <span className="heading-dot" />}
                  </h1>
                  <p>{titles[page]?.[1]}</p>
                </div>
                <div className="heading-actions">
                  {["dashboard", "analytics"].includes(page) && (
                    <label className="period-select">
                      <CalendarDays size={16} />
                      <select
                        aria-label="Период отчёта"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                      >
                        <option value="30">Последние 30 дней</option>
                        <option value="7">Последние 7 дней</option>
                        <option value="90">Последние 90 дней</option>
                      </select>
                      <ChevronDown size={13} />
                    </label>
                  )}
                  {[
                    "dashboard",
                    "analytics",
                    "orders",
                    "products",
                    "customers",
                    "inventory",
                  ].includes(page) && (
                    <Button onClick={exportCSV}>
                      <Download size={16} />
                      Экспорт
                    </Button>
                  )}
                  {page === "products" && (
                    <Button
                      primary
                      onClick={() => {
                        setSelected(null);
                        setModal("edit");
                      }}
                    >
                      <Plus size={17} />
                      Добавить товар
                    </Button>
                  )}
                  {page === "orders" && (
                    <Button primary onClick={() => go("catalog", "shop")}>
                      <Plus size={17} />
                      Создать заказ
                    </Button>
                  )}
                  {page === "promotions" && (
                    <Button primary onClick={() => setModal("promo")}>
                      <Plus size={17} />
                      Новый промокод
                    </Button>
                  )}
                  {page === "staff" && (
                    <Button primary onClick={() => setModal("staff")}>
                      <Plus size={17} />
                      Добавить сотрудника
                    </Button>
                  )}
                </div>
              </div>
              {page === "dashboard" && dashboard()}
              {page === "products" && productsPage()}
              {page === "inventory" && (
                <>
                  <div className="inventory-summary">
                    <div className="card">
                      <Package size={22} />
                      <span>
                        <small>Товаров на складе</small>
                        <b>
                          {db.products.reduce((s, p) => s + p.stock, 0)} шт.
                        </b>
                      </span>
                    </div>
                    <div className="card">
                      <Warehouse size={22} />
                      <span>
                        <small>Стоимость запасов</small>
                        <b>
                          {money(
                            db.products.reduce(
                              (s, p) => s + p.stock * p.cost,
                              0,
                            ),
                          )}
                        </b>
                      </span>
                    </div>
                    <div className="card">
                      <Bell size={22} />
                      <span>
                        <small>Заканчиваются</small>
                        <b>
                          {db.products.filter((p) => p.stock < 10).length}{" "}
                          товара
                        </b>
                      </span>
                    </div>
                  </div>
                  {productsPage(true)}
                </>
              )}
              {page === "orders" && ordersPage()}
              {page === "customers" && customersPage()}
              {page === "analytics" && (
                <>
                  <Metrics />
                  <div className="charts-grid">
                    <ChartPanel />
                    <CategoryPanel />
                  </div>
                  <div className="card profit-panel">
                    <div>
                      <h2>Валовая прибыль</h2>
                      <p>
                        Выручка минус себестоимость товаров, без операционных
                        расходов.
                      </p>
                    </div>
                    <strong>{money(profit)}</strong>
                    <span className="badge green">
                      Маржа {revenue ? Math.round((profit / revenue) * 100) : 0}
                      %
                    </span>
                  </div>
                </>
              )}
              {page === "promotions" && promosPage()}
              {page === "staff" && staffPage()}
              {page === "settings" && (
                <section className="card settings-card">
                  <h2>Параметры магазина</h2>
                  <p>Настройки демонстрационного рабочего пространства</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      const nextSettings = {
                        store: String(f.get("store")),
                        email: String(f.get("email")),
                      };
                      setSettings(nextSettings);
                      localStorage.setItem(
                        "nexora-settings",
                        JSON.stringify(nextSettings),
                      );
                      setToast("Настройки сохранены");
                    }}
                  >
                    <label>
                      Название магазина
                      <input
                        name="store"
                        defaultValue={settings.store}
                        required
                      />
                    </label>
                    <label>
                      Контактный email
                      <input
                        name="email"
                        type="email"
                        defaultValue={settings.email}
                        required
                      />
                    </label>
                    <label>
                      Валюта
                      <select name="currency">
                        <option>USD — Доллар США</option>
                      </select>
                    </label>
                    <button className="btn primary">Сохранить настройки</button>
                  </form>
                  <div className="demo-info">
                    <ShieldCheck size={20} />
                    <span>
                      Демоверсия использует локальное хранилище браузера.
                      Авторизация, банковский эквайринг и серверная база данных
                      не подключены.
                    </span>
                  </div>
                </section>
              )}
              {page === "help" && (
                <section className="card help-card">
                  <h2>Начните с одного заказа</h2>
                  <p>
                    Откройте магазин, добавьте товар в корзину и оформите
                    тестовую покупку. Заказ появится в CRM, а остаток
                    автоматически уменьшится.
                  </p>
                  {[
                    ["01", "Магазин", "Каталог, фильтры, избранное и корзина."],
                    [
                      "02",
                      "Заказы",
                      "Откройте заказ, чтобы изменить статус. При отмене товар возвращается на склад.",
                    ],
                    [
                      "03",
                      "Товары и склад",
                      "Редактируйте цену, описание, себестоимость и остатки.",
                    ],
                    [
                      "04",
                      "Промокоды",
                      "Создайте скидку и примените её при оформлении покупки.",
                    ],
                  ].map((x) => (
                    <div className="help-step" key={x[0]}>
                      <b>{x[0]}</b>
                      <div>
                        <h3>{x[1]}</h3>
                        <p>{x[2]}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn primary"
                    onClick={() => go("catalog", "shop")}
                  >
                    Попробовать магазин <ArrowRight size={16} />
                  </button>
                </section>
              )}
            </main>
            <footer className="admin-footer">
              <span>© 2026 NEXORA Commerce</span>
              <span>
                <span className="live-dot" />
                Демо рабочего пространства{" "}
                <span className="footer-version">v1.0</span>
              </span>
            </footer>
          </div>
        </div>
      ) : (
        <div className="store-app">
          <div className="store-announcement">
            Технологии, которые вдохновляют.{" "}
            <span>
              Бесплатная доставка от $500 <ArrowRight size={13} />
            </span>
            <button onClick={() => go("dashboard", "admin")}>
              Управление магазином <ArrowUpRight size={14} />
            </button>
          </div>
          <header className="store-header">
            <a
              className="brand"
              href="?mode=shop&view=catalog"
              onClick={(e) => {
                e.preventDefault();
                setShowFavs(false);
                go("catalog", "shop");
              }}
            >
              <span className="brand-mark">N</span>
              <span>
                NEXORA<small>COMMERCE</small>
              </span>
            </a>
            <nav>
              <button
                className={!showFavs ? "active" : ""}
                onClick={() => {
                  setShowFavs(false);
                  setCategory("Все товары");
                }}
              >
                Каталог
              </button>
              <button
                onClick={() => {
                  setCategory("Смартфоны");
                  setShowFavs(false);
                }}
              >
                Смартфоны
              </button>
              <button
                onClick={() => {
                  setCategory("Ноутбуки");
                  setShowFavs(false);
                }}
              >
                Ноутбуки
              </button>
              <button
                onClick={() => {
                  setCategory("Аудио");
                  setShowFavs(false);
                }}
              >
                Аудио
              </button>
            </nav>
            <div className="store-header-actions">
              <button
                className="icon-btn"
                aria-label="Избранное"
                onClick={() => setShowFavs(!showFavs)}
              >
                <Heart size={21} fill={showFavs ? "currentColor" : "none"} />
                {favs.length > 0 && <sup>{favs.length}</sup>}
              </button>
              <button
                className="icon-btn"
                aria-label="Личный кабинет"
                onClick={() => setModal(account ? "account" : "login")}
              >
                <Users size={21} />
              </button>
              <button className="cart-button" onClick={() => setModal("cart")}>
                <ShoppingBag size={19} />
                <span>Корзина</span>
                <b>{cartCount}</b>
              </button>
            </div>
          </header>
          <main className="store-main">
            {!showFavs && (
              <section className="store-hero">
                <div className="hero-copy">
                  <span className="store-kicker">
                    <span className="live-dot" />
                    НОВОЕ ПОКОЛЕНИЕ ТЕХНОЛОГИЙ
                  </span>
                  <h1>
                    Больше возможностей.
                    <br />
                    Каждый день.
                  </h1>
                  <p>
                    Техника, которая меняет привычное.
                    <br />
                    Найдите свою в NEXORA.
                  </p>
                  <button
                    className="btn primary"
                    onClick={() =>
                      document
                        .getElementById("catalog")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Найти своё устройство <ArrowRight size={17} />
                  </button>
                  <span className="hero-note">
                    <ShieldCheck size={15} />
                    Оригинальная техника · Гарантия 12 месяцев
                  </span>
                </div>
                <div className="hero-image">
                  <img
                    src="/assets/macbook.webp"
                    alt="MacBook Pro — ноутбук Apple"
                    width="660"
                    height="470"
                  />
                  <span className="hero-product-label">
                    <small>ДЛЯ ВАШИХ БОЛЬШИХ ИДЕЙ</small>
                    <b>MacBook Pro 14″</b>
                    <span>
                      от $1,999 <ArrowUpRight size={17} />
                    </span>
                  </span>
                </div>
              </section>
            )}
            <div className="store-perks">
              <span>
                <Truck size={20} />
                <b>Бережная доставка</b>
                <small>Бесплатно от $500</small>
              </span>
              <span>
                <ShieldCheck size={20} />
                <b>Только оригиналы</b>
                <small>Гарантия 12 месяцев</small>
              </span>
              <span>
                <CreditCard size={20} />
                <b>Простая оплата</b>
                <small>Тестовый режим</small>
              </span>
              <span>
                <Headphones size={20} />
                <b>Поможем с выбором</b>
                <small>Всё о ваших устройствах</small>
              </span>
            </div>
            <section id="catalog" className="catalog">
              <div className="catalog-heading">
                <div>
                  <div className="eyebrow">ВЫБИРАЙТЕ ЛУЧШЕЕ</div>
                  <h2>
                    {showFavs ? "Ваше избранное" : "Технологии для вашей жизни"}{" "}
                    <span>{storeProducts.length}</span>
                  </h2>
                </div>
                <label className="search-field">
                  <Search size={18} />
                  <input
                    placeholder="Найти устройство…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="catalog-toolbar">
                <div className="category-tabs">
                  {[
                    "Все товары",
                    "Смартфоны",
                    "Ноутбуки",
                    "Аудио",
                    "Часы",
                    "Планшеты",
                  ].map((c) => (
                    <button
                      key={c}
                      className={category === c ? "active" : ""}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Сортировка"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="popular">По популярности</option>
                  <option value="asc">Сначала дешевле</option>
                  <option value="desc">Сначала дороже</option>
                </select>
              </div>
              <div className="store-filters">
                <select
                  aria-label="Бренд"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option>Все бренды</option>
                  {Array.from(new Set(db.products.map((p) => p.brand))).map(
                    (b) => (
                      <option key={b}>{b}</option>
                    ),
                  )}
                </select>
                <label>
                  Цена до {money(maxPrice)}{" "}
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </label>
                {(category !== "Все товары" ||
                  brand !== "Все бренды" ||
                  maxPrice < 2500 ||
                  query) && (
                  <button
                    className="text-btn"
                    onClick={() => {
                      setCategory("Все товары");
                      setBrand("Все бренды");
                      setMaxPrice(2500);
                      setQuery("");
                    }}
                  >
                    Сбросить <X size={14} />
                  </button>
                )}
              </div>
              <div className="product-grid">
                {storeProducts.map((p, i) => (
                  <article className="store-product" key={p.id}>
                    <div className="store-product-image">
                      <button
                        className="product-open"
                        aria-label={"Подробнее о " + p.name}
                        onClick={() => {
                          setSelected(p);
                          setModal("product");
                        }}
                      >
                        <ProductPic p={p} />
                      </button>
                      {i < 2 && (
                        <span className="product-tag">
                          {i === 0 ? "Хит продаж" : "Выбор NEXORA"}
                        </span>
                      )}
                      <button
                        className={
                          "favorite " + (favs.includes(p.id) ? "is-fav" : "")
                        }
                        aria-label={"В избранное: " + p.name}
                        onClick={() =>
                          setFavs(
                            favs.includes(p.id)
                              ? favs.filter((id) => id !== p.id)
                              : [...favs, p.id],
                          )
                        }
                      >
                        <Heart
                          size={18}
                          fill={favs.includes(p.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div className="store-product-info">
                      <span className="product-brand">
                        {p.brand}{" "}
                        <span>
                          ★ 4.9 <small>· демо</small>
                        </span>
                      </span>
                      <button
                        className="product-name"
                        onClick={() => {
                          setSelected(p);
                          setModal("product");
                        }}
                      >
                        {p.name}
                      </button>
                      <p>{p.category} · Официальная гарантия</p>
                      <div className="store-product-bottom">
                        <b>{money(p.price)}</b>
                        <button
                          disabled={p.stock === 0}
                          aria-label={"Добавить в корзину " + p.name}
                          onClick={() => add(p)}
                        >
                          <Plus size={19} />
                        </button>
                      </div>
                      <span
                        className={
                          "availability " + (p.stock === 0 ? "out" : "")
                        }
                      >
                        <i />
                        {p.stock > 0
                          ? "В наличии · " + p.stock + " шт."
                          : "Нет в наличии"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              {!storeProducts.length && (
                <div className="empty">
                  <Search size={30} />
                  <h3>
                    {showFavs
                      ? "Сохраните то, что понравилось"
                      : "Ничего не найдено"}
                  </h3>
                  <p>
                    {showFavs
                      ? "Нажмите на сердечко в карточке товара."
                      : "Попробуйте изменить фильтры или запрос."}
                  </p>
                </div>
              )}
            </section>
            <section className="store-bottom-banner">
              <span className="brand-mark">N</span>
              <div>
                <h2>Хорошая техника. Правильный выбор.</h2>
                <p>NEXORA — всё, что нужно для работы, творчества и жизни.</p>
              </div>
              <button className="btn" onClick={() => setModal("support")}>
                Помочь с выбором <ArrowUpRight size={16} />
              </button>
            </section>
          </main>
          <footer className="store-footer">
            <b>NEXORA COMMERCE</b>
            <span>Демонстрационный магазин. Покупки и оплата — тестовые.</span>
            <button onClick={() => go("dashboard", "admin")}>
              Открыть CRM <ArrowUpRight size={14} />
            </button>
          </footer>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Диалог NEXORA"
            className={
              "modal " +
              (["cart", "order", "customer"].includes(modal) ? "drawer" : "") +
              (modal === "product" ? " product-modal" : "")
            }
          >
            <button
              className="close-modal icon-btn"
              aria-label="Закрыть"
              onClick={() => setModal(null)}
            >
              <X size={21} />
            </button>
            {modal === "cart" && (
              <>
                <span className="eyebrow">NEXORA STORE</span>
                <h2>
                  Ваша корзина <span className="count-chip">{cartCount}</span>
                </h2>
                <p className="muted">Отличный выбор начинается здесь.</p>
                {cart.length ? (
                  <>
                    <div className="cart-items">
                      {cart.map((i) => {
                        const p = db.products.find((p) => p.id === i.id);
                        if (!p) return null;
                        return (
                          <div className="cart-item" key={i.id}>
                            <ProductPic p={p} />
                            <div>
                              <strong>{p.name}</strong>
                              <small>{money(p.price)}</small>
                              <div className="qty">
                                <button
                                  aria-label="Уменьшить количество"
                                  onClick={() => changeQty(i.id, -1)}
                                >
                                  <Minus size={13} />
                                </button>
                                <span>{i.qty}</span>
                                <button
                                  aria-label="Увеличить количество"
                                  onClick={() => changeQty(i.id, 1)}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                            <b>{money(p.price * i.qty)}</b>
                            <button
                              className="icon-btn"
                              aria-label="Удалить из корзины"
                              onClick={() =>
                                setCart(cart.filter((x) => x.id !== i.id))
                              }
                            >
                              <X size={15} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="cart-summary">
                      <div>
                        <span>Товары ({cartCount})</span>
                        <b>{money(totalCart)}</b>
                      </div>
                      <div>
                        <span>Доставка</span>
                        <b>Бесплатно</b>
                      </div>
                      <p className="demo-inline">
                        Демо: доставка и оплата не выполняются.
                      </p>
                      <div className="cart-total">
                        <span>Итого</span>
                        <b>{money(totalCart)}</b>
                      </div>
                      <button
                        className="btn primary full"
                        onClick={() => setModal("checkout")}
                      >
                        Оформить заказ <ArrowRight size={17} />
                      </button>
                      <button
                        className="text-btn full"
                        onClick={() => setModal(null)}
                      >
                        Продолжить покупки
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty">
                    <ShoppingBag size={42} />
                    <h3>Здесь пока пусто</h3>
                    <p>Найдите своё новое любимое устройство.</p>
                    <button
                      className="btn primary"
                      onClick={() => setModal(null)}
                    >
                      Перейти к покупкам
                    </button>
                  </div>
                )}
              </>
            )}
            {modal === "checkout" && (
              <>
                <span className="eyebrow">ПОЧТИ ГОТОВО</span>
                <h2>Оформление заказа</h2>
                <p className="muted">
                  Тестовая покупка. Деньги не списываются.
                </p>
                <form onSubmit={checkout}>
                  <label>
                    Ваше имя
                    <input
                      name="name"
                      defaultValue={account?.name}
                      autoComplete="name"
                      required
                      placeholder="Имя и фамилия"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      defaultValue={account?.email}
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                    />
                  </label>
                  <label>
                    Адрес доставки
                    <input
                      name="address"
                      autoComplete="street-address"
                      required
                      placeholder="Город, улица, дом"
                    />
                  </label>
                  <div className="promo-input">
                    <input
                      aria-label="Промокод"
                      value={promo}
                      onChange={(e) => {
                        setPromo(e.target.value.toUpperCase());
                        setDiscount(0);
                      }}
                      placeholder="Промокод, например NEXORA10"
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        const p = db.promos.find(
                          (p) => p.code === promo && p.active,
                        );
                        if (p) {
                          setDiscount(p.discount);
                          setToast("Скидка " + p.discount + "% применена");
                        } else {
                          setDiscount(0);
                          setToast("Промокод не найден или отключён");
                        }
                      }}
                    >
                      Применить
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="positive">
                      Скидка {discount}%: −{money((totalCart * discount) / 100)}
                    </p>
                  )}
                  <div className="checkout-total">
                    <span>К оплате</span>
                    <b>{money(discountedTotal(totalCart, discount))}</b>
                  </div>
                  <div className="demo-info">
                    <CreditCard size={21} />
                    <span>
                      Симуляция оплаты. Банковские данные не нужны. Заказ
                      появится в CRM.
                    </span>
                  </div>
                  <button className="btn primary full" type="submit">
                    Оформить тестовый заказ <ArrowRight size={17} />
                  </button>
                </form>
              </>
            )}
            {modal === "success" && order && (
              <div className="success">
                <span className="success-icon">
                  <Check size={32} />
                </span>
                <span className="eyebrow">СПАСИБО ЗА ВЫБОР</span>
                <h2>Всё получилось!</h2>
                <p>
                  Тестовый заказ <b>#{order.id}</b> создан.
                  <br />
                  Товары зарезервированы, остатки обновлены.
                </p>
                <div className="success-total">
                  {money(order.total)} <Badge status={order.status} />
                </div>
                <button
                  className="btn primary full"
                  onClick={() => {
                    setModal(null);
                    go("orders", "admin");
                  }}
                >
                  Посмотреть заказ в CRM <ArrowRight size={16} />
                </button>
                <button
                  className="text-btn full"
                  onClick={() => setModal(null)}
                >
                  Вернуться в магазин
                </button>
              </div>
            )}
            {modal === "product" && selected && (
              <div className="product-detail">
                <div className="detail-image">
                  <ProductPic p={selected} />
                </div>
                <div>
                  <span className="eyebrow">
                    {selected.brand} · {selected.category}
                  </span>
                  <h2>{selected.name}</h2>
                  <p>{selected.description}</p>
                  <span className="availability">
                    <i />В наличии:{" "}
                    {db.products.find((p) => p.id === selected.id)?.stock || 0}{" "}
                    шт.
                  </span>
                  <strong className="detail-price">
                    {money(selected.price)}
                  </strong>
                  <button
                    className="btn primary full"
                    disabled={
                      !db.products.find((p) => p.id === selected.id)?.stock
                    }
                    onClick={() =>
                      add(
                        db.products.find((p) => p.id === selected.id) ||
                          selected,
                      )
                    }
                  >
                    <ShoppingBag size={18} />В корзину
                  </button>
                  <div className="detail-perks">
                    <span>
                      <Truck size={17} />
                      Бережная доставка
                    </span>
                    <span>
                      <ShieldCheck size={17} />
                      Гарантия 12 месяцев
                    </span>
                  </div>
                  {mode === "admin" && (
                    <button
                      className="text-btn"
                      onClick={() => setModal("edit")}
                    >
                      <Pencil size={14} />
                      Редактировать товар
                    </button>
                  )}
                </div>
              </div>
            )}
            {modal === "edit" && (
              <>
                <span className="eyebrow">КАТАЛОГ</span>
                <h2>{selected ? "Редактировать товар" : "Новый товар"}</h2>
                <form onSubmit={editProduct} key={selected?.id || "new"}>
                  <label>
                    Название
                    <input name="name" defaultValue={selected?.name} required />
                  </label>
                  <div className="form-row">
                    <label>
                      Бренд
                      <input
                        name="brand"
                        defaultValue={selected?.brand || "Apple"}
                        required
                      />
                    </label>
                    <label>
                      Категория
                      <select name="category" defaultValue={selected?.category}>
                        {[
                          "Смартфоны",
                          "Ноутбуки",
                          "Аудио",
                          "Часы",
                          "Планшеты",
                        ].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    SKU
                    <input name="sku" defaultValue={selected?.sku} required />
                  </label>
                  <div className="form-row">
                    <label>
                      Цена, USD
                      <input
                        name="price"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue={selected?.price}
                        required
                      />
                    </label>
                    <label>
                      Себестоимость, USD
                      <input
                        name="cost"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={selected?.cost || 0}
                        required
                      />
                    </label>
                    <label>
                      Остаток
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={selected?.stock || 0}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Описание
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={selected?.description}
                    />
                  </label>
                  <button className="btn primary full">
                    Сохранить товар <Check size={16} />
                  </button>
                </form>
              </>
            )}
            {modal === "stock" && selected && (
              <>
                <span className="eyebrow">СКЛАДСКОЙ УЧЁТ</span>
                <h2>Обновить остаток</h2>
                <div className="product-cell stock-product">
                  <ProductPic p={selected} />
                  <span>
                    <strong>{selected.name}</strong>
                    <small>{selected.sku}</small>
                  </span>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const n = Number(
                      new FormData(e.currentTarget).get("stock"),
                    );
                    setDB({
                      ...db,
                      products: db.products.map((p) =>
                        p.id === selected.id ? { ...p, stock: n } : p,
                      ),
                    });
                    setModal(null);
                    setToast("Остаток обновлён");
                  }}
                >
                  <label>
                    Количество на складе
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      required
                      defaultValue={selected.stock}
                    />
                  </label>
                  <button className="btn primary full">
                    Сохранить остаток
                  </button>
                </form>
              </>
            )}
            {modal === "order" && order && (
              <>
                <span className="eyebrow">ДЕТАЛИ ЗАКАЗА</span>
                <h2>#{order.id}</h2>
                <div className="order-detail-meta">
                  <span>
                    {date(order.date)} ·{" "}
                    {new Date(order.date).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Tashkent",
                    })}
                  </span>
                  <Badge status={order.status} />
                </div>
                <div className="order-detail-block">
                  <h3>Клиент</h3>
                  <div className="person">
                    <span className="avatar a0">{initials(order.name)}</span>
                    <span>
                      <strong>{order.name}</strong>
                      <small>{order.email}</small>
                    </span>
                  </div>
                  {order.address && <p>{order.address}</p>}
                </div>
                <div className="order-detail-block">
                  <h3>Товары</h3>
                  {order.items.map((i, j) => {
                    const p = db.products.find((p) => p.id === i.id);
                    return (
                      <div className="order-line" key={j}>
                        {p && <ProductPic p={p} />}
                        <span>
                          <strong>{p?.name || "Товар"}</strong>
                          <small>
                            {i.qty} шт. × {money(i.price)}
                          </small>
                        </span>
                        <b>{money(i.qty * i.price)}</b>
                      </div>
                    );
                  })}
                </div>
                <div className="checkout-total">
                  <span>Итого</span>
                  <b>{money(order.total)}</b>
                </div>
                <label className="status-select">
                  Статус заказа
                  <select
                    value={order.status}
                    onChange={(e) => statusChange(order, e.target.value)}
                  >
                    {[
                      "В обработке",
                      "Оплачен",
                      "Отправлен",
                      "Доставлен",
                      "Отменён",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <p className="demo-inline">
                  При отмене заказа товары автоматически возвращаются на склад.
                </p>
              </>
            )}
            {modal === "customer" && order && (
              <>
                <span className="eyebrow">КАРТОЧКА КЛИЕНТА</span>
                <h2>{order.name}</h2>
                <p className="muted">{order.email}</p>
                <div className="customer-total">
                  <small>Общая сумма покупок</small>
                  <strong>
                    {money(
                      customerList.find((c) => c.email === order.email)
                        ?.total || 0,
                    )}
                  </strong>
                </div>
                <h3>История покупок</h3>
                {db.orders
                  .filter((o) => o.email === order.email)
                  .map((o) => (
                    <button
                      className="customer-order"
                      key={o.id}
                      onClick={() => {
                        setOrder(o);
                        setModal("order");
                      }}
                    >
                      <span>
                        <b>#{o.id}</b>
                        <small>{date(o.date)}</small>
                      </span>
                      <Badge status={o.status} />
                      <b>{money(o.total)}</b>
                      <ChevronRight size={15} />
                    </button>
                  ))}
              </>
            )}
            {modal === "promo" && (
              <>
                <span className="eyebrow">ПРОДВИЖЕНИЕ</span>
                <h2>Новый промокод</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    const code = String(f.get("code")).trim().toUpperCase();
                    if (db.promos.some((p) => p.code === code)) {
                      setToast("Такой промокод уже существует");
                      return;
                    }
                    setDB({
                      ...db,
                      promos: [
                        ...db.promos,
                        {
                          code,
                          discount: Number(f.get("discount")),
                          active: true,
                        },
                      ],
                    });
                    setModal(null);
                    setToast("Промокод создан");
                  }}
                >
                  <label>
                    Код
                    <input
                      name="code"
                      pattern="[A-Za-z0-9]{3,20}"
                      placeholder="NEXORA20"
                      required
                      title="От 3 до 20 латинских букв и цифр"
                    />
                  </label>
                  <label>
                    Скидка, %
                    <input
                      name="discount"
                      type="number"
                      min="1"
                      max="90"
                      defaultValue="10"
                      required
                    />
                  </label>
                  <button className="btn primary full">Создать промокод</button>
                </form>
              </>
            )}
            {modal === "staff" && (
              <>
                <span className="eyebrow">КОМАНДА</span>
                <h2>Добавить сотрудника</h2>
                <p className="muted">
                  Демонстрация списка команды. Письмо не отправляется.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    if (db.staff.some((s) => s.email === f.get("email"))) {
                      setToast("Сотрудник с таким email уже добавлен");
                      return;
                    }
                    setDB({
                      ...db,
                      staff: [
                        ...db.staff,
                        {
                          name: String(f.get("name")),
                          email: String(f.get("email")),
                          role: String(f.get("role")),
                        },
                      ],
                    });
                    setModal(null);
                    setToast("Сотрудник добавлен в демокоманду");
                  }}
                >
                  <label>
                    Имя и фамилия
                    <input name="name" required />
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" required />
                  </label>
                  <label>
                    Роль
                    <select name="role">
                      <option>Менеджер</option>
                      <option>Кладовщик</option>
                    </select>
                  </label>
                  <button className="btn primary full">
                    Добавить сотрудника
                  </button>
                </form>
              </>
            )}
            {modal === "login" && (
              <>
                <span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
                <h2>Рады знакомству</h2>
                <p className="muted">
                  Создайте локальный демопрофиль для тестовых покупок.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    setAccount({
                      name: String(f.get("name")),
                      email: String(f.get("email")),
                    });
                    setModal("account");
                    setToast("Демопрофиль сохранён");
                  }}
                >
                  <label>
                    Имя
                    <input name="name" autoComplete="name" required />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <div className="demo-info">
                    <ShieldCheck size={20} />
                    <span>
                      Это демопрофиль без пароля. Не используйте реальные
                      персональные данные.
                    </span>
                  </div>
                  <button className="btn primary full">Продолжить</button>
                </form>
              </>
            )}
            {modal === "account" && account && (
              <>
                <span className="eyebrow">ВАШ ПРОФИЛЬ</span>
                <h2>Здравствуйте, {account.name.split(" ")[0]}</h2>
                <p className="muted">{account.email}</p>
                <h3>Ваши тестовые заказы</h3>
                {db.orders.filter((o) => o.email === account.email).length ? (
                  db.orders
                    .filter((o) => o.email === account.email)
                    .map((o) => (
                      <div className="customer-order" key={o.id}>
                        <span>
                          <b>#{o.id}</b>
                          <small>{date(o.date)}</small>
                        </span>
                        <Badge status={o.status} />
                        <b>{money(o.total)}</b>
                      </div>
                    ))
                ) : (
                  <div className="empty">У вас пока нет покупок</div>
                )}
                <button
                  className="btn full"
                  onClick={() => {
                    setAccount(null);
                    setModal(null);
                  }}
                >
                  <LogOut size={16} />
                  Выйти из демопрофиля
                </button>
              </>
            )}
            {modal === "search" && (
              <>
                <span className="eyebrow">БЫСТРЫЙ ПЕРЕХОД</span>
                <h2>Поиск по платформе</h2>
                <label className="search-field modal-search">
                  <Search size={19} />
                  <input
                    autoFocus
                    placeholder="Товар, заказ или раздел…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="search-results">
                  {nav
                    .filter((n) =>
                      n.label.toLowerCase().includes(query.toLowerCase()),
                    )
                    .map((n) => (
                      <button
                        key={n.key}
                        onClick={() => {
                          go(n.key);
                          setModal(null);
                        }}
                      >
                        <n.icon size={18} />
                        {n.label}
                        <ArrowRight size={15} />
                      </button>
                    ))}
                  {query &&
                    db.products
                      .filter((p) =>
                        p.name.toLowerCase().includes(query.toLowerCase()),
                      )
                      .slice(0, 4)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelected(p);
                            setModal("product");
                          }}
                        >
                          <Package size={18} />
                          {p.name}
                          <span>{money(p.price)}</span>
                        </button>
                      ))}
                  {query &&
                    db.orders
                      .filter((o) =>
                        (o.id + " " + o.name)
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .slice(0, 4)
                      .map((o) => (
                        <button
                          key={o.id}
                          onClick={() => {
                            setOrder(o);
                            setModal("order");
                          }}
                        >
                          <ShoppingBag size={18} />
                          {o.id} · {o.name}
                        </button>
                      ))}
                </div>
              </>
            )}
            {modal === "profile" && (
              <>
                <span className="avatar profile-avatar large">АП</span>
                <h2>Александр Петров</h2>
                <p className="muted">alex@nexora.store</p>
                <span className="badge blue">Владелец магазина</span>
                <div className="demo-info">
                  Демопрофиль администратора. Все разделы доступны для
                  знакомства с платформой.
                </div>
                <button
                  className="btn primary full"
                  onClick={() => {
                    go("settings");
                    setModal(null);
                  }}
                >
                  Настройки рабочего пространства
                </button>
              </>
            )}
            {modal === "workspace" && (
              <>
                <span className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</span>
                <h2>Nexora Store</h2>
                <p className="muted">
                  Электроника для работы, творчества и жизни.
                </p>
                <div className="workspace-stats">
                  <span>
                    <b>{db.products.length}</b>товаров
                  </span>
                  <span>
                    <b>{db.orders.length}</b>заказов
                  </span>
                  <span>
                    <b>{customerList.length}</b>клиентов
                  </span>
                </div>
                <button
                  className="btn primary full"
                  onClick={() => {
                    go("catalog", "shop");
                    setModal(null);
                  }}
                >
                  Перейти в магазин <ArrowUpRight size={16} />
                </button>
              </>
            )}
            {modal === "support" && (
              <>
                <span className="eyebrow">ВАШ ГИД ПО ТЕХНОЛОГИЯМ</span>
                <h2>Найдите своё устройство</h2>
                <p className="muted">
                  Выберите, что для вас важно, и мы покажем подходящие товары.
                </p>
                <div className="support-options">
                  {[
                    ["Работа и учёба", "Ноутбуки", Laptop],
                    ["Фото и общение", "Смартфоны", Smartphone],
                    ["Музыка и тишина", "Аудио", Headphones],
                    ["Здоровье и активность", "Часы", Watch],
                  ].map(([l, c, I]) => {
                    const Icon = I as typeof Laptop;
                    return (
                      <button
                        className="btn"
                        key={String(c)}
                        onClick={() => {
                          setCategory(String(c));
                          setModal(null);
                          document
                            .getElementById("catalog")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <Icon size={22} />
                        {String(l)}
                        <ArrowRight size={16} />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
