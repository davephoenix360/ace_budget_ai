'use client'
import React, { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
//import {CardInfo} from '@/components/CardInfo';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <UserButton />
    </div>
  );
}