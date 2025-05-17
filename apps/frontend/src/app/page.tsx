// pages/index.tsx
import { GetServerSideProps } from "next";
import { User } from "@shared/types";
import { checkAuth } from "./lib/auth/checkAuth";

interface Props {
  isAuthenticated: boolean;
  user?: User;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const result = await checkAuth(context);

  if (!result.isAuthenticated) {
    return { props: { isAuthenticated: false } };
  }

  return {
    props: {
      isAuthenticated: true,
      // user: result.user, // return full user data if available
    },
  };
};

export default function Home({ isAuthenticated, user }: Props) {
  return (
    <main className='p-8 text-center'>
      <h1 className='text-4xl font-bold text-blue-600'>
        Frontend + Backend + Shared!
      </h1>

      {isAuthenticated && user ? (
        <p className='mt-4 text-xl'>
          Hello, {user.name} ({user.email})
        </p>
      ) : (
        <p className='mt-4 text-gray-500'>You are not logged in.</p>
      )}
    </main>
  );
}
