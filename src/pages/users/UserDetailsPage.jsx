import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/ui/shared/PageContainer";
import PageHeader from "../../components/ui/shared/PageHeader";
import Button from "../../components/ui/shared/Button";
import UserStatusBadge from "../../components/users/UserStatusBadge";

// In real app fetch by id
const mockUserById = (id) => ({
  id,
  parentName: "Anna Mitchell",
  email: "anna.mitchell@email.com",
  childNames: "Leo M.",
  childAge: "5 yrs",
  role: "Parent",
  lastActive: "May 12, 2025",
  status: "suspended",
});

const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const data = mockUserById(id);
    setUser(data);
  }, [id]);

  if (!user) {
    return (
      <PageContainer>
        <PageHeader title="User Management" />
        <div className="mt-10 text-center text-sm text-slate-500">
          Loading user…
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="User Management" />

      <div className="mt-4">
        <div className="mx-auto max-w-xl rounded-3xl bg-white/95 p-5 shadow-md sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Users &gt; View User
              </div>
              <h2 className="mt-1 text-sm font-semibold text-slate-900">
                {user.parentName}
              </h2>
            </div>
            <button
              onClick={() => navigate("/users")}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Parent Name
                </div>
                <div className="mt-1 text-slate-900">{user.parentName}</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Email
                </div>
                <div className="mt-1 break-all text-slate-900">
                  {user.email}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Child Name(s)
                </div>
                <div className="mt-1 text-slate-900">{user.childNames}</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Child Age
                </div>
                <div className="mt-1 text-slate-900">{user.childAge}</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Role
                </div>
                <div className="mt-1 text-slate-900">{user.role}</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Last Active
                </div>
                <div className="mt-1 text-slate-900">{user.lastActive}</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Status
                </div>
                <div className="mt-1">
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              This area can be extended with recent login activity, linked
              devices, and child profile details once integrated with the
              backend.
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              className="rounded-xl bg-emerald-400 px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500"
              onClick={() => navigate("/users")}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UserDetailsPage;
