import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

// Declare Chart as it's loaded from CDN
declare var Chart: any;

interface ChartComponentProps {
  chartId: string;
  config: any; // Chart.js ChartConfiguration
  className?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartId, config, className }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any | null>(null); // Holds the Chart instance
  const { t } = useLanguage(); // Get translation function

  useEffect(() => {
    if (typeof Chart === 'undefined') {
      console.error("Chart.js is not loaded. Make sure it's included in your HTML.");
      return;
    }

    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        try {
          chartInstanceRef.current = new Chart(ctx, config);
        } catch (error) {
          console.error("Error creating chart:", error, "with config:", config);
        }
      }
    }

    // Cleanup function to destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [config]); // Re-create chart if config changes

  return <canvas id={chartId} ref={chartRef} className={className} aria-label={config?.options?.plugins?.title?.text || t('chartGenericAriaLabel')} role="img"></canvas>;
};

export default ChartComponent;