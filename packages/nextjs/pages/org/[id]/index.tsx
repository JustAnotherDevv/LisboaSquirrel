import React, { useState } from "react";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAccount, useContractReads, useEnsAddress } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export default function OrganisationDashboard() {
  const { address } = useAccount();
  const router = useRouter();
  const { period } = router.query;

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

  const { data: adminCount } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "getAdminAmount",
    args: [orgId],
  });
  console.log("AdminCount", adminCount);

  const adminCalls = [];
  for (let i = 0; i < adminCount || 0; i++) {
    const contract = {
      abi: deployedContracts[31337].OrganizationSheet.abi,
      address: deployedContracts[31337].OrganizationSheet.address,
      functionName: "getAdminAtIndex",
      args: [orgId, BigInt(i)],
    };
    console.log("testinghere", i, contract);
    adminCalls.push(contract);
  }

  console.log("admin calls", adminCalls);

  const { data: admins } = useContractReads({ contracts: adminCalls });
  console.log(admins, "admins are here");

  const { data: criteriaCount } = useScaffoldContractRead({
    contractName: "OrganizationSheet",
    functionName: "getCriteriaAmount",
    args: [orgId],
  });
  console.log("CriteriaCount", criteriaCount);

  const criteriaCalls = [];
  for (let i = 0; i < criteriaCount || 0; i++) {
    const contract = {
      abi: deployedContracts[31337].OrganizationSheet.abi,
      address: deployedContracts[31337].OrganizationSheet.address,
      functionName: "getCriteriaAtIndex",
      args: [orgId, BigInt(i)],
    };
    criteriaCalls.push(contract);
  }

  console.log("criteria calls", criteriaCalls);

  const { data: criteria } = useContractReads({ contracts: criteriaCalls });
  console.log(criteria, "criteria are here");

  return (
    <div>
      <div className="flex flex-cols justify-center items-center">
        <img src={orgInfo[1]} width={50} height={75} />
        <div className="flex-1 ml-4">
          <h1 className="text-3xl font-bold text-primary-content">{orgInfo[0]}</h1>
        </div>
      </div>

      <div className="mt-10 w-full flex flex-row justify-start items-start">
        <div className="w-[400px] flex flex-row items-center ">
          <div className="pr-3 cursor-pointer">
            <ChevronLeftIcon width={20} height={20} />
          </div>

          <p className="text-primary-content text-2xl">November 2023</p>
          <div className="pl-3 cursor-pointer">
            <ChevronRightIcon width={20} height={20} />
          </div>
        </div>

        <div className="flex-1 scroll-x flex flex-row">
          {admins?.map((admin: { result: string; status: string }, i) => {
            return (
              <div className={(i % 2 ? `bg-white/20` : `bg-white/10`) + " px-3"}>
                <p key={admin.result} className="text-sm">
                  {admin.result}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 w-full flex flex-row justify-start items-start">
        <div className="w-[400px]">
          {users?.map((user: { result: string; status: string }) => {
            return (
              <div className="h-5">
                <p className="text-sm" key={user.result}>
                  {user.result}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex-1 scroll-x flex flex-row">asds</div>
      </div>
    </div>
  );
}
