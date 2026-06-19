import Modal from '../Modal'
import DataTable from '../DataTable'
import { formatCurrency, formatDate, displayValue } from '../../utils/helpers'
import MonthlyPaymentStatusBadge from './MonthlyPaymentStatusBadge'

/** API: GET /monthly-payments/:id/history */
const PaymentHistoryModal = ({ open, onClose, tenant }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={`Payment History — ${tenant?.customerName || ''}`}
    maxWidth="md"
  >
    {tenant && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Room', tenant.roomNumber],
            ['Monthly Rent', formatCurrency(tenant.monthlyRent)],
            ['Due Day', `${tenant.dueDay}${tenant.dueDay === 1 ? 'st' : 'th'} of month`],
            ['Last Paid', displayValue(tenant.lastPaidMonth)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 px-3 py-2.5 border border-slate-100">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        <DataTable
          columns={[
            { field: 'month', headerName: 'Month', minWidth: 140 },
            { field: 'amount', headerName: 'Amount', minWidth: 100, renderCell: (row) => formatCurrency(row.amount) },
            {
              field: 'paidDate',
              headerName: 'Paid Date',
              minWidth: 120,
              renderCell: (row) => (row.paidDate ? formatDate(row.paidDate) : 'Not Paid'),
            },
            {
              field: 'status',
              headerName: 'Status',
              minWidth: 100,
              renderCell: (row) => <MonthlyPaymentStatusBadge status={row.status === 'paid' ? 'paid' : 'pending'} />,
            },
            {
              field: 'paymentMode',
              headerName: 'Mode',
              minWidth: 110,
              renderCell: (row) => displayValue(row.paymentMode),
            },
          ]}
          rows={tenant.paymentHistory || []}
        />
      </div>
    )}
  </Modal>
)

export default PaymentHistoryModal
