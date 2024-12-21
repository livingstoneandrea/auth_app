"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidToken, logout } from "@/utils/auth";
import { getCookie } from "@/utils/cookies";
import { fetchUserProfile, fetchAllUsers } from "@/lib/api/profile";
import { useUserStore } from "@/stores/userStore";
import Modal from "@/components/Modal";
import ContactForm from "@/components/ContactForm";
import GroupForm from "@/components/GroupForm";
import EmailForm from "@/components/EmailForm";
import AddContactToGroupForm from "@/components/AddContactToGroupForm";
import SendEmailToGroupForm from "@/components/SendEmailToGroupForm";
import SentEmailsTable from "@/components/SentEmailsTable";
import {
  deleteUser,
  downgradePlan,
  grantAdmin,
  revokeAdmin,
  upgradePlan,
} from "@/lib/api/auth";
import Header from "@/components/Header";
import { deleteEmail } from "@/lib/api/contact";

const Dashboard = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "contacts" | "groups" | "emails" | "users"
  >("contacts");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    | "contact"
    | "group"
    | "email"
    | "addContactToGroup"
    | "sendEmailToGroup"
    | "viewSentEmails"
    | null
  >(null);

  const [groups, setGroups] = useState<any[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [users, setUsers] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [sentEmail, setSentEmail] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!isValidToken()) {
        logout();
        router.push("/sign-in");
        return;
      }
      const token = getCookie("authToken");
      // const currentUser  = getCookie("user");

      try {
        const profile = await fetchUserProfile(token as string);
        console.log(profile);
        setUser(profile?.data);
        setGroups(profile?.data?.groups || []);

        if (profile?.data?.role.includes("admin")) {
          const allUsers = await fetchAllUsers(token as string); // Fetch users if admin
          setUsers(allUsers || []);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        logout();
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, setUser]);

  const openModal = (
    type:
      | "contact"
      | "group"
      | "email"
      | "addContactToGroup"
      | "sendEmailToGroup"
      | "viewSentEmails",
    data?: any
  ) => {
    setModalType(type);

    if (type === "addContactToGroup") {
      setSelectedContactId(data || null);
    }

    if (type === "viewSentEmails") {
      setSentEmails(data || []);
    }

    if (type === "email") {
      setSentEmail(data || "");
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedContactId(null);
    setSentEmails([]);
    setSentEmail("");
    setModalOpen(false);

    router.replace("/dashboard");
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/sign-in");
  };

  const handlePlanChange = async (user: any) => {
    const token = getCookie("authToken");
    try {
      if (user.plan === "gold") {
        // Downgrade Plan
        await downgradePlan(user._id, token as string);
        alert(`User ${user.email} downgraded successfully.`);
      } else {
        // Upgrade Plan
        await upgradePlan(user._id, token as string);
        alert(`User ${user.email} upgraded to gold successfully.`);
      }

      const usersResponse = await fetchAllUsers(token as string);
      setUsers(usersResponse?.data || []);
    } catch (error) {
      console.error("Failed to change plan:", error);
      alert("An error occurred while changing the plan.");
    }
  };

  const handleAdminRoleChange = async (user: any) => {
    const token = getCookie("authToken");
    try {
      if (user.role.includes("admin")) {
        // Revoke Admin
        await revokeAdmin(user._id, token as string);
        alert(`Admin role revoked from ${user.email} successfully.`);
      } else {
        // Grant Admin
        await grantAdmin(user._id, token as string);
        alert(`Admin role granted to ${user.email} successfully.`);
      }
      // refresh users
      const usersResponse = await fetchAllUsers(token as string);
      setUsers(usersResponse?.data || []);
    } catch (error) {
      console.error("Failed to change admin role:", error);
      alert("An error occurred while changing the admin role.");
    }
  };

  const handleDeleteEmail = async (email_id: any) => {
    const token = getCookie("authToken");
    try {
      await deleteEmail(email_id, token as string);
      alert(`Email deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete an email:", error);
      alert("An error occurred while changing the plan.");
    }
  };

  const handleDeleteUser = async (userId: any) => {
    const token = getCookie("authToken");
    try {
      await deleteUser(userId, token as string);
      alert(`user deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete a user:", error);
      alert("An error occurred while changing the plan.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col mx-auto justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <div className="flex h-screen p-6">
        {user && (
          <>
            {/* Left Section: User Info */}
            <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4">User profile</h2>
              <div className="mb-2">
                <span className="font-semibold">Name:</span> {user.first_name}{" "}
                {user.last_name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Email:</span> {user.email}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Phone:</span> {user.msisdn}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Plan:</span> {user.plan}
              </div>
              <div>
                <span className="font-semibold">Role:</span>{" "}
                {user.role.join(", ")}
              </div>
            </div>

            {/* Right Section: Tabs */}
            <div className="w-2/3 ml-6 bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between mb-4">
                {/* Action Buttons */}
                <div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openModal("contact")}
                  >
                    Add New Contact
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openModal("group")}
                  >
                    Create New Group
                  </button>
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal("sendEmailToGroup")}
                  >
                    Send New Email
                  </button>
                </div>
              </div>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm ${
                    activeTab === "contacts"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("contacts")}
                >
                  Contacts
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    activeTab === "groups"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("groups")}
                >
                  Groups
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    activeTab === "emails"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("emails")}
                >
                  Emails
                </button>
                {user.role.includes("admin") && (
                  <button
                    className={`px-4 py-2 text-sm ${
                      activeTab === "users"
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    Users
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "contacts" && (
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b text-left p-2">Name</th>
                        <th className="border-b text-left p-2">Email</th>
                        <th className="border-b text-left p-2">Phone</th>
                        <th className="border-b text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.contacts.map((contact: any) => (
                        <tr key={contact._id}>
                          <td className="p-2">{contact.name}</td>
                          <td className="p-2">{contact.email}</td>
                          <td className="p-2">{contact.phone}</td>
                          <td className="p-2">
                            <button
                              className="text-purple-500 px-4"
                              onClick={() =>
                                openModal("addContactToGroup", contact._id)
                              }
                            >
                              add to group
                            </button>
                            <button
                              className="text-blue-500"
                              onClick={() => openModal("email", contact.email)}
                            >
                              sent email
                            </button>
                            {/* <button className="text-red-500 ml-2">Delete</button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "groups" && (
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b text-left p-2">Group Name</th>
                        <th className="border-b text-left p-2">Contacts</th>
                        {/* <th className="border-b text-left p-2">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {user.groups.map((group: any) => (
                        <tr key={group._id}>
                          <td className="p-2">{group.group_name}</td>
                          <td className="p-2">{group.contacts.length}</td>
                          {/* <td className="p-2">
                            <button className="text-blue-500">
                              view contacts
                            </button>
                      
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "emails" && (
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b text-left p-2">Subject</th>
                        <th className="border-b text-left p-2">Recipient</th>
                        <th className="border-b text-left p-2">Status</th>
                        <th className="border-b text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.emails.map((email: any) => (
                        <tr key={email._id}>
                          <td className="p-2">{email.subject}</td>
                          <td className="p-2">{email.recipient}</td>
                          <td className="p-2">{email.status}</td>
                          <td className="p-2">
                            {email.status === "failed" && (
                              <button className="text-orange-500">Retry</button>
                            )}
                            <button
                              className="text-red-500 ml-2"
                              onClick={() => handleDeleteEmail(email._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {user.role.includes("admin") && (
                  <>
                    {activeTab === "users" && (
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border-b text-left p-2">Name</th>
                            <th className="border-b text-left p-2">Email</th>
                            <th className="border-b text-left p-2">Role</th>
                            <th className="border-b text-left p-2">Plan</th>
                            <th className="border-b text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user: any) => (
                            <tr key={user._id}>
                              <td className="p-2">
                                {user.first_name} {user.last_name}
                              </td>
                              <td className="p-2">{user.email}</td>
                              <td className="p-2">{user.role.join(", ")}</td>
                              <td className="p-2">{user.plan}</td>
                              <td className="p-2">
                                {/* View Sent Emails Button */}
                                <button
                                  className="text-blue-500 mr-2"
                                  onClick={() =>
                                    openModal("viewSentEmails", user.sentEmails)
                                  }
                                >
                                  View Sent Emails
                                </button>

                                {/* Upgrade/Downgrade Plan Button */}
                                <button
                                  className={`${
                                    user.plan === "gold"
                                      ? "bg-orange-500 text-white"
                                      : "bg-green-500 text-white"
                                  } px-4 py-2 rounded mr-2`}
                                  onClick={() => handlePlanChange(user)}
                                >
                                  {user.plan === "gold"
                                    ? "Downgrade Plan"
                                    : "Upgrade to Gold"}
                                </button>

                                {/* Grant/Revoke Admin Button */}
                                <button
                                  className={`${
                                    user.role.includes("admin")
                                      ? "bg-red-500 text-white"
                                      : "bg-blue-500 text-white"
                                  } px-4 py-2 rounded`}
                                  onClick={() => handleAdminRoleChange(user)}
                                >
                                  {user.role.includes("admin")
                                    ? "Revoke Admin"
                                    : "Grant Admin"}
                                </button>

                                {/* <button
                                  className="bg-red-500 px-4 py-2 rounded"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  delete
                                </button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalType}>
          {modalType === "contact" && <ContactForm onClose={closeModal} />}
          {modalType === "group" && <GroupForm onClose={closeModal} />}
          {modalType === "email" && (
            <EmailForm sentEmail={sentEmail} onClose={closeModal} />
          )}
          {modalType === "addContactToGroup" && (
            <AddContactToGroupForm
              groups={groups}
              contactId={selectedContactId}
              onClose={closeModal}
            />
          )}
          {modalType === "sendEmailToGroup" && (
            <SendEmailToGroupForm groups={groups} onClose={closeModal} />
          )}
          {modalType === "viewSentEmails" && (
            <SentEmailsTable sentEmails={sentEmails} onClose={closeModal} />
          )}
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
