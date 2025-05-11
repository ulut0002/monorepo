import RegisterForm from "../../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-xl p-8'>
        <h2 className='text-2xl font-bold text-center mb-6'>Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
