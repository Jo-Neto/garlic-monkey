import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Message } from './type';

interface ChatProps {
  className?: string;
}

const TEST_MESSAGES: Message[] = [
  {
    user: 'User 1',
    message: 'Olá mundo!',
    time: '01/01/2000',
  },
  {
    user: 'User 2',
    message: 'Fala direito, man!',
    time: '01/01/2000',
  },
  {
    user: 'User 1',
    message: 'Olá mundo!',
    time: '01/01/2000',
  },
  {
    user: 'User 2',
    message: 'Fala direito, man!',
    time: '01/01/2000',
  },
  {
    user: 'User 1',
    message: 'Olá mundo!',
    time: '01/01/2000',
  },
  {
    user: 'User 2',
    message: 'Fala direito, man!',
    time: '01/01/2000',
  },
  {
    user: 'User 1',
    message: 'Olá mundo!',
    time: '01/01/2000',
  },
  {
    user: 'User 2',
    message: 'Fala direito, man!',
    time: '01/01/2000',
  },
  {
    user: 'User 1',
    message: 'Olá mundo!',
    time: '01/01/2000',
  },
  {
    user: 'User 2',
    message: 'Fala direito, man!',
    time: '01/01/2000',
  },
];

export function Chat({ className }: ChatProps) {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  useEffect(() => {
    setMessages(TEST_MESSAGES);
  }, []);

  return (
    <div
      className={twMerge(
        'w-80 pt-2 flex flex-col items-center max-h-52 overflow-y-scroll bg-slate-800',
        className,
      )}
    >
      {messages &&
        messages.map(({ user, message, time }, index) => (
          <div
            className="w-11/12 flex flex-col items-center"
            key={user + message + time + index}
          >
            <div className="w-full flex flex-row justify-between p-2 rounded-t-md bg-slate-600 text-xs">
              <span>{user}</span>
              <span>{time}</span>
            </div>
            <span className="w-full rounded-b-md p-2 mb-2 bg-slate-600">
              {message}
            </span>
          </div>
        ))}
    </div>
  );
}
