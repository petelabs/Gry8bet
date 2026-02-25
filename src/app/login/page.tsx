import { Suspense } from 'react';
import LoginComponent from './login-component';

function Loading() {
  return <div className="container flex justify-center items-center py-24">Loading...</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginComponent />
    </Suspense>
  );
}
