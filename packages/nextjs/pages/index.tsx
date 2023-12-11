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
          <Image src="/logo.svg" alt="Logo" width={200} height={200} />
        </div>

        <h1 className="text-4xl text-black">CHIPPER</h1>

        <div className="mt-[90px] flex flex-col items-center justify-center w-[520px]">
          <h2 className="text-4xl">Bootstrap new ideas with friends</h2>

          <h3 className="text-xl text-center mt-2 opacity-60">
            Contribute to early-stage startups in exchange for future tokens. Become your own VC!
          </h3>
        </div>

        <div className="flex space-x-4 justify-center items-center mt-20">
          <Link
            className="bg-[#dd7143] hover:bg-[#c3592b] text-white font-bold py-2 px-4 rounded"
            href="/create-organisation"
          >
            Grow my Organisation!
          </Link>
          <Link className="bg-[#3e6957] hover:bg-[#133629] text-white font-bold py-2 px-4 rounded" href="/overview">
            Go to Overview
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
