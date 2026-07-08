import { forwardRef } from 'react'
import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { TableSkeleton } from '../feedback/Skeleton'
import { ApiErrorState } from '../feedback/ErrorStates'
import { EmptyState } from '../feedback/FeedbackState'
import styles from './Table.module.css'

export type TableContainerProps = HTMLAttributes<HTMLDivElement>

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.container, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </div>
    )
  }
)
TableContainer.displayName = 'TableContainer'

export type NativeTableProps = TableHTMLAttributes<HTMLTableElement>

export const Table = forwardRef<HTMLTableElement, NativeTableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <table ref={ref} className={[styles.table, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </table>
    )
  }
)
Table.displayName = 'Table'

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead ref={ref} className={[styles.thead, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </thead>
    )
  }
)
TableHeader.displayName = 'TableHeader'

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={[styles.tbody, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = 'TableBody'

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr ref={ref} className={[styles.row, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </tr>
    )
  }
)
TableRow.displayName = 'TableRow'

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td ref={ref} className={[styles.cell, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </td>
    )
  }
)
TableCell.displayName = 'TableCell'

export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th ref={ref} className={[styles.headerCell, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </th>
    )
  }
)
TableHeaderCell.displayName = 'TableHeaderCell'

export interface AppTableProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  error?: unknown
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
  onRetry?: () => void
  toolbar?: React.ReactNode
  pagination?: React.ReactNode
  headers: React.ReactNode
  skeletonRows?: number
  skeletonColumns?: number
}

export const AppTable = forwardRef<HTMLDivElement, AppTableProps>(
  (
    {
      className,
      isLoading = false,
      error,
      isEmpty = false,
      emptyTitle = 'No data available',
      emptyDescription = 'There is no data to show in this view.',
      emptyActionLabel,
      onEmptyAction,
      onRetry,
      toolbar,
      pagination,
      headers,
      skeletonRows = 5,
      skeletonColumns = 4,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={[styles.wrapper, className].filter(Boolean).join(' ')} {...props}>
        {toolbar && <div className={styles.toolbar}>{toolbar}</div>}

        <TableContainer>
          {error ? (
            <div className={styles.errorState}>
              <ApiErrorState error={error} onRetry={onRetry} />
            </div>
          ) : isLoading ? (
            <TableSkeleton rows={skeletonRows} columns={skeletonColumns} />
          ) : isEmpty ? (
            <div className={styles.emptyState}>
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                actionLabel={emptyActionLabel}
                onAction={onEmptyAction}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>{headers}</TableHeader>
              <TableBody>{children}</TableBody>
            </Table>
          )}
        </TableContainer>

        {pagination && !isLoading && !error && !isEmpty && (
          <div className={styles.pagination}>{pagination}</div>
        )}
      </div>
    )
  }
)
AppTable.displayName = 'AppTable'
