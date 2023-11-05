import React, { useState } from "react";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAccount, useContractReads, useEnsAddress, useEnsName } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

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
      </div>
    </>
  );
}

function UserDashboard({ user }: { user: string }) {
  return <div>{user} s Dashboard</div>;
}

function UserToEnsName(props) {
  const { data, isError, isLoading, error } = useEnsName({
    address: props.result,
    chainId: 1,
  });
  console.log(props, data, "<<<<<<<<<", error || "");
  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>{props.result}</div>;
  return <div>{data}</div>;
}

function AdminDashboard({ orgId, orgInfo }: { orgId: bigint; orgInfo: any }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserAddy, setNewUserAddy] = useState("");

  const { writeAsync: writeNewUserAsync } = useScaffoldContractWrite({
    contractName: "OrganizationSheet",
    functionName: "addUserToOrganization",
    args: [orgId, newUserAddy],
  });

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

  const [mockCriteria, setMockCriteria] = useState([
    { id: 1, name: "Time", max: 4 },
    { id: 2, name: "Impact", max: 10 },
    { id: 3, name: "Reliability", max: 3 },
    { id: 4, name: "Team", max: 15 },
  ]);
  const [inputValues, setInputValues] = useState([]);

  const handleVoteInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...inputValues];
    list[index][name] = value;
    setInputValues(list);
  };
  const args = [orgId, votePeriodIndex, _votedOnUser, criteriaIndex, inputValues];

  const { writeAsync: writeVotesToChain } = useScaffoldContractWrite({
    contractName: "OrganizationSheet",
    functionName: "voteAllocationPeriod",
    args,
  });

  const handleVoteSubmit = () => {
    writeVotesToChain();
  };

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
              <div className={(i % 2 ? `bg-white/20` : `bg-white/10`) + " px-5"}>
                <p key={admin.result} className="text-sm">
                  {admin.result}

                  <div className="flex flex-row mt-3">
                    {mockCriteria.map(c => {
                      return (
                        <div
                          onChange={e => {
                            c.value = e.target.value;
                          }}
                          className="w-20 text-sm text-center"
                        >
                          {c.name}
                        </div>
                      );
                    })}
                  </div>
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
              <div className="flex flex-col justify-center h-[50px] border-b-2 border-b-white/20 text-sm">
                <UserToEnsName result={user.result}></UserToEnsName>
              </div>
            );
          })}

          <div className="bg-white/5 p-3">
            <div className="text-sm font-semibold text-primary-content  opacity-70">Add New User</div>
            <div className="mt-3">
              <input
                type="text"
                onChange={e => setNewUserAddy(e.target.value)}
                className="w-full h-8 rounded-md text-left bg-transparent focus:bg-white/10 border-slate-500 border-2"
              />
            </div>
            <div>
              <button
                onClick={() => writeNewUserAsync()}
                className="bg-accent hover:bg-accent-focus text-white font-bold py-1 px-3 rounded-full mt-3"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 scroll-x flex flex-col">
          {users?.map((user: { result: string; status: string }) => {
            return (
              <div className="flex flex-row h-[50px] items-center border-b-white/20  border-b-2">
                {mockCriteria.map((c, index) => {
                  return (
                    <>
                      <input
                        type="number"
                        max={c.max}
                        name="value"
                        value={inputValues[index]?.value || ""}
                        onChange={event => handleVoteInputChange(event, index)}
                        className="w-20 h-8 rounded-md text-center bg-transparent focus:bg-white/10 border-slate-500 border-2 mx-2"
                      />
                    </>
                  );
                })}
                <button
                  onClick={handleVoteSubmit}
                  className="w-20 h-8 text-center bg-accent hover:bg-accent-focus text-white font-bold py-1 px-3 rounded-full  mx-2"
                >
                  Save
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
