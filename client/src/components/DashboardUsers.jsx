import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashboardUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [UserIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axios.get(`/api/user/getusers`).then((res) => {
          if (res.data && res.status == 200) {
            setUsers(res.data?.users);
            if (res.data?.users?.length < 9) {
              setShowMore(false);
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async (e) => {
    e.preventDefault();
    const startIdx = users.length;
    try {
      await axios
        .get(`/api/user/getusers`, {
          params: { startIndex: startIdx },
        })
        .then((res) => {
          if (res.data && res.status == 200) {
            setUsers((prev) => [...prev, ...res.data?.users]);
            if (res.data?.users?.length < 9) {
              setShowMore(false);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
    try {
      setShowModal(false);
      await axios.delete(`api/user/delete/${UserIdToDelete}`).then((res) => {
        if (res.status == 200) {
          setUsers(users.filter((user) => user._id !== UserIdToDelete));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll mx-4 md:mx-auto p-3 my-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-center">
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>User Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>
                <span>Delete</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y divide-gray-400">
              {users.map((user, index) => (
                <Table.Row key={index} className="text-center">
                  <Table.Cell>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user?.username}</Table.Cell>
                  <Table.Cell>{user?.email}</Table.Cell>
                  <Table.Cell>
                    {user?.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true), setUserIdToDelete(user?._id);
                      }}
                      className="text-inherit font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="flex mx-auto text-teal-500 self-center rounded-md text-sm py-4 hover:underline"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>No Users yet</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header
          title="Delete Account"
          className=" text-gray-500 dark:text-gray-300"
        />
        <Modal.Body>
          <div className="text-center">
            <HiExclamationCircle className="h-14 w-14 mb-3 text-gray-500 dark:text-gray-300 mx-auto" />
            <h3 className=" text-gray-500 dark:text-gray-300 text-lg font-semibold">
              Are You Sure You want to Delete User ?
            </h3>
            <div className="flex gap-3 my-3 justify-center">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm Sure
              </Button>
              <Button
                className="bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
