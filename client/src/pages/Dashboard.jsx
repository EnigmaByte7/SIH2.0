import React from 'react';
import GridSmallBackground from '../components/ui/grid-small';
// NOTE: All chart-related imports are removed as they conflict with AnalysisDashboard's Recharts logic
// import {Line} from 'react-chartjs-2'
// import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
// import ThreeDCard from '../components/Card3D'; // Not needed in this file anymore
// import {Status, StatusIndicator, StatusLabel} from '../components/ui/shadcn-io/status'
import { ChevronLeft } from 'lucide-react';
// import { useChartStore } from '../../useChart'; // Removed conflicting state store
import AnalysisDashboard from '../components/AnalysisDashboard';


// Final component rendering only the AnalysisDashboard within the background
export default function Dashboard() {
  return (
    <GridSmallBackground>
        <Content />
    </GridSmallBackground>
  )
}


const Content = () => {
    // NOTE: All conflicting state and chart logic is removed from this scope
    // const {charts, addData, status, distance, serStatus, setDistance} = useChartStore();

    return (
        <div className="relative w-full flex justify-center items-center flex-col gap-8 py-16">
            
            {/* 1. Dashboard Title */}
            <div className="z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                Real-Time Fault Analysis
            </div>  
            
            {/* 2. Back Button (Retained) */}
            <a href='/'>
                <ChevronLeft strokeWidth={3} size={36} color='white' className='absolute top-8 left-8'></ChevronLeft>
            </a>
            
            {/* 3. CRITICAL: Only the AnalysisDashboard is rendered */}
            {/* This component contains the Socket.IO logic, Status Cards, and Charts */}
            <AnalysisDashboard />
            
        </div>
    )
}