import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={2} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
