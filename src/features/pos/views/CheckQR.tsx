import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { transactionsService } from '@core/services/pos';
import { Badge } from '@features/_global/components/Badge';
import { TransactionLookupModel } from '@core/model/transaction';

export const CheckQR: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>(searchParams.get('invoice') || searchParams.get('qr') || '');
  const [data, setData] = useState<TransactionLookupModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const format = useMemo(() => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }), []);

  const runLookup = async (q?: string) => {
    const raw = q ?? input;
    if (!raw) return;
    setLoading(true);
    setError(null);
    try {
      const isQr = raw.includes(':');
      const res = await transactionsService.lookup(isQr ? { qr: raw } : { invoice: raw });
      setData(res?.data as TransactionLookupModel);
      setSearchParams(isQr ? { qr: raw } : { invoice: raw });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lookup gagal');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const iv = searchParams.get('invoice');
    const qr = searchParams.get('qr');
    if (iv || qr) {
      runLookup(iv || qr || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Check QR / Invoice</h1>
        <p className="text-slate-500 text-sm">Masukkan string QR lengkap (sc-pos:tx:INV-...) atau nomor invoice.</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex gap-3">
          <input className="border p-2 rounded flex-1" placeholder="QR atau Invoice" value={input} onChange={e=>setInput(e.target.value)} />
          <button onClick={()=>runLookup()} disabled={loading} className="bg-blue-600 hover:bg-blue-700 transition text-white rounded px-4">{loading? 'Mengecek...' : 'Cek'}</button>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>

      {data && (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">{data.invoice}</div>
            <Badge variant={data.status === 'PICKED_UP' ? 'success' : data.status === 'CREATED' ? 'warning' : 'secondary'} size="sm">{data.status}</Badge>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-slate-500">Rak</div>
              <div className="font-medium">{data.rack?.code || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Harga</div>
              <div>{format.format(data.price)} → <span className="font-semibold">{format.format(data.finalPrice)}</span> {data.promoApplied && <Badge variant="success" size="sm" className="ml-2">Promo 10x</Badge>}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Customer</div>
              <div>{data.customerName || '-'} <span className="text-slate-500">({data.customerEmail || '-'})</span></div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Dibuat</div>
              <div>{new Date(data.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Tracking Status</div>
            <div className="space-y-2">
              {data.history?.length ? data.history.map((h) => (
                <div key={h.id} className="text-sm flex items-center gap-2">
                  <Badge size="sm" variant={h.newStatus === 'PICKED_UP' ? 'success' : h.newStatus === 'READY_FOR_PICKUP' ? 'primary' : h.newStatus === 'IN_PROGRESS' ? 'warning' : 'secondary'}>{h.newStatus}</Badge>
                  <span className="text-slate-600">{new Date(h.changedAt).toLocaleString()}</span>
                  {h.note && <span className="text-slate-500">- {h.note}</span>}
                </div>
              )) : <div className="text-sm text-slate-500">Belum ada histori.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
