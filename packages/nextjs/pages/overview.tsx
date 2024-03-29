import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

function OrganisationOverviewCard({ organisationId }: { organisationId: bigint }) {
  const { data: organisation, isLoading } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "organizations",
    args: [organisationId],
  });

  if (!organisation) {
    return <p>Loading...</p>;
  } else {
    return (
      <Link href={`/org/${organisationId}`}>
        <li className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl p-[1px] shadow">
          <div className="bg-slate-900/90 hover:bg-slate-900/80 rounded-xl p-4 px-5 flex flex-row items-center justify-start">
            <div className="w-20">
              <img src={organisation[1]} width={50} height={75} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium text-white">{organisation[0]}</div>
              <div className="text-sm text-white/60">{organisation[2]}</div>
            </div>
          </div>
        </li>
      </Link>
    );
  }
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

        <h2 className="text-sm font-semibold text-primary-content mt-8 opacity-70">MY ORGANISATIONS</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {organisations[0].length > 0 ? (
            organisations[0].map(organisation => (
              <OrganisationOverviewCard key={organisation} organisationId={organisation} />
            ))
          ) : (
            <p>
              You are not a founder of any organisation yet. <Link href="/create-organisation">Create one now!</Link>
            </p>
          )}
        </ul>
        <br />
        <h2 className="text-sm font-semibold text-primary-content mt-8 opacity-70">I CONTRIBUTE TO</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {organisations[1].length > 0 ? (
            organisations[1].map(organisation => (
              <OrganisationOverviewCard key={organisation} organisationId={organisation} />
            ))
          ) : (
            <p>You don't contribute to any organisation yet.</p>
          )}
        </ul>
      </div>
    </>
  );
}
