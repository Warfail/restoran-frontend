import { Printer, ArrowRight, Store } from "lucide-react";

export default function SuccessPaymentModal({ 
  isOpen, 
  onClose, 
  onNext, 
  table, 
  amount, 
  paymentMethod,
  bank = "BCA",
  referenceNumber = "123456",
  progress = 62
}) {
  if (!isOpen) return null;

  const isCash = paymentMethod === "cash";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pt-20 pb-8 px-8 flex flex-col items-center relative">
        
        {/* Floating Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="36" height="28" rx="4" fill="white" fillOpacity="0.95" />
                <path d="M10 20h24M10 26h16" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M36 30l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="42" cy="36" r="5" fill="white" />
                <path d="M39.5 36l1.5 1.5 3-3" stroke="#e53935" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2.5 border-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-gray-900 text-lg font-semibold text-center mb-5">
          {isCash ? "Pembayaran Tunai Berhasil" : "Pembayaran Kartu Berhasil"}
        </h2>

        {/* Info Card */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
          {isCash ? (
            <div className="text-gray-700 text-sm leading-relaxed">
              Transaksi <span className="font-semibold text-gray-900">{table}</span> sebesar{' '}
              <span className="font-semibold text-green-600">Rp {amount.toLocaleString()}</span> telah berhasil dikonfirmasi.
            </div>
          ) : (
            <>
              <div className="text-gray-700 text-sm leading-relaxed mb-2.5">
                Transaksi <span className="font-semibold text-gray-900">{table}</span> sebesar{' '}
                <span className="font-semibold text-green-600">Rp {amount.toLocaleString()}</span> via Debit {bank} berhasil dibukukan dengan nomor referensi {referenceNumber}.
              </div>
              <div className="flex items-start gap-2.5 text-gray-700 text-sm">
                <Printer className="w-4.5 h-4.5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span>Struk belanja sedang dicetak dan pesanan otomatis diteruskan ke monitor dapur.</span>
              </div>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3 mb-5">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 bg-white hover:bg-gray-50 transition"
          >
            <Printer className="w-4.5 h-4.5 text-gray-700" />
            <span className="text-gray-700 text-sm font-medium">Cetak Ulang Struk</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 rounded-xl py-3 hover:bg-red-700 transition"
          >
            <span className="text-white text-sm font-semibold">Lanjut ke Antrean Berikutnya</span>
            <ArrowRight className="w-4.5 h-4.5 text-white" />
          </button>
        </div>

        {/* Progress Bar (untuk debit) */}
        {!isCash && (
          <div className="w-full">
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}