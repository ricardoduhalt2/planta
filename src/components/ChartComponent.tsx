import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables, ChartDataLabels);

interface ChartComponentProps {
  chartId: string;
  config: any; // Chart.js ChartConfiguration
  className?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartId, config, className }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!chartRef.current) return;

    // Destruir instancia anterior si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    try {
      chartInstanceRef.current = new Chart(ctx, {
        ...config,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...config.options,
          plugins: {
            ...config.options?.plugins,
            legend: {
              display: true,
              position: 'bottom' as const,
              labels: {
                color: '#f3f4f6',
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleFont: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
              bodyFont: { family: 'Inter, sans-serif', size: 12 },
              padding: 12,
              cornerRadius: 8,
              displayColors: true,
              boxPadding: 6,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed !== null) {
                    label += new Intl.NumberFormat('es-MX').format(context.parsed) + ' ';
                    const unit = context.dataset.label === t('liters') ? 'L' : 'kg';
                    label += unit;
                  }
                  return label;
                }
              }
            },
            datalabels: {
              color: '#ffffff',
              font: {
                weight: 'bold',
                size: 12
              },
              formatter: (value: number) => {
                return new Intl.NumberFormat('es-MX').format(value);
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }

    // Limpieza al desmontar
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [config, t]);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <canvas 
        id={chartId} 
        ref={chartRef} 
        className={className}
        aria-label={config?.options?.plugins?.title?.text || t('chartGenericAriaLabel')} 
        role="img"
      />
    </div>
  );
};

export default ChartComponent;