import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionsService } from '@core/services/pos';
import { TransactionTimeline } from '../components/TransactionTimeline';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';
import { TransactionLookupModel } from '@core/model/transaction';

export const TransactionDetail: React.FC = () => {
  const { invoice } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<TransactionLookupModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const format = useMemo(() => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }), []);

  useEffect(() => {
    const run = async () => {
      if (!invoice) return;
      setLoading(true);
      setError(null);
      try {
        const res = await transactionsService.lookup({ invoice });
        setData(res?.data as TransactionLookupModel);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Gagal memuat detail');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [invoice]);

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detail Transaksi</h1>
          <div className="text-slate-500 text-sm">Invoice #{data.invoice}</div>
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">Kembali</button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <div>
            <div className="text-slate-500 text-sm">Name</div>
            <div className="font-medium">{data.customerName || '-'}</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Email</div>
            <div className="font-medium">{data.customerEmail || '-'}</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Phone Number</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Transaction At</div>
            <div className="font-medium">{new Date(data.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Transaction ID / Code</div>
            <div className="font-medium">{String(data.id).slice(0,8)}... / {data.invoice}</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Status</div>
            <div className="font-medium"><TransactionStatusBadge status={data.status} /></div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Payment Method</div>
            <div className="font-medium">-</div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Total Price</div>
            <div className="font-semibold">{format.format(data.finalPrice ?? data.price)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="font-semibold mb-3">Progress</div>
        <TransactionTimeline status={data.status} />
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="font-semibold mb-3">Items</div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {data.items?.map((it) => (
            <div key={it.id} className="border border-slate-100 rounded-lg p-3 flex gap-3 items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">Foto</div>
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-slate-500">Nomor Rak: {data.rack?.code || '-'}</div>
                <div className="text-sm">Harga: <span className="font-medium">{format.format(it.lineTotal ?? (it.unitPrice * (it.qty||1)))}</span></div>
                <div className="text-xs text-slate-500">Estimasi: -</div>
              </div>
            </div>
          ))}
          {!data.items?.length && <div className="text-sm text-slate-500">Belum ada item.</div>}
        </div>
      </div>
    </div>
  );
};
