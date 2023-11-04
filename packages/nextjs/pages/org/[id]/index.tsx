import React, { useState } from "react";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAccount, useContractReads, useEnsAddress } from "wagmi";
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
    <div className="bg-gray-100">
      <div className="flex justify-between items-center bg-white p-4">
        <h1 className="text-lg font-bold text-gray-800">Dashboard of {orgInfo[0]}</h1>
      </div>
      {isAdmin ? <AdminDashboard orgId={router.query.id} /> : <UserDashboard />}
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
  );
}

function UserDashboard() {
  return <div>User Dashboard</div>;
}

function AdminDashboard({ orgId }: { orgId: bigint }) {
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
      <div>
        <p>{userCount?.toString()} Users</p>
        {/* <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {users?.map((user) => {
            return (
              <OptionComponent key={user.result} user={user.result} />
            );
          })}
        </select> */}
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {users?.map((user: { success: string; status: string }) => {
            return (
              <option key={user.result} value={user.result}>
                {user.result}
              </option>
            );
          })}
        </select>
      </div>
      <div>Admin Dashboard for {selectedUser}</div>
    </div>
  );
}

// function OptionComponent({ user }) {
//   const { data: ensAddress } = useEnsAddress({ address: user });

//   return (
//     <option key={user} value={ensAddress}>
//       {ensAddress}
//     </option>
//   );
// }
