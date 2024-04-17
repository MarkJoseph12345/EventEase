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
<<<<<<< HEAD
}
=======
}
>>>>>>> 5a32b12cbd9f4e650eca19acde425a8ad6b5768e
