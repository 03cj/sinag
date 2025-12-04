import React, { useState } from "react";

const UpdateMoa = ({ company, onUpdateSuccess, onCancel }) => {
  const [moaFile, setMoaFile] = useState(null);
  const [moaStart, setMoaStart] = useState(company?.MOAStart || "");
  const [moaEnd, setMoaEnd] = useState(company?.MOAEnd || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // In real app: send form data to API (file upload + dates update)
    const updatedCompany = {
      ...company,
      moa: moaFile ? moaFile.name : company.moa,
      MOAStart: moaStart,
      MOAEnd: moaEnd,
    };

    onUpdateSuccess(updatedCompany); // return updated company
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Update MOA for {company.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload new MOA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload New MOA
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setMoaFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MOA Start Date
          </label>
          <input
            type="date"
            value={moaStart}
            onChange={(e) => setMoaStart(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MOA End Date
          </label>
          <input
            type="date"
            value={moaEnd}
            onChange={(e) => setMoaEnd(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMoa;
