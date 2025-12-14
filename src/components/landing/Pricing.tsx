import { IconCheck } from '@tabler/icons-react'
import { Button } from '../ui/button'
import { t } from 'i18next'
// add features mobile application
const data = [
  {
    title: 'Basique',
    description: 'Pour les petites entreprises et les entrepreneurs',
    price: 1000,
    currency: 'dh',
    period: 'an',
    features: [
      '1 boutique incluse',

      '2 comptes inclus',
      'app mobile',
      'Boutique supplémentaire : +500 dh/an',
      'Compte supplémentaire : +100 dh/an',
      'Accès complet à toutes les fonctionnalités',
      'Support prioritaire',
    ],
  },
  {
    title: 'Standard',
    description: 'Pour les entreprises en croissance',
    price: 1500,
    currency: 'dh',
    period: 'an',
    features: [
      '2 boutiques incluses',
      '4 comptes inclus',
      'app mobile',
      'Boutique supplémentaire : +500 dh/an',
      'Compte supplémentaire : +100 dh/an',
      'Accès complet à toutes les fonctionnalités',
      'Support prioritaire',
      'Rapports de performance mensuels',
    ],
  },
  {
    title: 'Premium',
    description: 'Pour les entreprises établies',
    price: 2500,
    currency: 'dh',
    period: 'an',
    features: [
      '4 boutiques incluses',
      '10 comptes inclus',
      'app mobile',
      'Boutique supplémentaire : +400 dh/an',
      'Compte supplémentaire : +80 dh/an',
      'Accès complet à toutes les fonctionnalités',
      'Support prioritaire',
      'Rapports de performance mensuels',
      'Gestionnaire de compte dédié',
    ],
  }
]

export default function Pricing() {
  return (
    <section className='bg-white dark:bg-gray-900' id="pricing">
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto mb-8 max-w-screen-md text-center lg:mb-12'>
          <h2 className='mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
            {t('pricing.title')}
          </h2>
          <p className='mb-5 font-light text-gray-500 dark:text-gray-400 sm:text-xl'>

          </p>
        </div>
        <div className='space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10'>
          {data.map((item) => (
            <div className='mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8'>
              <h3 className='mb-4 text-2xl font-semibold'>{item.title}</h3>
              <p className='font-light text-gray-500 dark:text-gray-400 sm:text-lg'>
                {item.description}
              </p>
              <div className='my-8 flex items-baseline justify-center'>
                <span className='mr-2 text-5xl font-extrabold'>{item.price} {item.currency}</span>
                <span className='text-gray-500 dark:text-gray-400'>/{item.period}</span>
              </div>

              <ul role='list' className='mb-8 space-y-4 text-left'>
                {item.features.map((feature, i) => (
                  <li key={i} className='flex items-center space-x-3'>
                    <IconCheck /> <span>{feature}</span>
                  </li>
                ))}


              </ul>
              <Button>Start</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
