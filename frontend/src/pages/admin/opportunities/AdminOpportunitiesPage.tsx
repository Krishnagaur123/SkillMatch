import { useState } from 'react'
import { PageContainer, PageContent } from '@/components/layout'
import { AppTable, TableRow, TableCell, TableHeaderCell, PrimaryButton, Button, StatusBadge, Dialog, DialogHeader, DialogTitle, DialogContent, ConfirmationDialog } from '@/components/common'
import { useAdminOpportunities, useCreateAdminOpportunity, useUpdateAdminOpportunity, useDeleteAdminOpportunity } from '@/hooks/useAdminOpportunities'
import { useOpportunityDetail } from '@/hooks/useOpportunityDetail'
import { OpportunityForm } from './OpportunityForm'
import { toastSuccess, toastError } from '@/utils/toast'
import { extractApiError } from '@/services/api/errors'
import styles from './AdminOpportunitiesPage.module.css'

export default function AdminOpportunitiesPage() {
  const { data, isLoading, error } = useAdminOpportunities()
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: editData, isLoading: editLoading } = useOpportunityDetail(editId || '')

  const createMutation = useCreateAdminOpportunity()
  const updateMutation = useUpdateAdminOpportunity()
  const deleteMutation = useDeleteAdminOpportunity()

  const handleCreate = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toastSuccess('Opportunity created successfully')
        setIsCreateOpen(false)
      },
      onError: (err) => toastError('Failed to create opportunity', extractApiError(err))
    })
  }

  const handleUpdate = (values: any) => {
    if (!editId) return
    updateMutation.mutate({ id: editId, data: values }, {
      onSuccess: () => {
        toastSuccess('Opportunity updated successfully')
        setEditId(null)
      },
      onError: (err) => toastError('Failed to update opportunity', extractApiError(err))
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toastSuccess('Opportunity deleted successfully')
        setDeleteId(null)
      },
      onError: (err) => toastError('Failed to delete opportunity', extractApiError(err))
    })
  }

  const deleteTarget = data?.content?.find((o) => o.id === deleteId)

  return (
    <PageContainer>
      <PageContent>
        <div className={styles.header}>
          <h1 className={styles.title}>Opportunities Management</h1>
          <div className={styles.actions}>
            <PrimaryButton onClick={() => setIsCreateOpen(true)}>+ Create Opportunity</PrimaryButton>
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
                  <Button size="sm" variant="outline" onClick={() => setEditId(opp.id)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(opp.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AppTable>

        <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Opportunity</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <OpportunityForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
          </DialogContent>
        </Dialog>

        <Dialog isOpen={!!editId} onClose={() => setEditId(null)}>
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          <DialogContent>
            {editLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading details...</div>
            ) : editData ? (
              <OpportunityForm
                initialData={editData}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Failed to load opportunity details.</div>
            )}
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Opportunity?"
          description={deleteTarget ? deleteTarget.title : 'Are you sure you want to delete this opportunity?'}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDestructive
          isLoading={deleteMutation.isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </PageContent>
    </PageContainer>
  )
}
