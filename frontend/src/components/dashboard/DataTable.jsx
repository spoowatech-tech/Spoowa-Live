import { motion } from "framer-motion";

/**
 * Reusable data table for dashboards — clean white card style.
 */
export default function DataTable({ title, subtitle, columns, data, emptyMessage = "No data yet", actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden"
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && <h3 className="text-base font-black text-[#2B1D12] leading-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] font-medium text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      {data.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full text-left text-sm font-medium border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className || 'text-xs font-medium text-gray-600'}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
