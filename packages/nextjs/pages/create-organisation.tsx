import React from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export default function CreateOrganisation() {
  // const { address } = useAccount();
  const router = useRouter();
  // create a state for the form inputs
  const [name, setName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");
  const [github, setGithub] = React.useState("");
  const [totalTokenAlocation, setTotalTokenAlocation] = React.useState("");

  const { writeAsync, isLoading, isError, error } = useScaffoldContractWrite({
    contractName: "OrganizationSheet",
    functionName: "createOrganization",
    args: [name, imgUrl, website, github, BigInt(totalTokenAlocation)],
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "OrganizationSheet",
    eventName: "OrganizationCreated",
    listener: logs => {
      logs.map(log => {
        console.log(log, "new log", log.args.admin, log.args.name);
        //router.push(`/setup-organisation?org=${log.args.organization.toString()}`);
      });
    },
  });

  // render the form and the status
  return (
    <>
      <MetaHeader title="Create Organisation" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-content">Start using Chipper</h1>

        <h3 className="text-primary-content mt-4 opacity-60">
          Want to accelerate the development of your new idea? Get started by telling us about your Organisation:
        </h3>

        <br />

        <div className="w-2/3">
          <div className="flex flex-col mt-5">
            <label htmlFor="name" className="text-lg font-medium text-accent">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name of your awesome organisation"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input input-bordered border-none px-3 rounded mt-2"
              required
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="imgUrl" className="text-lg font-medium text-accent">
              Logo URL
            </label>
            <input
              id="imgUrl"
              type="url"
              placeholder="https://"
              value={imgUrl}
              onChange={e => setImgUrl(e.target.value)}
              className="input input-bordered border-none px-3 rounded mt-2"
              required
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="website" className="text-lg font-medium text-accent">
              Website
            </label>
            <input
              id="website"
              type="url"
              placeholder="https://"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="input input-bordered border-none px-3 rounded mt-2"
              required
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="github" className="text-lg font-medium text-accent">
              Github
            </label>
            <input
              id="website"
              type="url"
              placeholder="https://"
              value={github}
              onChange={e => setGithub(e.target.value)}
              className="input input-bordered border-none px-3 rounded mt-2"
              required
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="totalTokenAlocation" className="text-lg font-medium text-accent">
              Total amount of tokens to be allocated to the team
            </label>
            <input
              id="totalTokenAlocation"
              type="number"
              placeholder="1000000"
              value={totalTokenAlocation || 1000000}
              onChange={e => setTotalTokenAlocation(e.target.value)}
              className="input input-bordered border-none px-2 rounded mt-2"
              required
            />
          </div>

          <button
            onClick={() => writeAsync()}
            className="mt-5 bg-accent hover:bg-accent-focus text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
        {isError && <p className="text-red-500 font-medium mt-4">Organisation creation failed: {error?.message}</p>}
      </div>
    </>
  );
}
