import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://talentlink-1-bbse.onrender.com/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

// ── BADGE DE ESTADO ───────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    PENDING:   "bg-yellow-400/20 border-yellow-400/40 text-yellow-300",
    ACCEPTED:  "bg-green-400/20  border-green-400/40  text-green-300",
    REJECTED:  "bg-red-400/20    border-red-400/40    text-red-300",
    COMPLETED: "bg-blue-400/20   border-blue-400/40   text-blue-300",
  };
  const labels = {
    PENDING:   "⏳ Pendiente",
    ACCEPTED:  "✅ Aceptada",
    REJECTED:  "❌ Rechazada",
    COMPLETED: "🏁 Completada",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles[status] || "bg-white/10 text-white"}`}>
      {labels[status] || status}
    </span>
  );
}

// ── ORDER CARD ────────────────────────────────────────────────────
function OrderCard({ order, type, onUpdate }) {
  const isSales = type === "sales";
  const [acting, setActing] = useState(false);

  const handleAction = async (status) => {
    setActing(true);
    try {
      const token = getToken();
      await axios.patch(`${API}/orders/${order.id}/status`, null, {
        params: { status },
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(order.id, status);
    } catch (err) {
      alert(err?.response?.data?.message || "Error actualizando orden");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-3 hover:border-white/30 transition">

      {/* fila superior */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-white truncate">
            {order.skillTitle || "Servicio sin título"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isSales
              ? `Solicitado por: ${order.buyerName}`
              : `Vendedor: ${order.sellerName}`}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* mensaje */}
      {order.message && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Mensaje</p>
          <p className="text-sm text-gray-300 leading-relaxed">{order.message}</p>
        </div>
      )}

      {/* meta */}
      <div className="flex items-center gap-3 flex-wrap">
        {order.price > 0 && (
          <span className="text-green-300 text-xs font-semibold">
            💰 ${Number(order.price).toLocaleString("es-CO")}
          </span>
        )}
        {order.createdAt && (
          <span className="text-gray-500 text-xs">
            🕐 {new Date(order.createdAt).toLocaleDateString("es-CO", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
        )}
      </div>

      {/* acciones vendedor: aceptar / rechazar */}
      {isSales && order.status === "PENDING" && (
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => handleAction("ACCEPTED")}
            disabled={acting}
            className="flex-1 py-2 rounded-xl bg-green-400 text-black text-xs font-bold hover:scale-[1.02] transition disabled:opacity-40"
          >
            Aceptar
          </button>
          <button
            onClick={() => handleAction("REJECTED")}
            disabled={acting}
            className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:scale-[1.02] transition disabled:opacity-40"
          >
            Rechazar
          </button>
        </div>
      )}

      {/* acción comprador: marcar completada */}
      {!isSales && order.status === "ACCEPTED" && (
        <button
          onClick={() => handleAction("COMPLETED")}
          disabled={acting}
          className="py-2 rounded-xl bg-blue-400 text-black text-xs font-bold hover:scale-[1.02] transition disabled:opacity-40"
        >
          Marcar como completada
        </button>
      )}
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────
export default function ListOrder() {
  const [tab,       setTab]       = useState("purchases");
  const [purchases, setPurchases] = useState([]);
  const [sales,     setSales]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const token = getToken();
    Promise.all([
      axios.get(`${API}/orders/purchases`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/orders/sales`,     { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([buyRes, sellRes]) => {
        setPurchases(buyRes.data  || []);
        setSales(sellRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = (id, status) => {
    const patch = (list) => list.map((o) => (o.id === id ? { ...o, status } : o));
    setPurchases(patch);
    setSales(patch);
  };

  const data = tab === "purchases" ? purchases : sales;

  // contadores para badges
  const pendingSales = sales.filter((o) => o.status === "PENDING").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-yellow-500 flex items-center justify-center">
        <p className="text-white animate-pulse text-lg">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 text-white relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950 to-yellow-500 opacity-90 -z-10" />

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-1">
            Mis <span className="text-yellow-400">Órdenes</span>
          </h1>
          <p className="text-gray-300 text-sm">Gestiona tus solicitudes enviadas y recibidas</p>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab("purchases")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "purchases"
                ? "bg-yellow-400 text-black shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            🛒 Enviadas
            {purchases.length > 0 && (
              <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {purchases.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab("sales")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition relative ${
              tab === "sales"
                ? "bg-green-400 text-black shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            📥 Recibidas
            {sales.length > 0 && (
              <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {sales.length}
              </span>
            )}
            {/* badge de pendientes */}
            {pendingSales > 0 && tab !== "sales" && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {pendingSales}
              </span>
            )}
          </button>
        </div>

        {/* CONTENT */}
        {data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{tab === "purchases" ? "🛒" : "📭"}</p>
            <p className="text-gray-400 text-sm">
              {tab === "purchases"
                ? "Aún no has enviado ninguna solicitud."
                : "Aún no has recibido solicitudes."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((o) => (
              <OrderCard key={o.id} order={o} type={tab} onUpdate={updateOrder} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}