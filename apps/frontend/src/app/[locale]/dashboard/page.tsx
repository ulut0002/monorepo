// app/dashboard/page.tsx

import LogoutButton from "apps/frontend/src/components/LogoutButton";
import { getSessionUser } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login"); // user not logged in, redirect to login
  }

  return (
    <main className='p-6'>
      <h1 className='text-3xl font-semibold mb-4'>Welcome to your Dashboard</h1>
    </main>
  );
}
