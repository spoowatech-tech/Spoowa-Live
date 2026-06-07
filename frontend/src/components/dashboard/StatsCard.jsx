import { motion } from "framer-motion";

/**
 * Redesigned KPI stats card matching NIRVI admin panel style.
 * White card, top label, large number, icon in top-right, optional trend line.
 */
export default function StatsCard({ label, value, description, trend, icon: Icon, colorClass, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-none">{label}</span>
        {Icon && (
          <div className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#FFF8E8] group-hover:border-[#F4B000]/20 transition-colors">
            <Icon className="h-4 w-4 text-gray-400 group-hover:text-[#D88A00] transition-colors" />
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-[#2B1D12] leading-none tracking-tight">{value}</p>
      {description && (
        <p className="mt-2 text-[11px] font-medium text-gray-400 leading-snug">{description}</p>
      )}
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TREND</span>
          <span className="text-[11px] font-semibold text-gray-500">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}
