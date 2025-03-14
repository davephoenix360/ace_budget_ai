"use client";
import React, { useEffect } from "react";
import Image from "next/image";

import { LayoutGrid, PiggyBank, ReceiptText, ChartLine } from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },

    {
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/budget",
    },
    {
      id: 4,
      name: "Receipts",
      icon: ReceiptText,
      path: "/receipts",
    },

    {
      id: 5,
      name: "Analysis",
      icon: ChartLine,
      path: "/analysis",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        <Image src="/the file.png" alt="logo" width={120} height={80} />
      </div>
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                                        text-gray-500 font-medium
                                        mb-2
                                        p-4 cursor-pointer rounded-full
                                        hover:text-primary hover:bg-blue-100
                                        ${
                                          path == menu.path &&
                                          "text-primary bg-blue-100"
                                        }
                                        `}
            >
              {" "}
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
