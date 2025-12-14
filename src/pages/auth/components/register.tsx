import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { webRoutes } from '@/routes/web'
import { handleErrorResponse, setPageTitle } from '@/utils'
import { defaultHttp } from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { toast } from '@/components/ui/use-toast'
import { Header } from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

interface RegisterFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Veuillez entrer votre nom' }),
  email: z
    .string()
    .min(1, { message: 'Veuillez entrer votre email' })
    .email({ message: 'Adresse email invalide' }),
  phone: z
    .string()
    .min(1, { message: 'Veuillez entrer votre numéro de téléphone' })
    .regex(/^[0-9\s\+\-\(\)]+$/, { message: 'Numéro de téléphone invalide' }),
  company: z
    .string()
    .min(1, { message: 'Veuillez entrer le nom de votre entreprise' }),
  password: z
    .string()
    .min(1, { message: 'Veuillez entrer votre mot de passe' })
    .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  password_confirmation: z
    .string()
    .min(1, { message: 'Veuillez confirmer votre mot de passe' })
})
.refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ['password_confirmation'],
})

export default function Register({ className, ...props }: RegisterFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      password_confirmation: ''
    },
  })
  
  useEffect(() => {
    setPageTitle('Register')
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    defaultHttp
      .post(apiRoutes.register || '/register', {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      .then(() => {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé. Veuillez vous connecter.",
        })
        navigate(webRoutes.login)
      })
      .catch((error) => {
        handleErrorResponse(error)
        setIsLoading(false)
      })
  }

  return (
    <>
    <Header/>
    <div className={cn('grid gap-6 container my-36', className)} {...props}>
      <h1 className='text-3xl font-bold text-center'>Créer un compte</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='nom@exemple.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder='+212 661234567' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder='Votre entreprise' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='password_confirmation'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className='mt-2' loading={isLoading} type="submit">
              Créer un compte
            </Button>
          </div>
        </form>
      </Form>
    </div>
    <Footer/>
    </>
  )
}
