import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const defaultoptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' ,
    },
    title: {
      display: false,
    }, 
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const defaultdata = {
  labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1}
  ],
};

export const useChartStore = create()(
  persist(
    (set) => ({
      charts: {
        "chart 1": { data: defaultdata, options: defaultoptions },
        "chart 2": { data: defaultdata, options: defaultoptions },
        "chart 3": { data: defaultdata, options: defaultoptions },
        "chart 4": { data: defaultdata, options: defaultoptions },
        "chart 5": { data: defaultdata, options: defaultoptions },
        "chart 6": { data: defaultdata, options: defaultoptions },
      },
      status: 'No Fault Detected',
      distance: 0,
      setStatus: (newStatus) => set({status: newStatus}),
      setDistance: (newDistance) => set({distance: newDistance}),
      addData: (chartName, label, value) =>
        set((state) => {
          const chart = state.charts[chartName];
          if (!chart) return state;

          return {
            charts: {
              ...state.charts,
              [chartName]: {
                ...chart,
                data: {
                  ...chart.data,
                  labels: [...chart.data.labels, label],
                  datasets: chart.data.datasets.map((ds) => ({
                    ...ds,
                    data: [...ds.data, value],
                  })),
                },
              },
            },
          };
        }),
    }),
    {
      name: "chartstore",
    }
  )
);
