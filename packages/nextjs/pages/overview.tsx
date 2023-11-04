import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

function OrganisationOverviewCard({ organisationId }: { organisationId: bigint }) {
  const { data: organisation } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "organizations",
    args: [organisationId],
  });

  return (
    <li className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-medium text-gray-800">{organisation}</h3>
      <a className="text-blue-500 hover:text-blue-600 underline mt-2">Visit website</a>
      <Link href={`/org/${organisationId}`}>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-2">Open</button>
      </Link>
    </li>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Organisations</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
        {organisations[0].map(organisation => (
          <OrganisationOverviewCard key={organisation} organisationId={organisation} />
        ))}
      </ul>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Alocations</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
        {organisations[1].map(organisation => (
          <OrganisationOverviewCard key={organisation} organisationId={organisation} />
        ))}
      </ul>
    </div>
  );
}
