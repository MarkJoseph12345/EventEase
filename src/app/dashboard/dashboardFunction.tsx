import dynamic from 'next/dynamic';

const DashboardComponent = dynamic(() => import('./dashboardComponent.tsx'), {
    loading: () => <p>Loading...</p>,
});


export default function DashboardFunction() {
    return <DashboardComponent />
}
