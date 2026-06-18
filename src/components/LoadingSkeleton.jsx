import { Skeleton, Box } from '@mui/material'

export const StatCardSkeleton = () => (
  <Box className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
    <Skeleton variant="circular" width={48} height={48} />
    <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
    <Skeleton variant="text" width="40%" />
  </Box>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <Box className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant="rounded" height={56} />
    ))}
  </Box>
)

export const ChartSkeleton = () => (
  <Box className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="rounded" height={280} sx={{ mt: 2 }} />
  </Box>
)

export default StatCardSkeleton
