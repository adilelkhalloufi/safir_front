import { t } from 'i18next'
import { UserAuthForm } from './components/user-auth-form'
import Logo from '@/assets/favicon.png'
import ViteLogo from '@/assets/logo_white.png'

export default function SignIn() {
  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>

            <img
              src={Logo}
              width={24}
              height={24}
              className='mr-2'
              alt='Vite'
            />
            {t('website')}
          </div>

          <img
            src={ViteLogo}
            className='relative m-auto'
            width={301}
            height={60}
            alt='Vite'
          />

          <div className='relative z-20  '>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;{t("website")} application web de gestion de magasin d'optique qui inclut des fonctionnalités comme le suivi d'inventaire, la gestion des ventes et les profils clients.&rdquo;
              </p>
              <footer className='text-sm'><a href='https://www.adev.ma' target='_blank'>Adev.ma</a></footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Connexion</h1>
              <p className='text-sm text-muted-foreground'>
                Entrez votre email et mot de passe ci-dessous <br />
                pour vous connecter à votre compte
              </p>
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              En cliquant sur connexion, vous acceptez nos{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
