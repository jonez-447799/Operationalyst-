import React from 'react';
import { IcebergControlSystems } from './IcebergControlSystems';
import { B2BBehavioralSystem } from './B2BBehavioralSystem';

export function CommercialLandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Commercial Remediation & Conversion Hub</h1>
      <B2BBehavioralSystem />
      <div className="mt-8">
        <IcebergControlSystems />
      </div>
    </div>
  );
}

export default CommercialLandingPage;
