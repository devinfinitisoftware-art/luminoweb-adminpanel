import React from "react";
import IconButton from "../ui/shared/IconButton";
import StatusPill from "../ui/shared/StatusPill";
import { FiTrash2 } from "react-icons/fi";

const defaultMembers = [
  {
    id: 1,
    name: "Anna Mitchell",
    role: "Member",
    joinedOn: "May 15, 2025",
    posts: 12,
    reports: 0,
    status: "active",
  },
  {
    id: 2,
    name: "James Carter",
    role: "Moderator",
    joinedOn: "April 2, 2025",
    posts: 38,
    reports: 4,
    status: "active",
  },
];

const statusConfig = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "danger" },
};

const CommunityMembersTable = ({ members, onRemove }) => {
  const data = members || defaultMembers;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Members</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
              <th className="py-2 pl-4 pr-4">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Joined On</th>
              <th className="px-4 py-2">Posts</th>
              <th className="px-4 py-2">Reports</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((member, idx) => {
              const meta = statusConfig[member.status] ?? {
                label: member.status,
                variant: "neutral",
              };

              return (
                <tr
                  key={member.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                >
                  <td className="py-3 pl-4 pr-4 text-slate-800">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{member.role}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {member.joinedOn}
                  </td>
                  <td className="px-4 py-3 text-slate-800">{member.posts}</td>
                  <td className="px-4 py-3 text-slate-800">{member.reports}</td>
                  <td className="px-4 py-3">
                    <StatusPill variant={meta.variant}>{meta.label}</StatusPill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <IconButton
                        aria-label="Remove member"
                        size="sm"
                        variant="ghost-danger"
                        onClick={() => onRemove?.(member)}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-xs text-slate-400"
                >
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityMembersTable;
