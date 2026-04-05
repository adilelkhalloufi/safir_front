import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Member {
    user_id: number;
    name: string;
    is_owner: boolean;
}

export default function ClientSubscriptionMembersPage() {
    const { id } = useParams<{ id: string }>();
    const subscriptionId = Number(id || '0');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        setPageTitle(t('clientSubscriptions.membersTitle', 'Manage members'));
    }, [t]);

    const { data: members = [], refetch, isLoading } = useQuery<Member[]>({
        queryKey: ['client-subscription-members', subscriptionId],
        queryFn: async () => {
            const response = await http.get(apiRoutes.subscriptionMembers(subscriptionId));
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
        enabled: subscriptionId > 0,
    });

    const addMemberMutation = useMutation({
        mutationFn: () => http.post(apiRoutes.subscriptionMembers(subscriptionId), { user_id: Number(userId) }),
        onSuccess: () => {
            setUserId('');
            toast.success(t('clientSubscriptions.memberAdded', 'Member added'));
            refetch();
        },
        onError: () => {
            toast.error(t('clientSubscriptions.memberAddError', 'Could not add member'));
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: (memberId: number) => http.delete(apiRoutes.subscriptionMemberByUser(subscriptionId, memberId)),
        onSuccess: () => {
            toast.success(t('clientSubscriptions.memberRemoved', 'Member removed'));
            refetch();
        },
        onError: () => {
            toast.error(t('clientSubscriptions.memberRemoveError', 'Could not remove member'));
        },
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{t('clientSubscriptions.membersTitle', 'Manage members')}</h1>
                    <p className='text-muted-foreground'>
                        {t('clientSubscriptions.membersSubtitle', 'Add or remove users from this shared subscription')}
                    </p>
                </div>
                <Button variant='outline' onClick={() => navigate(webRoutes.client.subscriptions)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('clientSubscriptions.addMember', 'Add member')}</CardTitle>
                    <CardDescription>
                        {t('clientSubscriptions.addMemberHelp', 'Enter the user id to add to this subscription.')}
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex gap-2'>
                    <Input
                        value={userId}
                        type='number'
                        placeholder={t('clientSubscriptions.userIdPlaceholder', 'User ID')}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <Button
                        onClick={() => addMemberMutation.mutate()}
                        disabled={!userId || addMemberMutation.isPending}
                    >
                        {t('clientSubscriptions.add', 'Add')}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('clientSubscriptions.membersList', 'Members')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    {isLoading ? (
                        <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
                    ) : members.length === 0 ? (
                        <p className='text-muted-foreground'>{t('clientSubscriptions.noMembers', 'No members found')}</p>
                    ) : (
                        members.map((member) => (
                            <div
                                key={member.user_id}
                                className='flex items-center justify-between rounded-md border p-3'
                            >
                                <div>
                                    <div className='font-medium'>{member.name}</div>
                                    <div className='text-xs text-muted-foreground'>ID: {member.user_id}</div>
                                </div>
                                {member.is_owner ? (
                                    <span className='text-sm text-muted-foreground'>{t('clientSubscriptions.owner', 'owner')}</span>
                                ) : (
                                    <Button
                                        variant='destructive'
                                        size='sm'
                                        onClick={() => removeMemberMutation.mutate(member.user_id)}
                                        disabled={removeMemberMutation.isPending}
                                    >
                                        {t('clientSubscriptions.remove', 'Remove')}
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
