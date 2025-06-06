'use client';

import React, { useEffect, useState } from 'react';
import { Bell, User, Users, Database, HardDrive, LogOut ,UserPlus ,Globe} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Homepage: React.FC = () => {
  const [phone, setPhone] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [vmCount, setVmCount] = useState<number | null>(null);


  const router = useRouter();

  // Fetch logged-in phone number from localStorage
  useEffect(() => {
    const storedPhone = localStorage.getItem('userPhone');
    if (!storedPhone) {
      router.push('/login');
    } else {
      setPhone(storedPhone);
    }
  
    // Fetch user count
    fetch('http://localhost:5000/api/user-count')
      .then(res => res.json())
      .then(data => setUserCount(data.total))
      .catch(err => console.error('Error fetching user count:', err));
  
    // ✅ Fetch VM count
    fetch('http://localhost:5000/api/vm-count')
      .then(res => res.json())
      .then(data => setVmCount(data.total))
      .catch(err => console.error('Error fetching VM count:', err));
  }, []);
  
  

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    router.push('/login');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const menuItems = [
    {
      title: 'Add New User',
      icon: <User size={24} className="text-indigo-600" />,
      description: 'Create and register new system users',
      href: '/adduser',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    },
    {
      title: 'Existing Users',
      icon: <Users size={24} className="text-emerald-600" />,
      description: 'View and manage existing user accounts',
      href: '/view-users',
      color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    },
    {
      title: 'Add New VM',
      icon: <Database size={24} className="text-amber-600" />,
      description: 'Add new VM Details',
      href: '/add-vm',
      color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    },
    {
      title: 'Existing VM Details',
      icon: <HardDrive size={24} className="text-sky-600" />,
      description: 'View and manage existing VM Details',
      href: '/view-vms',
      color: 'bg-sky-50 border-sky-200 hover:bg-sky-100',
    },
    {
      title: 'Add New Web Hosting User',
      icon: <UserPlus size={24} className="text-purple-600" />,  // Assuming you're using lucide-react icons
      description: 'Register a new web hosting user',
      href: '/add-webhostingusers',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
    {
      title: 'Existing Web Hosting Users',
      icon: <Globe size={24} className="text-pink-600" />,
      description: 'Manage existing web hosting users',
      href: '/existing-webhostingusers',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-full h-20 rounded- flex items-center justify-center text-white font-bold">
                <Image src="/logo.png" alt="Ernet India Logo" width={120} height={64} />
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <Image
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full bg-gray-300"
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                  />
                  <div className="ml-2 hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {phone || 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-500">Phone Number</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {phone || 'User'}
          </h1>
          <p className="mt-1 text-gray-500">Please select an option to proceed</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 rounded-lg border shadow-sm transition-all duration-200 ${item.color} hover:shadow-md cursor-pointer`}
              onClick={() => handleNavigation(item.href)}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white mb-4">
                {item.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              <div className="mt-4 text-sm font-medium text-blue-600">Access &rarr;</div>
            </div>
          ))}
        </div>

        {/* Status Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-50">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <span className="text-2xl font-semibold text-gray-900">
  {userCount !== null ? userCount : '...'}
</span>

              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-50">
                <HardDrive size={20} className="text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active VMs</h3>
                <span className="text-2xl font-semibold text-gray-900">
  {vmCount !== null ? vmCount : '...'}
</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-amber-50">
                <Database size={20} className="text-amber-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Storage Used</h3>
                <span className="text-2xl font-semibold text-gray-900">0%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500">
            &copy; 2025 VM Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
