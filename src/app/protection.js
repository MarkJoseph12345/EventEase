import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth(Component) {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }, []);

        return <Component {...props} />;
    };
}
