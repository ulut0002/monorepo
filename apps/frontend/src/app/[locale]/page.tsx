import { getSessionUser } from "../lib/auth";
import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <main className='p-8 text-center'>
      {user ? <DashboardPage /> : <LoginPage />}
    </main>
  );
}
