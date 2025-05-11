// app/login/page.tsx

import LoginForm from "../../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-xl p-8'>
        <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>
        <LoginForm /> {/* ✅ This is a client component */}
      </div>
    </div>
  );
}
