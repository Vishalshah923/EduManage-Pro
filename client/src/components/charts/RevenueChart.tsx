import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function RevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Fee Collection (₹ Lakhs)',
          data: [32, 35, 28, 40, 42, 45],
          borderColor: 'hsl(221, 83%, 53%)',
          backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'hsl(214, 32%, 91%)'
            }
          },
          x: {
            grid: {
              color: 'hsl(214, 32%, 91%)'
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
        <select className="px-3 py-1 text-sm border border-border rounded-md bg-background">
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>
      <div style={{ height: '300px' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
