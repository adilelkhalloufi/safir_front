import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface SubscriptionMember {
    user_id: number;
    is_owner: boolean;
    name: string;
}

interface ClientSubscription {
    id: number;
    name: string;
    total_sessions: number;
    used_sessions: number;
    remaining_sessions: number;
    end_date: string;
    is_active: boolean;
    is_valid: boolean;
    max_members?: number;
    members?: SubscriptionMember[];
}

export default function ClientSubscriptionsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle(t('clientSubscriptions.title', 'My subscriptions'));
    }, [t]);

    const { data: subscriptions = [], isLoading, refetch } = useQuery<ClientSubscription[]>({
        queryKey: ['client-subscriptions'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.subscriptions);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{t('clientSubscriptions.title', 'My subscriptions')}</h1>
                    <p className='text-muted-foreground'>
                        {t('clientSubscriptions.subtitle', 'Track sessions and manage shared members')}
                    </p>
                </div>
                <div className='flex gap-2'>
                    <Button variant='outline' onClick={() => navigate(webRoutes.booking)}>
                        {t('clientSubscriptions.bookNew', 'Book a reservation')}
                    </Button>
                    <Button variant='outline' onClick={() => refetch()}>
                        {t('clientSubscriptions.refresh', 'Refresh')}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
            ) : subscriptions.length === 0 ? (
                <Card>
                    <CardContent className='pt-6 text-muted-foreground'>
                        {t('clientSubscriptions.empty', 'No subscriptions yet. Choose a plan to get started.')}
                    </CardContent>
                </Card>
            ) : (
                <div className='grid gap-4 md:grid-cols-2'>
                    {subscriptions.map((subscription) => {
                        const usage = subscription.total_sessions > 0
                            ? (subscription.used_sessions / subscription.total_sessions) * 100
                            : 0;

                        return (
                            <Card key={subscription.id}>
                                <CardHeader>
                                    <CardTitle className='flex items-center justify-between gap-2'>
                                        <span>{subscription.name}</span>
                                        <Badge variant={subscription.is_valid ? 'default' : 'secondary'}>
                                            {subscription.is_valid
                                                ? t('clientSubscriptions.active', 'Active')
                                                : t('clientSubscriptions.inactive', 'Inactive')}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div>
                                        <div className='mb-2 flex items-center justify-between text-sm'>
                                            <span className='text-muted-foreground'>
                                                {subscription.remaining_sessions} / {subscription.total_sessions} {t('clientSubscriptions.sessionsLeft', 'sessions left')}
                                            </span>
                                            <span className='font-medium'>
                                                {subscription.used_sessions} {t('clientSubscriptions.used', 'used')}
                                            </span>
                                        </div>
                                        <Progress value={usage} className='h-2' />
                                    </div>

                                    <div className='text-sm text-muted-foreground'>
                                        {t('clientSubscriptions.expires', 'Expires')}: {subscription.end_date ? format(new Date(subscription.end_date), 'PPP') : '-'}
                                    </div>

                                    <div className='flex flex-wrap items-center gap-2'>
                                        {(subscription.members || []).map((member) => (
                                            <Badge key={`${subscription.id}-${member.user_id}`} variant='outline'>
                                                {member.name}{member.is_owner ? ` (${t('clientSubscriptions.owner', 'owner')})` : ''}
                                            </Badge>
                                        ))}
                                    </div>

                                    {subscription.max_members && subscription.max_members > 1 && (
                                        <Button
                                            variant='outline'
                                            onClick={() => navigate(webRoutes.client.subscriptionMembers.replace(':id', String(subscription.id)))}
                                        >
                                            {t('clientSubscriptions.manageMembers', 'Manage members')}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
