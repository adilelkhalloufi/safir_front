import { Link } from 'react-router-dom'
import { UserAuthForm } from './components/user-auth-form'
import { useTranslation } from 'react-i18next'


export default function SignIn() {
  const { t } = useTranslation()

  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-primary' />
          <Link to='/' className='relative z-20 flex items-center text-lg font-medium hover:opacity-80 transition-opacity'>
            <img
              src={'./images/favicon.png'}
              width={24}
              height={24}
              className='mr-2'
              alt='Vite'
            />
            {t('website')}
          </Link>


          <img
            src={'./logo.png'}
            width={301}
            height={60}
            className='relative m-auto'

          />

          <div className='relative z-20  '>
            <blockquote className='space-y-2'>
              {/* <p className='text-lg'>
                {t("website")}
                {t("website.description")}
              </p> */}
              {/* <footer className='text-sm'><a href='https://www.adev.ma' target='_blank'>Adev.ma</a></footer> */}
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <div className='flex flex-row items-center'>
                <Link to='/' className='hover:opacity-80 transition-opacity'>
                  <img
                    src={'./images/favicon.png'}
                    width={24}
                    height={24}
                    className='mr-2'
                    alt='Vite'
                  />
                </Link>
                <h1 className='text-2xl font-semibold tracking-tight'>{t('auth.signIn.title')}</h1>
              </div>
              <p className='text-sm text-muted-foreground'>
                {t('auth.signIn.descriptionLine1')} <br />
                {t('auth.signIn.descriptionLine2')}
              </p>
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              {t('auth.signIn.termsPrefix')}{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                {t('auth.signIn.termsLink')}
              </a>{' '}
              {t('auth.signIn.and')}{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                {t('auth.signIn.privacyLink')}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
