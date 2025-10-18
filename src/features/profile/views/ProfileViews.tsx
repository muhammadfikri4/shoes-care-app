import { Poppins } from "../../_global/components/Text";
import { initial } from "../../_global/utils/initial";
import { useProfile } from "../hooks/useProfile";

export const ProfileViews = () => {
  const { data: profile } = useProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with background pattern */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-6 pt-8 pb-16">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          {/* Status indicator */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Poppins className="text-white text-xs font-medium">Online</Poppins>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30 shadow-xl">
                {initial(profile?.data?.name ?? "")}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Name and Username */}
            <div className="text-center mt-4">
              <Poppins className="text-white text-xl font-semibold">
                {profile?.data?.name}
              </Poppins>
              <Poppins className="text-white/80 text-sm mt-1">
                @johnnydoe
              </Poppins>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="text-center">
              <Poppins className="text-2xl font-bold text-gray-800">142</Poppins>
              <Poppins className="text-xs text-gray-500 uppercase tracking-wide">Messages</Poppins>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="text-center">
              <Poppins className="text-2xl font-bold text-gray-800">28</Poppins>
              <Poppins className="text-xs text-gray-500 uppercase tracking-wide">Chats</Poppins>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <Poppins className="font-semibold text-gray-800">Profile Information</Poppins>
          </div>
          
          <div className="p-6 space-y-6">
            {/* User ID */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Poppins className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  User ID
                </Poppins>
                <Poppins className="text-sm font-medium text-gray-800 mt-1">
                  {profile?.data?.code}
                </Poppins>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Poppins className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Email Address
                </Poppins>
                <Poppins className="text-sm font-medium text-gray-800 mt-1">
                  {profile?.data?.email}
                </Poppins>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Last Seen */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Poppins className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Last Seen
                </Poppins>
                <Poppins className="text-sm font-medium text-gray-800 mt-1">
                  Just now
                </Poppins>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
            <Poppins className="font-medium">Edit Profile</Poppins>
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]">
              <Poppins className="font-medium">Settings</Poppins>
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]">
              <Poppins className="font-medium">Privacy</Poppins>
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};