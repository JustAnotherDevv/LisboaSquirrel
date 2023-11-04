import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

function OrganisationOverviewCard({ organisationId }: { organisationId: bigint }) {
  const { data: organisation } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "organizations",
    args: [organisationId],
  });

  return (
    <Link href={`/org/${organisationId}`}>
      <li className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl p-[1px] shadow">
        <div className="bg-slate-900/90 hover:bg-slate-900/80  rounded-xl p-4 flex flex-row  items-center">
          <div className="w-20">
            <img
              src={"https://www.talentlayer.org/_next/image?url=%2Ficon_light.png&w=96&q=75"}
              width={50}
              height={75}
            />
          </div>
          <div className="">
            <h3 className="text-lg font-medium text-primary-content">{organisation}</h3>
            <a className="text-white/50  mt-2 text-sm">Visit website</a>
          </div>
        </div>
      </li>
    </Link>
  );
}

export default function UserOverview() {
  const { address } = useAccount();

  const { data: organisations, isFetched } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "getOrganizations",
    args: [address],
  });

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Please sign in with Ethereum first</h1>
      </div>
    );
  }

  if (!isFetched) {
    return <div>fetching</div>;
  }

  if (!organisations) {
    return <div>you are not an cofounder or a contributor in any organisation</div>;
  }

  return (
    <>
      <MetaHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-accent">My Dashboard</h1>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {organisations[0].map(organisation => (
            <OrganisationOverviewCard key={organisation} organisationId={organisation} />
          ))}
        </ul>
        <h2 className="text-2xl font-semibold text-gray-700 mt-20">Your Allocations</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
          {organisations[1].map(organisation => (
            <OrganisationOverviewCard key={organisation} organisationId={organisation} />
          ))}
        </ul>
      </div>
    </>
  );
}
