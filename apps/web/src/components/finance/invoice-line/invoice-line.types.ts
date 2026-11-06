import type { ReactElement, ReactNode } from 'react'

export type InvoiceLineLinkProps = {
  className?: string
  children?: ReactNode
}

export type InvoiceLineProps = {
  date: string
  description: string
  icon: string | null
  installment?: string
  detail?: string
  amountCents: number
  isPayment?: boolean
  link?: ReactElement<InvoiceLineLinkProps>
}
