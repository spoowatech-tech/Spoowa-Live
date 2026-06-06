import { motion } from "framer-motion";

/**
 * Reusable data table for dashboards.
 */
export default function DataTable({ title, subtitle, columns, data, emptyMessage = "No data yet" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white border border-gray-150 rounded-[36px] p-6 sm:p-8 shadow-sm overflow-hidden"
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {subtitle && <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">{subtitle}</span>}
          {title && <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight">{title}</h3>}
        </div>
      )}

      {data.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-400 font-semibold">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-medium border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FFFDF7]">
                {columns.map((col, i) => (
                  <th key={col.key} className={`px-5 py-4 font-black text-gray-800 text-xs uppercase tracking-wider ${i === 0 ? 'rounded-l-2xl' : ''} ${i === columns.length - 1 ? 'rounded-r-2xl' : ''}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 ${col.className || 'text-xs font-semibold text-gray-600'}`}>
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
