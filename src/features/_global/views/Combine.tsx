// // 📦 File: src/api/axios.ts
// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://localhost:3001/api',
// });

// // 📦 File: src/hooks/useAuth.ts
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { api } from '../api/axios';

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async ({ email, password }: { email: string; password: string }) => {
//       const res = await api.post('/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       return res.data;
//     },
//   });
// };

// export const useRegister = () => {
//   return useMutation({
//     mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
//       const res = await api.post('/auth/register', { name, email, password });
//       return res.data;
//     },
//   });
// };

// export const useProfile = () => {
//   return useQuery({
//     queryKey: ['me'],
//     queryFn: async () => {
//       const token = localStorage.getItem('token');
//       const res = await api.get('/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     },
//   });
// };

// interface Message {
//   id: string;
//   senderId: string;
//   content: string;
//   createdAt: string;
// }

// export const Chat = ({ roomId, userId }: { roomId: string; userId: string }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [content, setContent] = useState('');
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     api.get(`/rooms`) // assumed room details API includes messages
//       .then((res) => {
//         const room = res.data.find((r: any) => r.id === roomId);
//         if (room) setMessages(room.messages);
//       });

//     const socket = new WebSocket('ws://localhost:3001');
//     socketRef.current = socket;

//     socket.onopen = () => {
//       socket.send(JSON.stringify({ type: 'join', payload: { roomId } }));
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'message') {
//         setMessages((prev) => [...prev, data.payload]);
//       }
//     };

//     return () => socket.close();
//   }, [roomId]);

//   const sendMessage = () => {
//     if (socketRef.current && content.trim()) {
//       socketRef.current.send(
//         JSON.stringify({
//           type: 'message',
//           payload: {
//             roomId,
//             senderId: userId,
//             content,
//           },
//         })
//       );
//       setContent('');
//     }
//   };

//   return (
//     <div>
//       <div className="h-64 overflow-y-auto bg-gray-100 p-4">
//         {messages.map((msg) => (
//           <div key={msg.id} className="mb-2">
//             <b>{msg.senderId}:</b> {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex mt-2">
//         <input
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="flex-1 border px-3 py-2"
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white px-4 ml-2">Send</button>
//       </div>
//     </div>
//   );
// };


// export const Login = () => {
//   const { mutateAsync } = useLogin();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     await mutateAsync({ email, password });
//     navigate('/rooms');
//   };

//   return (
//     <div>
//       <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };
