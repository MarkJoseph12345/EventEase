"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function withAuth(Component) {
    const displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

    const WithAuthComponent = (props) => {
        const router = useRouter();
        const [indi, setIndi] = useState(false);

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const token = window.localStorage.getItem('token');
                if (!token) {
                    console.log("no token");
                    setIndi(true);
                    router.push('/login');
                }
            }
        }, [indi, router]);

        useEffect(() => {
            console.log(indi);
        }, [indi]);

        if (typeof window === 'undefined') {
            if (!indi) {
                return <div className="max-w-[2000px] relative mx-auto"></div>;
            } else {
                return null;
            }
        }

        const token = window.localStorage.getItem('token');
        if (!token) return null;
        return <Component {...props} />;
    };

    WithAuthComponent.displayName = displayName;

    return WithAuthComponent;
}
