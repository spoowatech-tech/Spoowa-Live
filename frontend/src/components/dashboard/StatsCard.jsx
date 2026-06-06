import { motion } from "framer-motion";

/**
 * Reusable KPI stats card for dashboards.
 */
export default function StatsCard({ label, value, description, icon: Icon, colorClass = "from-amber-50 to-amber-100/50 border-amber-200/25", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`rounded-3xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">{label}</span>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      <p className="text-display text-3xl font-black text-gray-900 leading-none mt-4">{value}</p>
      {description && (
        <p className="mt-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{description}</p>
      )}
    </motion.div>
  );
}
