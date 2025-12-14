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
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { webRoutes } from '@/routes/web'
import { RootState } from '@/store'
import { handleErrorResponse, setPageTitle } from '../../../utils';
import { defaultHttp } from '@/utils/http'
import { apiRoutes } from '@/routes/api'
import { Admin } from '@/interfaces/models/admin'
import { login } from '@/store/slices/adminSlice'
 
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(4, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const from = location.state?.from?.pathname || webRoutes.Dashboard;
  const admin = useSelector((state: RootState) => state.admin);
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })



  
  useEffect(() => {
      setPageTitle('Log in');
  
 
    
  }, []);

  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin]);
 
  function onSubmit(values: z.infer<typeof formSchema>) {
  
    
    setIsLoading(true)


    defaultHttp
      .post(apiRoutes.login, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        console.log("response ",response.data)
        const admin: Admin = {
          token: response.data.token,
          user: response.data.user
        };
        dispatch(login(admin));
      })
      .catch((error) => {
        handleErrorResponse(error);
        setIsLoading(false);
      });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email' {...field} />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    {/* <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link> */}
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}  >
              Login
            </Button>
{/* 
            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandFacebook className='h-4 w-4' />}
              >
                Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
