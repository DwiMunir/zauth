'use client';

export default function DashboardPage({ user }: { user: any }) {

  const onHandleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.href = '/auth/login';
  };
  return (
    <div>
      <div>Hello {user.email}</div>
      <button onClick={onHandleLogout} className="bg-gray-200 px-4 py-2 rounded m-3">Logout</button>
    </div>
  );
}