import { useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../_global/components/Button";
import { Modal } from "../../_global/components/Dialog/dialog-v2";
import { Input } from "../../_global/components/Input";
import { InputLabel } from "../../_global/components/InputLabel";
import { Poppins } from "../../_global/components/Text";
import { convertQueryParamsToObject } from "../../_global/helper";
import { useModal } from "../../_global/hooks/useModal";
import { formatHourMinute } from "../../_global/lib/format-time";
import { initial } from "../../_global/utils/initial";
import { useFriend } from "../hooks/useFriend";
import { useAddFriend } from "../hooks/useFriendCreation";
import { useFriendSocket } from "../hooks/useFriendSocket";

interface FriendProps {
  name: string;
  description?: string;
  isOnline: boolean;
  lastSeen?: Date | null;
}

const Friend: React.FC<FriendProps> = ({
  name,
  description,
  isOnline,
  lastSeen,
}) => {
  return (
    <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {initial(name)}
          </div>
          {/* Online status indicator */}
          {isOnline ? (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          ) : (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
          )}
        </div>

        {/* Friend Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Poppins className="font-semibold text-gray-900 truncate">
              {name}
            </Poppins>
            {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> */}
          </div>
          <Poppins className="text-sm text-gray-500 truncate mt-0.5">
            {description || "No description"}
          </Poppins>
          {!isOnline && lastSeen ? (
            <Poppins className="text-xs text-gray-400 mt-1">
              Last seen at {formatHourMinute(lastSeen)}
            </Poppins>
          ) : (
            <Poppins className="text-xs text-gray-400 mt-1">Online Now</Poppins>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 transition-colors duration-200">
            <HiMiniUserGroup />
          </button>
          <button className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-colors duration-200">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FriendsViews = () => {
  const { closeModal, isOpen, openModal } = useModal();
  const mutation = useAddFriend();
  const [code, setCode] = useState("");
  const { data: friendsData } = useFriend();
  const { friends } = useFriendSocket(friendsData?.data || []);
  // console.log({ friends });
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = convertQueryParamsToObject(searchParams.toString());
  const qs = (key: string) => searchParams.get(key);
  const setQs = (key: string, val: string) => {
    setSearchParams({
      ...queries,
      [key]: val,
    });
  };

  const handleAddFriend = () => {
    mutation.mutate({ code });
  };

  // const { debugInfo } = useAblyConnection();
  // useEffect(() => {
  //   refetch();
  // }, [debugInfo, refetch]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-10">
          <div>
            <Poppins className="text-2xl font-bold text-gray-900">
              Friends
            </Poppins>
            <Poppins className="text-sm text-gray-500 mt-1">
              {friends?.length || 0} friends online
            </Poppins>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <Button onClick={openModal}>Add Friend</Button>
              </div>
              <Input
                value={qs("search") || ""}
                onChange={(e) => setQs("search", e.target.value)}
                inputSize="sm"
                placeholder="Search friends..."
                className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="space-y-4">
          {friends && friends.length > 0 ? (
            friends.map((item, index) => (
              <Friend
                isOnline={item.isOnline}
                name={item.name}
                key={index}
                lastSeen={item.lastSeen}
                description={item.description}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiMiniUserGroup className="text-5xl text-gray-600" />
              </div>
              <Poppins className="text-xl font-semibold text-gray-900 mb-2">
                No friends yet
              </Poppins>
              <Poppins className="text-gray-500 mb-6 max-w-sm mx-auto">
                {!Object.keys(queries).length
                  ? "Start building your network by adding friends using their friend codes."
                  : "Friend not found, change your filter query."}
              </Poppins>
              {!Object.keys(queries).length && (
                <Button onClick={openModal} variant="primary">
                  Add Your First Friend
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Friend Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="min-w-96 p-2">
          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <Poppins className="text-xl font-semibold text-gray-900 mb-2">
              Add New Friend
            </Poppins>
            <Poppins className="text-sm text-gray-500">
              Enter your friend's unique code to send them a friend request
            </Poppins>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <InputLabel
              title="Friend Code"
              direction="column"
              inputProps={{
                onChange: (e) => setCode(e.target.value),
                placeholder: "Enter friend code...",
                className:
                  "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
                value: code,
              }}
            />

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <Poppins className="text-sm font-medium text-blue-900 mb-1">
                    How to find friend codes
                  </Poppins>
                  <Poppins className="text-xs text-blue-700">
                    Ask your friend to share their unique friend code from their
                    profile page.
                  </Poppins>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant={mutation.isPending ? "disabled" : "primary"}
                onClick={handleAddFriend}
                className="flex-1"
                disabled={!code.trim() || mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Friend
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
