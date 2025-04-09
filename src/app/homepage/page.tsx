"use client";

import React from "react";
import { Bell, User, Users, Database, HardDrive, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Homepage from "@/components/Homepage";
import withAuth from "@/components/withAuth";

function HomePage(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Homepage/>
    </div>
  );
};

export default withAuth(HomePage);