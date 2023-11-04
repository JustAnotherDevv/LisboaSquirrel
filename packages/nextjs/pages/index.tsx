import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
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

        <div className="mt-20 flex flex-col items-center justify-center w-[450px]">
          <h2 className="text-4xl title ">Chip in, cash out!</h2>

          <h3 className=" text-xl text-center mt-2 opacity-60">
            Contribute to early-stage startups in exchange for future tokens. Become your own VC!
          </h3>
        </div>

        <div className="flex space-x-4 justify-center items-center mt-20">
          <Link
            className="bg-[#DF00FF] hover:bg-[#9900B4] text-white font-bold py-2 px-4 rounded"
            href="/create-organisation"
          >
            Create an Organisation
          </Link>
          <Link className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" href="/overview">
            Go to Overview
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
