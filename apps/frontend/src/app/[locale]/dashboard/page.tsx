// app/dashboard/page.tsx

import LogoutButton from "apps/frontend/src/components/LogoutButton";

export default function DashboardPage() {
  return (
    <main className='p-6'>
      <h1 className='text-3xl font-semibold mb-4'>Welcome to your Dashboard</h1>
      {/* Other dashboard content */}
      <LogoutButton />
    </main>
  );
}
