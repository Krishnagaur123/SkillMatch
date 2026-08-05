import { PageContainer, PageContent } from '@/components/layout'
import { AppTable, TableRow, TableCell, TableHeaderCell, PrimaryButton, Button, StatusBadge } from '@/components/common'
import { useAdminOpportunities } from '@/hooks/useAdminOpportunities'
import styles from './AdminOpportunitiesPage.module.css'

export default function AdminOpportunitiesPage() {
  const { data, isLoading, error } = useAdminOpportunities()

  return (
    <PageContainer>
      <PageContent>
        <div className={styles.header}>
          <h1 className={styles.title}>Opportunities Management</h1>
          <div className={styles.actions}>
            <PrimaryButton>+ Create Opportunity</PrimaryButton>
          </div>
        </div>

        <AppTable
          isLoading={isLoading}
          error={error}
          isEmpty={!isLoading && !error && (!data?.content || data.content.length === 0)}
          emptyTitle="No opportunities found."
          emptyDescription="There are currently no opportunities in the system. Create one to get started."
          headers={
            <>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Company</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Employment Type</TableHeaderCell>
              <TableHeaderCell>Experience Level</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </>
          }
        >
          {data?.content?.map((opp) => (
            <TableRow key={opp.id}>
              <TableCell style={{ fontWeight: 500 }}>{opp.title}</TableCell>
              <TableCell>{opp.company.name}</TableCell>
              <TableCell>{opp.location}</TableCell>
              <TableCell>{opp.employmentType?.replace('_', ' ')}</TableCell>
              <TableCell>{opp.experienceLevel}</TableCell>
              <TableCell>
                <StatusBadge status={opp.active ? 'active' : 'neutral'}>
                  {opp.active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <div className={styles.buttonGroup}>
                  <Button size="sm" variant="outline" disabled>Edit</Button>
                  <Button size="sm" variant="outline" disabled>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AppTable>
      </PageContent>
    </PageContainer>
  )
}
