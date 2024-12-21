import React from "react";

const SentEmailsTable = ({
  sentEmails,
  onClose,
}: {
  sentEmails: any[];
  onClose: () => void;
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sent Emails</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b text-left p-2">Subject</th>
            <th className="border-b text-left p-2">Recipient</th>
            <th className="border-b text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sentEmails.map((email: any, index) => (
            <tr key={index}>
              <td className="p-2">{email.subject}</td>
              <td className="p-2">{email.recipient}</td>
              <td className="p-2">{email.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Close
      </button> */}
    </div>
  );
};

export default SentEmailsTable;
