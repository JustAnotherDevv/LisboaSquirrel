import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />

      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Image src="/logo.svg" alt="Logo" width={200} height={200} />

        <div className="flex space-x-4 justify-center items-center h-screen">
          <Link
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            href="/create-organisation"
          >
            Create an Organisation
          </Link>
          <Link className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" href="/dashboard">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
