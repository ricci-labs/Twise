import { Amount } from '@web/components/display/amount'
import { CategoryArt } from '@web/components/display/category-art'
import type { InvoiceLineProps } from '@web/components/finance/invoice-line/invoice-line.types'
import {
  invoiceLineDateVariants,
  invoiceLineDetailVariants,
  invoiceLineInstallmentVariants,
  invoiceLineMainVariants,
  invoiceLineNameVariants,
  invoiceLineTextVariants,
  invoiceLineValueVariants,
  invoiceLineVariants,
} from '@web/components/finance/invoice-line/invoice-line.variants'
import { cloneElement } from 'react'

export function InvoiceLine({
  date,
  description,
  icon,
  installment,
  detail,
  amountCents,
  isPayment = false,
  link,
}: InvoiceLineProps) {
  const className = invoiceLineMainVariants()
  const content = (
    <>
      <span className={invoiceLineDateVariants()}>{date}</span>
      <CategoryArt name={description} icon={icon} size="row" />
      <span className={invoiceLineTextVariants()}>
        <span className={invoiceLineNameVariants()}>
          <span>{description}</span>
          {installment && <span className={invoiceLineInstallmentVariants()}>{installment}</span>}
        </span>
        {detail && <span className={invoiceLineDetailVariants()}>{detail}</span>}
      </span>
      <span className={invoiceLineValueVariants({ isPayment })}>
        <Amount cents={amountCents} size="inherit" />
      </span>
    </>
  )
  return (
    <li data-slot="invoice-line" className={invoiceLineVariants()}>
      {link ? (
        cloneElement(link, { className }, content)
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  )
}
