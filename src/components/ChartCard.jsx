import { Card, CardContent, Typography } from '@mui/material'
import { motion } from 'framer-motion'

const ChartCard = ({ title, subtitle, children, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="rounded-2xl! shadow-sm! border border-slate-100">
      <CardContent className="p-5!">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h6" className="font-[Poppins]! font-semibold! text-slate-900!">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  </motion.div>
)

export default ChartCard
