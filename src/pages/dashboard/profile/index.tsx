import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { User, Lock, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.admin?.user);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data: typeof profileData) => http.put(apiRoutes.updateProfile, data),
        onSuccess: () => {
            toast({
                title: t('profile.updateSuccess'),
                description: t('profile.profileUpdatedSuccessfully'),
            });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast({
                title: t('common.error'),
                description: error?.response?.data?.message || t('profile.updateFailed'),
                variant: 'destructive',
            });
        },
    });

    // Update password mutation
    const updatePasswordMutation = useMutation({
        mutationFn: (data: typeof passwordData) => http.put(apiRoutes.updatePassword, data),
        onSuccess: () => {
            toast({
                title: t('profile.passwordUpdateSuccess'),
                description: t('profile.passwordUpdatedSuccessfully'),
            });
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        },
        onError: (error: any) => {
            toast({
                title: t('common.error'),
                description: error?.response?.data?.message || t('profile.passwordUpdateFailed'),
                variant: 'destructive',
            });
        },
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileData);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast({
                title: t('common.error'),
                description: t('profile.passwordsDoNotMatch'),
                variant: 'destructive',
            });
            return;
        }

        updatePasswordMutation.mutate(passwordData);
    };

    return (
        <div className="container max-w-4xl mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
                <p className="text-muted-foreground mt-2">{t('profile.description')}</p>
            </div>

            <Separator />

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('profile.profileInformation')}
                    </CardTitle>
                    <CardDescription>{t('profile.updateYourPersonalInformation')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('common.name')}</Label>
                            <Input
                                id="name"
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {t('common.email')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {t('common.phone')}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending ? t('common.saving') : t('profile.updateProfile')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {t('profile.changePassword')}
                    </CardTitle>
                    <CardDescription>{t('profile.updateYourPassword')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">{t('profile.currentPassword')}</Label>
                            <Input
                                id="current_password"
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new_password">{t('profile.newPassword')}</Label>
                            <Input
                                id="new_password"
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new_password_confirmation">{t('profile.confirmNewPassword')}</Label>
                            <Input
                                id="new_password_confirmation"
                                type="password"
                                value={passwordData.new_password_confirmation}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={updatePasswordMutation.isPending}
                                variant="secondary"
                            >
                                {updatePasswordMutation.isPending ? t('common.saving') : t('profile.changePassword')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* User Info Display */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.accountInformation')}</CardTitle>
                    <CardDescription>{t('profile.viewYourAccountDetails')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.role')}</span>
                        <span className="font-medium">{user?.role}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.accountCreated')}</span>
                        <span className="font-medium">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
