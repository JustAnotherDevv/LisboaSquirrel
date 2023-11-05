import React from "react";
import { useRouter } from "next/router";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function CreateOrganisation() {
  const router = useRouter();
  // create a state for the form inputs
  const [name, setName] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [github, setGithub] = React.useState("");

  const { writeAsync, isLoading, isError, error } = useScaffoldContractWrite({
    contractName: "OrganizationSheet",
    functionName: "createOrganization",
    args: [name, imgUrl, website, github, 1000000],
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
      router.push("/setup-organisation");
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
            className="input input-bordered border-none p-2 rounded mt-2"
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
            className="input input-bordered border-none p-2 rounded mt-2"
            required
          />
        </div>

        <div className="flex flex-col mt-5">
          <label htmlFor="github" className="text-lg font-medium text-accent">
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="input input-bordered border-none p-2 rounded mt-2"
            required
          />
        </div>

        <div className="flex flex-col mt-5">
          <label htmlFor="github" className="text-lg font-medium text-accent">
            Github
          </label>
          <input
            id="github"
            type="url"
            placeholder="https://"
            value={github}
            onChange={e => setGithub(e.target.value)}
            className="input input-bordered border-none p-2 rounded mt-2"
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
        {isError && <p className="text-red-500 font-medium mt-4">Organisation creation failed: {error?.message}</p>}
      </div>
    </>
  );
}
