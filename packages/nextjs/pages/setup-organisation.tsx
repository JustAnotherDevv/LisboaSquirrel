import React, { useState } from "react";
import { useRouter } from "next/router";
import { MetaHeader } from "~~/components/MetaHeader";

export default function SetupOrganisation() {
  const router = useRouter();
  const { org } = router.query;

  const [rows, setRows] = useState([
    { criteria: "Time", max: 3 },
    { criteria: "Impact", max: 10 },
    { criteria: "Reliability", max: 10 },
    { criteria: "Cofounder", max: 15 },
  ]);

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { criteria: "", max: "" }]);
  };

  const allDisabled = rows.every(row => row.isDisabled);

  return (
    <>
      <MetaHeader title="Create Organisation" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-content">Let's get cracking!</h1>

        <h3 className="text-primary-content mt-4 opacity-60">
          Every month you will need to score your team members on the following criteria.
        </h3>

        <div className="space-y-4">
          {rows.map((row, index) => (
            <CriteriaRow
              key={index}
              index={index}
              criteria={row.criteria}
              max={row.max}
              onChange={handleRowChange}
              isApplied={row.isApplied}
            />
          ))}
          <button disabled className="px-4 py-2 rounded-md text-white bg-blue-500" onClick={handleAddRow}>
            Add Row
          </button>
          {allDisabled && (
            <button className="px-4 py-2 rounded-md text-white bg-blue-500" onClick={() => router.push("/org/0")}>
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function CriteriaRow({ index, criteria, max, onChange, isApplied }) {
  const [isDisabled, setIsDisabled] = useState(true);

  const handleApply = () => {
    // contract call
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="w-1/2">
        <input
          type="text"
          className="w-full border-gray-300 rounded-md shadow-sm"
          placeholder="Criteria name"
          value={criteria}
          onChange={e => onChange(index, "criteria", e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <div className="w-1/2">
        <input
          type="number"
          className="w-full border-gray-300 rounded-md shadow-sm"
          placeholder="Max value"
          value={max}
          onChange={e => onChange(index, "max", e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <button
        className={`px-4 py-2 rounded-md text-white ${isApplied ? "bg-green-500" : "bg-blue-500"}`}
        onClick={handleApply}
        disabled={isApplied}
      >
        {isApplied ? "Applied" : "Apply"}
      </button>
    </div>
  );
}
