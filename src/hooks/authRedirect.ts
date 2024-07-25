"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn } from '../services/authService';

export const useAuthRedirect = (redirectToDashboard = false) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = true;
      if (!loggedIn && pathname !== '/Login') {
        if (pathname === '/SignUp') {
          router.push('/SignUp')
        } else {
          router.push('/Login');
        }
      } else if (loggedIn && (pathname === '/Login' || redirectToDashboard)) {
        router.push('/Dashboard');
      }
      setTimeout(() => {
        setLoading(false)
      }, 500);
    };

    checkAuth()
  }, [pathname, redirectToDashboard, router]);

  return loading;
};
