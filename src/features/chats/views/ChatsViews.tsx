import { Badge } from "../../_global/components/Badge";
import { Input } from "../../_global/components/Input";
import { Poppins } from "../../_global/components/Text";

const Chat = () => {
  return (
    <div className="flex gap-4">
      <div className="w-20 bg-gray-500 rounded-xl"></div>
      <div className="flex flex-col gap-2">
        <Poppins className="font-semibold">John Doe</Poppins>
        <Poppins className="text-xs text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Poppins>
      </div>
    </div>
  );
};

export const ChatsViews = () => {
  return (
    <div>
      <div className="border-r border-r-gray-300 border-solid w-96 min-h-screen">
        <div className="border-b border-b-gray-300 border-solid">
          <div className="px-6 py-6">
            <div className="flex items-center gap-4">
              <Poppins className="font-semibold text-xl">Chats</Poppins>
              <Badge size="sm" variant="ghost">
                10
              </Badge>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 flex flex-col gap-6">
          <Input placeholder="Search..." />
          <div className="flex flex-col gap-10">
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};
