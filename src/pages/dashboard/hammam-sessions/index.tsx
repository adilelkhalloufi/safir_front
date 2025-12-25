import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { HammamSessionsDataTable } from './data-table';
import { HammamSession, GetHammamSessionColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';

export default function HammamSessionsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<HammamSession | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time_slot: '',
    session_type: 'women_only' as 'women_only' | 'men_only' | 'mixed',
    capacity: 10,
  });

  // Fetch sessions
  const { data: sessions = [], isLoading } = useQuery<HammamSession[]>({
    queryKey: ['hammamSessions'],
    queryFn: () => http.get(apiRoutes.adminHammamSessions),
  });

  // Cancel session mutation
  const cancelMutation = useMutation({
    mutationFn: (id: number) => http.put(apiRoutes.adminHammamSessionCancel(id), { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hammamSessions'] });
      toast({
        title: t('hammamSessions.cancelSuccess', 'Session cancelled successfully'),
        description: t('hammamSessions.cancelSuccessDesc', 'The session has been cancelled.'),
      });
      setIsCancelDialogOpen(false);
      setSelectedSession(null);
    },
    onError: () => {
      toast({
        title: t('hammamSessions.cancelError', 'Error'),
        description: t('hammamSessions.cancelErrorDesc', 'Failed to cancel session. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  // Add/Edit session mutation
  const saveSessionMutation = useMutation({
    mutationFn: (data: typeof formData & { id?: number }) => {
      if (data.id) {
        return http.put(apiRoutes.adminHammamSessionById(data.id), data);
      }
      return http.post(apiRoutes.adminHammamSessions, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hammamSessions'] });
      toast({
        title: t(
          selectedSession ? 'hammamSessions.updateSuccess' : 'hammamSessions.createSuccess',
          selectedSession ? 'Session updated successfully' : 'Session created successfully'
        ),
        description: t(
          selectedSession ? 'hammamSessions.updateSuccessDesc' : 'hammamSessions.createSuccessDesc',
          selectedSession ? 'Session details have been updated.' : 'New session has been added to the schedule.'
        ),
      });
      setIsAddEditDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: t('hammamSessions.saveError', 'Error'),
        description: t('hammamSessions.saveErrorDesc', 'Failed to save session. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      date: '',
      time_slot: '',
      session_type: 'women_only',
      capacity: 10,
    });
    setSelectedSession(null);
  };

  const handleView = (session: HammamSession) => {
    console.log('View session:', session);
  };

  const handleEdit = (session: HammamSession) => {
    setSelectedSession(session);
    setFormData({
      date: session.date,
      time_slot: session.time_slot,
      session_type: session.session_type,
      capacity: session.capacity,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleCancel = (session: HammamSession) => {
    setSelectedSession(session);
    setIsCancelDialogOpen(true);
  };

  const handleViewBookings = (session: HammamSession) => {
    console.log('View bookings for session:', session);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddEditDialogOpen(true);
  };

  const handleSaveSession = () => {
    saveSessionMutation.mutate(selectedSession ? { ...formData, id: selectedSession.id } : formData);
  };

  const columns = GetHammamSessionColumns({
    onView: handleView,
    onEdit: handleEdit,
    onCancel: handleCancel,
    onViewBookings: handleViewBookings,
  });

  // Calculate stats
  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled').length;
  const totalCapacity = sessions.reduce((sum, s) => sum + s.capacity, 0);
  const totalBooked = sessions.reduce((sum, s) => sum + s.booked, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='text-lg'>{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('hammamSessions.title', 'Hammam Sessions')}</h2>
          <p className='text-muted-foreground'>
            {t('hammamSessions.subtitle', 'Manage hammam session schedule and capacity')}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Calendar className='mr-2 h-4 w-4' />
            {t('hammamSessions.calendarView', 'Calendar View')}
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className='mr-2 h-4 w-4' />
            {t('hammamSessions.addNew', 'Schedule Session')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('hammamSessions.totalSessions', 'Total Sessions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('hammamSessions.scheduled', 'Scheduled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{scheduledSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('hammamSessions.totalBooked', 'Total Booked')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalBooked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('hammamSessions.avgOccupancy', 'Avg. Occupancy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgOccupancy}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Gender Schedule Rules Info Card */}
      <Card className='border-blue-200 bg-blue-50'>
        <CardHeader>
          <CardTitle className='text-sm'>{t('hammamSessions.scheduleRules', 'Gender Schedule Rules')}</CardTitle>
        </CardHeader>
        <CardContent className='text-sm text-muted-foreground'>
          <ul className='space-y-1'>
            <li>🚺 {t('hammamSessions.rule1', 'Women Only: Monday, Wednesday, Sunday (PM)')}</li>
            <li>🚹 {t('hammamSessions.rule2', 'Men Only: Tuesday, Thursday, Saturday')}</li>
            <li>🔄 {t('hammamSessions.rule3', 'Mixed Sessions: Friday')}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('hammamSessions.sessionsList', 'Sessions List')}</CardTitle>
          <CardDescription>{t('hammamSessions.sessionsListDesc', 'View and manage all hammam sessions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <HammamSessionsDataTable columns={columns} data={sessions} />
        </CardContent>
      </Card>

      {/* Add/Edit Session Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedSession
                ? t('hammamSessions.editSession', 'Edit Session')
                : t('hammamSessions.addSession', 'Schedule New Session')}
            </DialogTitle>
            <DialogDescription>
              {t('hammamSessions.addEditDescription', 'Fill in the session details below. Click save when you are done.')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='date'>{t('hammamSessions.date', 'Date')}</Label>
              <Input
                id='date'
                type='date'
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='time_slot'>{t('hammamSessions.timeSlot', 'Time Slot')}</Label>
              <Input
                id='time_slot'
                type='time'
                value={formData.time_slot}
                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='session_type'>{t('hammamSessions.sessionType', 'Session Type')}</Label>
              <Select
                value={formData.session_type}
                onValueChange={(value: 'women_only' | 'men_only' | 'mixed') =>
                  setFormData({ ...formData, session_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='women_only'>{t('hammamSessions.typeWomenOnly', 'Women Only')}</SelectItem>
                  <SelectItem value='men_only'>{t('hammamSessions.typeMenOnly', 'Men Only')}</SelectItem>
                  <SelectItem value='mixed'>{t('hammamSessions.typeMixed', 'Mixed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='capacity'>{t('hammamSessions.capacity', 'Capacity')}</Label>
              <Input
                id='capacity'
                type='number'
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddEditDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleSaveSession} disabled={saveSessionMutation.isPending}>
              {saveSessionMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('hammamSessions.cancelSession', 'Cancel Session')}</DialogTitle>
            <DialogDescription>
              {t(
                'hammamSessions.cancelConfirmation',
                'Are you sure you want to cancel this session? All bookings will be notified.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsCancelDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={() => selectedSession && cancelMutation.mutate(selectedSession.id)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? t('common.cancelling', 'Cancelling...') : t('common.confirm', 'Confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
