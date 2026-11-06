import { cva } from 'class-variance-authority'

export const invoiceLineVariants = cva('border-border not-first:border-t')

export const invoiceLineMainVariants = cva(
  'flex min-h-15 items-center gap-2.5 py-2 text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-ring [&>[data-slot=category-art]]:-m-0.5',
)

export const invoiceLineDateVariants = cva(
  'w-10 shrink-0 text-fine font-semibold text-ink-muted tabular-nums',
)

export const invoiceLineTextVariants = cva('flex min-w-0 flex-1 flex-col')

export const invoiceLineNameVariants = cva(
  'flex min-w-0 items-center gap-1.5 text-choice font-semibold [&>span:first-child]:line-clamp-2 [&>span:first-child]:min-w-0 [&>span:first-child]:break-words',
)

export const invoiceLineInstallmentVariants = cva(
  'inline-flex h-5 shrink-0 items-center rounded-full bg-sunken px-1.75 text-tab font-semibold text-ink-muted tabular-nums',
)

export const invoiceLineDetailVariants = cva('line-clamp-2 text-fine break-words text-ink-muted')

export const invoiceLineValueVariants = cva(
  'shrink-0 text-choice font-bold whitespace-nowrap tabular-nums',
  {
    variants: {
      isPayment: {
        true: 'text-success',
        false: '',
      },
    },
    defaultVariants: { isPayment: false },
  },
)
