import React, {useState} from 'react'
import GridSmallBackground from '../components/ui/grid-small'
import {Line} from 'react-chartjs-2'
import {
   Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ThreeDCard from '../components/Card3D';
import {Status, StatusIndicator, StatusLabel} from '../components/ui/shadcn-io/status'
const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.restore();
  },
};
import { ChevronLeft } from 'lucide-react';
import { useChartStore } from '../../useChart';
import AnalysisDashboard from '../components/AnalysisDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  plugin
);

export default function Dashboard() {
  return (
    <GridSmallBackground>
        <Content />
    </GridSmallBackground>
  )
}


const Content = () => {
    const {charts, addData, status, distance, serStatus, setDistance} = useChartStore();

    return (
        <div className="relative w-full flex justify-center items-center flex-col gap-8 py-16">
            <div className=" z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
                Dashboard
            </div>  
            <a href='/'><ChevronLeft strokeWidth={3} size={36} color='white' className='absolute top-8 left-8'></ChevronLeft></a>
            <div className='z-20 w-full flex flex-row justify-center items-center gap-8'>
                <div className='flex flex-col gap-3 p-5 rounded-2xl border-2 border-slate-700 bg-slate-800'>
                    <div className='text-white text-2xl text-center font-semibold flex flex-row items-center justify-center gap-4'>
                        <div><Status status='online'><StatusIndicator></StatusIndicator></Status></div>
                        <div>Live Fault Status</div>
                    </div>
                    <div className='text-white text-xl'>Fault : <span className={status.startsWith("No") === true ? `text-lime-400 px-2` : 'text-rose-400 px-2'}>{status}</span></div> 
                    <div className='text-white text-xl'>Distance : <span className={distance === 0 ? 'text-lime-400 px-2' : 'text-rose-400 px-2'}>{distance} Km</span></div> 
                </div>
            </div>
            {/* <div className='w-1/5 h-7 bg-blue-200 rounded-xl p-2 text-white text-center' onClick={()=> addData('chart 1', 'August', 33)}>Add</div> */}
            <div className='w-full flex flex-row justify-center items-center gap-8'>
                <ThreeDCard title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line  options={charts['chart 1'].options} data={charts['chart 1'].data} />
                    </div>
                </ ThreeDCard>

                <ThreeDCard  title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line options={charts['chart 2'].options} data={charts['chart 2'].data} />
                    </div>
                </ ThreeDCard>                
                <ThreeDCard title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line options={charts['chart 3'].options} data={charts['chart 3'].data} />
                    </div>
                </ ThreeDCard>
            </div>
            <div className='w-full flex flex-row justify-center items-center gap-12'>
                <ThreeDCard title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line options={charts['chart 4'].options} data={charts['chart 4'].data} />
                    </div>
                </ ThreeDCard>

                <ThreeDCard title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line options={charts['chart 5'].options} data={charts['chart 5'].data} />
                    </div>
                </ ThreeDCard>                
                <ThreeDCard title={'chart 1'}>
                    <div className='w-full h-full'>
                        <Line options={charts['chart 6'].options} data={charts['chart 6'].data} />
                    </div>
                </ ThreeDCard>
            </div>

        <AnalysisDashboard />
        </div>
    )
}
