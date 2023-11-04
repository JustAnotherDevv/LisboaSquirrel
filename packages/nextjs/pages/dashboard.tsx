import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function CreateOrganisation() {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Please sign in with Ethereum first</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Organisations</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
        {[
          { id: 0, name: "TalentLayer", url: "talentlayer.org" },
          { id: 1, name: "NutCracker", url: "example.org" },
        ].map(organisation => (
          <li key={organisation.id} className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-medium text-gray-800">{organisation.name}</h3>
            <a href={organisation.url} className="text-blue-500 hover:text-blue-600 underline mt-2">
              Visit website
            </a>
            <Link href={`/org/${organisation.id}`}>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-2">
                Open
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Alocations</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
        {[
          { id: 0, name: "TalentLayer", url: "talentlayer.org" },
          { id: 1, name: "NutCracker", url: "example.org" },
        ].map(organisation => (
          <li key={organisation.id} className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-medium text-gray-800">{organisation.name}</h3>
            <a href={organisation.url} className="text-blue-500 hover:text-blue-600 underline mt-2">
              Visit website
            </a>
            <Link href={`/org/${organisation.id}`}>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-2">
                Open
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
