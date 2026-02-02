import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function Loading() {
    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)'
        }}>
            <LoadingSpinner />
        </div>
    );
}
