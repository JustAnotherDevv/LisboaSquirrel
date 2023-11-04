import type { NextPage } from "next";
import FirstChart from "~~/components/FirstChart";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <FirstChart width={400} height={400} />
    </>
  );
};

export default Home;
