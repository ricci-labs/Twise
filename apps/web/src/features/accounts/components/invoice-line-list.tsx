import { Link } from '@tanstack/react-router'
import { InvoiceLine } from '@web/components/finance/invoice-line'
import type { InvoiceLineListProps } from '@web/features/accounts/accounts.types'

export function InvoiceLineList({ workspaceId, lines }: InvoiceLineListProps) {
  return (
    <ul className="rounded-lg border border-border bg-surface px-3">
      {lines.map((line) => (
        <InvoiceLine
          key={line.key}
          date={line.date}
          description={line.description}
          icon={line.icon}
          installment={line.installment}
          detail={line.detail}
          amountCents={line.amountCents}
          isPayment={line.isPayment}
          link={
            <Link
              to="/w/$workspaceId/entries/$entry"
              params={{ workspaceId, entry: line.entryId }}
            />
          }
        />
      ))}
    </ul>
  )
}
