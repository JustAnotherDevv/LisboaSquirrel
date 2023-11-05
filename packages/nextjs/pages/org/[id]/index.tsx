import React, { useState } from "react";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAccount, useContractReads, useEnsAddress } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export default function OrganisationDashboard() {
  const { address } = useAccount();
  const router = useRouter();

  const { data: orgInfo } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "organizations",
    args: [BigInt((router.query.id as string) || 0)],
  });

  const { data: isAdmin } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "isOrganizationAdmin",
    args: [BigInt((router.query.id as string) || 0), address],
  });

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Please sign in with Ethereum first</h1>
      </div>
    );
  }

  if (!orgInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Not an org</h1>
      </div>
    );
  }

  return (
    <>
      <MetaHeader title="Edit Organisation" />
      <div className="container mx-auto px-4 py-8">
        {isAdmin ? <AdminDashboard orgId={router.query.id} orgInfo={orgInfo} /> : <UserDashboard />}
        <div className="fixed bottom-0 right-0 p-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
            onClick={() => console.log("Settings modal opened")}
          >
            Settings
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => console.log("Other modal opened")}
          >
            Other
          </button>
        </div>
      </div>
    </>
  );
}

function UserDashboard({ user }: { user: string }) {
  return <div>{user} s Dashboard</div>;
}

function AdminDashboard({ orgId, orgInfo }: { orgId: bigint; orgInfo: any }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: userCount } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "getUserAmount",
    args: [orgId],
  });

  console.log("userCount", userCount);

  const userCalls = [];
  for (let i = 0; i < userCount || 0; i++) {
    const contract = {
      abi: deployedContracts[31337].OrganizationSheet.abi,
      address: deployedContracts[31337].OrganizationSheet.address,
      functionName: "getUserAtIndex",
      args: [orgId, BigInt(i)],
    };
    userCalls.push(contract);
  }

  const { data: users } = useContractReads({ contracts: userCalls });

  console.log("users, ", users);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-content">{orgInfo[0]}</h1>

      <h3 className="text-primary-content mt-4 opacity-60">Time to score your {userCount?.toString()} team members!</h3>

      <div className="mt-10">
        {users?.map((user: { success: string; status: string }) => {
          return <p key={user.result}>{user.result}</p>; // todo: needs to show ens!
        })}
      </div>
    </div>
  );
}
