import React from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function CreateOrganisation() {
  // create a state for the form inputs
  const [name, setName] = React.useState("");
  const [website, setWebsite] = React.useState("");

  const { writeAsync, isLoading, isError, error } = useScaffoldContractWrite({
    contractName: "OrganizationSheet",
    functionName: "createOrganization",
    args: [name],
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  // render the form and the status
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800">Create Organisation</h1>
      <div className="flex flex-col mb-4">
        <label htmlFor="name" className="text-lg font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded mt-2"
          required
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="website" className="text-lg font-medium text-gray-700">
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          className="border border-gray-300 p-2 rounded mt-2"
          required
        />
      </div>
      <button
        onClick={() => writeAsync()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
      {isError && <p className="text-red-500 font-medium mt-4">Organisation creation failed: {error?.message}</p>}
    </div>
  );
}
// import the useCreateOrganisation hook
