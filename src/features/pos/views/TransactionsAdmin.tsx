import React, { useEffect, useMemo, useState } from 'react';
import { racksService, transactionsService } from '@core/services/pos';
import { Badge } from "@features/_global/components/Badge";

export const TransactionsAdmin: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [racks, setRacks] = useState<any[]>([]);
  const [form, setForm] = useState<{rackId: string; price: number; customerEmail?: string}>({ rackId: '', price: 0, customerEmail: '' });
  const [loading, setLoading] = useState(false);
  const [scanQr, setScanQr] = useState('');

  const load = async () => {
    const res = await transactionsService.listAll();
    // @ts-ignore
    setItems(res?.data || res);
    const rc = await racksService.list();
    // @ts-ignore
    setRacks((rc?.data || rc).filter((r:any)=>r.status==='AVAILABLE'));
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await transactionsService.create(form); await load(); setForm({ rackId: '', price: 0, customerEmail: '' }); } finally { setLoading(false); }
  };

  const scan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await transactionsService.scan({ qr: scanQr }); await load(); setScanQr(''); } finally { setLoading(false); }
  };

  const format = useMemo(() => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }), []);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaksi (Admin)</h1>
          <p className="text-slate-500 text-sm">Buat transaksi baru dan konfirmasi pengambilan menggunakan QR.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <form onSubmit={create} className="grid md:grid-cols-5 grid-cols-1 gap-3">
          <select className="border p-2 rounded" value={form.rackId} onChange={e=>setForm({...form, rackId: e.target.value})} required>
            <option value="">Pilih Rak (Available)</option>
            {racks.map((r:any)=> <option key={r.id} value={r.id}>{r.code} - {r.name||'-'}</option>)}
          </select>
          <input className="border p-2 rounded" type="number" placeholder="Harga" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} required />
          <input className="border p-2 rounded" placeholder="Email Customer (opsional)" value={form.customerEmail} onChange={e=>setForm({...form, customerEmail: e.target.value})} />
          <div className="md:col-span-2 flex items-center"><button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded p-2">{loading? 'Menyimpan...' : 'Buat Transaksi'}</button></div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <form onSubmit={scan} className="grid md:grid-cols-6 grid-cols-1 gap-3">
          <input className="border p-2 rounded md:col-span-5" placeholder="Scan/Tempel QR String (contoh: sc-pos:tx:INV-...)" value={scanQr} onChange={e=>setScanQr(e.target.value)} />
          <button disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 transition text-white rounded p-2">{loading? 'Memproses...' : 'Konfirmasi Ambil'}</button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-0 border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Invoice</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Customer</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Rak</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Harga</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Final</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Promo</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Status</th>
                <th className="p-3 text-left text-sm font-medium text-slate-600">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t:any)=> (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.invoice}</td>
                  <td className="p-3">{t.customer?.email || '-'}</td>
                  <td className="p-3">{t.rack?.code}</td>
                  <td className="p-3">{format.format(t.price)}</td>
                  <td className="p-3">{format.format(t.finalPrice)}</td>
                  <td className="p-3">{t.promoApplied? <Badge variant="success" size="sm">Gratis</Badge> : '-'}</td>
                  <td className="p-3">
                    <Badge variant={t.status === 'PICKED_UP' ? 'success' : t.status === 'CREATED' ? 'warning' : 'secondary'} size="sm">{t.status}</Badge>
                  </td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
