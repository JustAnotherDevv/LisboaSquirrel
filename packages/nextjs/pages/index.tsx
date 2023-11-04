import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import FirstChart from "~~/components/FirstChart";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />

      <div className="flex flex-col items-center justify-center py-2 mt-[100px]">
        <div>
          <Image src="/logo-pink.svg" alt="Logo" width={200} height={200} />
        </div>

        <h1 className={` text-4xl text-transparent bg-clip-text bg-gradient-to-t from-purple-500 to-pink-600`}>
          CHIPPER
        </h1>

        <div className="flex space-x-4 justify-center items-center mt-20">
          <Link
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
            href="/create-organisation"
          >
            Create an Organisation
          </Link>
          <Link className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" href="/overview">
            Go to Overview
          </Link>
        </div>
      </div >
    </>
  );
};

export default Home;
