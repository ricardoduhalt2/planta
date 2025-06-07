import React from 'react';
import { PlantData, KeyValueSpec, ProductionTableEntry, PlantSection, CommonText } from '../types';
import { PETGAS_DARK_GREY, PETGAS_LIGHT_GREY, PETGAS_MEDIUM_GREY, MODERN_BLUE, MODERN_TEAL } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import ChartComponent from './ChartComponent';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

// Basic SVG Icon components (can be expanded or moved to a separate file)
const SectionIcon: React.FC<{ type: PlantSection | string }> = ({ type }) => {
  let pathData = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"; // Default: clipboard-list

  switch (type) {
    case PlantSection.GENERALITIES: pathData = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; break; // information-circle
    case PlantSection.BENEFITS: pathData = "M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 6c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"; break; // Dots vertical or similar for features/benefits
    case PlantSection.GENERAL_DESCRIPTION: pathData = "M4 6h16M4 10h16M4 14h16M4 18h16"; break; // Menu / text lines
    case PlantSection.TRANSFORMATION_SYSTEM: pathData = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"; break; // Settings/Cog
    case PlantSection.TECHNICAL_SPECS: pathData = "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"; break; // Table/Grid
    case PlantSection.POWER_ENERGY: pathData = "M13 10V3L4 14h7v7l9-11h-7z"; break; // Lightning bolt
    case PlantSection.MAINTENANCE: pathData = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"; break; // Wrench/Tool (using cog as placeholder)
    case PlantSection.CONSUMABLES: pathData = "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"; break; // Shopping bag
    case PlantSection.OPERATIONAL_REQUIREMENTS: pathData = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; break; // Check circle
    case PlantSection.ADDITIONAL_CONSIDERATIONS: pathData = "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-4.418 4.03-8 9-8s9 3.582 9 8z"; break; // Exclamation Circle or Dots
    case PlantSection.PRODUCTION_ANALYSIS: pathData = "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"; break; // Chart bar
    case PlantSection.FINANCIAL_ANALYSIS: pathData = "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"; break; // Credit card
    case "priceInfoTitle": pathData = "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; break; // Cash / currency
  }
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 inline-block text-[#009A44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={pathData} />
    </svg>
  );
};


interface AnimatedSectionProps {
  titleKey: string;
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  iconType?: PlantSection | string;
  additionalTitleClassName?: string;
}

const AnimatedSectionCard: React.FC<AnimatedSectionProps> = ({ titleKey, children, iconType, additionalTitleClassName = '' }) => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <div 
      ref={ref} 
      className={`fade-in ${isVisible ? 'visible' : ''} backdrop-blur-md bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 rounded-2xl mb-10 overflow-hidden`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <h2 className={`text-3xl font-bold mb-6 border-b-2 border-[#A0D468] pb-3 flex items-center text-white ${additionalTitleClassName}`}>
        {iconType && <SectionIcon type={iconType} />}
        {t(titleKey)}
      </h2>
      <div className="text-gray-200">
        {children}
      </div>
    </div>
  );
};


interface TableProps {
  data: KeyValueSpec[] | ProductionTableEntry[];
  headersKey: [CommonText, CommonText]; 
  striped?: boolean;
}

const DetailTable: React.FC<TableProps> = ({ data, headersKey, striped = true }) => {
  const { t } = useLanguage(); 
  
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <thead className={`bg-white/5`}>
          <tr>
            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider w-1/3`}>
              {t(headersKey[0])} 
            </th>
            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider w-2/3`}>
              {t(headersKey[1])}
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-white/10`}>
          {data.map((item, index) => {
            const rowKeyOrConcept = 'key' in item ? item.key : item.concept;
            const rowValue = 'value' in item ? item.value : item.specification;
            return (
              <tr 
                key={t(rowKeyOrConcept) + index} 
                className={`${striped && index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} hover:bg-white/10 transition-colors`}
              >
                <td className={`px-6 py-4 whitespace-normal text-sm font-medium text-white`}>
                  {t(rowKeyOrConcept)}
                </td>
                <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-100">
                  {typeof rowValue === 'string' && rowValue.startsWith('op_req_') ? t(rowValue) : rowValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const parseProductionValue = (valueString: string): { amount: number; unit: string } | null => {
  // Patrones para detectar números con unidades en español o inglés
  const patterns = [
    // Formato: 45 litros, 2.5 kilogramos, etc.
    { regex: /([\d.,]+)\s*(litros?|kilos?|kgs?|kilogramos?)/i, 
      unitMapper: (u: string) => u.toLowerCase().startsWith('kg') || u.toLowerCase().startsWith('kilo') ? 'kilograms' : 'liters' },
    // Formato: 45 L, 2.5 kg, etc.
    { regex: /([\d.,]+)\s*([LlKk][Gg]?)\b/, 
      unitMapper: (u: string) => u.toLowerCase() === 'l' ? 'liters' : 'kilograms' },
    // Solo número, asumir litros por defecto
    { regex: /([\d.,]+)/, 
      unitMapper: () => 'liters' }
  ];

  for (const { regex, unitMapper } of patterns) {
    const match = valueString.match(regex);
    if (match && match[1]) {
      // Reemplazar coma decimal por punto para asegurar el parseo correcto
      const amount = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(amount)) {
        const unit = match[2] ? unitMapper(match[2]) : 'liters';
        return { amount, unit };
      }
    }
  }
  
  console.warn(`No se pudo analizar el valor de producción: "${valueString}"`);
  return null;
};

const liquidProductKeys = ['tech_spec_gasoline_prod', 'tech_spec_diesel_prod', 'tech_spec_kerosene_prod'];
const solidProductKeys = ['tech_spec_paraffin_prod', 'tech_spec_coke_prod'];

const PlantDetailView: React.FC<{ plant: PlantData }> = ({ plant }) => {
  const { t } = useLanguage();

  // Procesar datos de producción líquida
  const liquidProductionData = plant.technicalSpecs
    .filter(spec => liquidProductKeys.includes(spec.key))
    .map(spec => {
      const parsedValue = parseProductionValue(spec.value);
      console.log(`Procesando ${spec.key}:`, {
        valorOriginal: spec.value,
        valorParseado: parsedValue,
        etiqueta: t(spec.key)
      });
      
      return {
        label: t(spec.key)
                 .replace(t('tech_spec_estimated_production_prefix'), '')
                 .replace(t('tech_spec_per_cycle_suffix'), '')
                 .trim(),
        value: parsedValue?.amount || 0,
        rawValue: spec.value,
        parsedValue
      };
    })
    .filter(item => item.value > 0);

  console.log('Datos de producción líquida procesados:', liquidProductionData);

  // Procesar datos de producción sólida
  const solidProductionData = plant.technicalSpecs
    .filter(spec => solidProductKeys.includes(spec.key))
    .map(spec => {
      const parsedValue = parseProductionValue(spec.value);
      return {
        label: t(spec.key)
                .replace(t('tech_spec_estimated_production_prefix'), '')
                .replace(t('tech_spec_per_cycle_suffix'), '')
                .trim(),
        value: parsedValue?.amount || 0,
        rawValue: spec.value,
        parsedValue
      };
    })
    .filter(item => item.value > 0);
    
  console.log('Datos de producción sólida procesados:', solidProductionData);

  // Configuración para los datos de productos líquidos
  const liquidChartConfig = {
    type: 'pie',
    data: {
      labels: liquidProductionData.map(d => d.label),
      datasets: [{
        data: liquidProductionData.map(d => d.value),
        backgroundColor: [
          'rgba(0, 154, 68, 0.8)',     // Verde PETGAS
          'rgba(140, 198, 63, 0.8)',   // Verde claro PETGAS
          'rgba(0, 123, 255, 0.8)',    // Azul
          'rgba(40, 167, 69, 0.8)',    // Verde
          'rgba(23, 162, 184, 0.8)',   // Cian
        ],
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        hoverOffset: 15,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: t('chartLiquidProdTitle'),
          color: '#f9fafb',
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          padding: { bottom: 20 }
        },
        legend: {
          position: 'bottom',
          labels: {
            color: '#f3f4f6',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: '500'
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
              let label = context.label || '';
              if (label) label += ': ';
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('es-MX').format(context.parsed) + ' L';
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
            return new Intl.NumberFormat('es-MX').format(value) + ' L';
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
        animateScale: true,
        animateRotate: true
      },
      cutout: '65%',
      radius: '80%'
    }
  };

  // Configuración para los datos de productos sólidos
  const solidChartConfig = {
    type: 'pie',
    data: {
      labels: solidProductionData.map(d => d.label),
      datasets: [{
        data: solidProductionData.map(d => d.value),
        backgroundColor: [
          'rgba(253, 126, 20, 0.8)',   // Naranja
          'rgba(111, 66, 193, 0.8)',   // Púrpura
          'rgba(220, 53, 69, 0.8)',    // Rojo
          'rgba(255, 193, 7, 0.8)',    // Amarillo
          'rgba(13, 110, 253, 0.8)',   // Azul
        ],
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        hoverOffset: 15,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: t('chartSolidProdTitle'),
          color: '#f9fafb',
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          padding: { bottom: 20 }
        },
        legend: {
          position: 'bottom',
          labels: {
            color: '#f3f4f6',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: '500'
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
              let label = context.label || '';
              if (label) label += ': ';
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('es-MX').format(context.parsed) + ' kg';
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
            return new Intl.NumberFormat('es-MX').format(value) + ' kg';
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
        animateScale: true,
        animateRotate: true
      },
      cutout: '65%',
      radius: '80%'
    }
  };


  return (
    <div className={`container mx-auto p-4 md:p-6 lg:p-8 bg-transparent min-h-screen selection:bg-[#A0D468] selection:text-white`}>
      <header className="mb-12 text-center py-10 rounded-2xl shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#009A44] via-[#8CC63F] to-[#009A44] bg-[length:200%_auto] animate-gradient"></div>
        <div className="absolute inset-0 backdrop-blur-md bg-white/5 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="mx-auto mb-5 flex items-center justify-center w-24 h-24 rounded-full backdrop-blur-sm bg-white/10 p-2">
            <img 
              src={plant.logoUrl} 
              alt={t('plantSpecificLogoAlt')} 
              className="h-16 animated-footer-logo"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">{plant.fullName}</h1>
          <p className="text-xl md:text-2xl text-gray-100 font-light drop-shadow">{t(plant.titleKey)}</p>
        </div>
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              animation: gradient 3s ease-in-out infinite;
              background-size: 200% 200%;
            }
          `}
        </style>
      </header>

      <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <img src={plant.mainImage} alt={t('plantIllustrationAlt')} className="w-full h-auto max-h-[550px] object-cover"/>
      </div>

      {plant.generalities && plant.generalities.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.GENERALITIES} iconType={PlantSection.GENERALITIES}>
          <div className="space-y-5">
            {plant.generalities.map(item => (
              <div key={item.id} className={`p-5 border-l-4 border-[#A0D468] bg-white/10 backdrop-blur-sm rounded-r-lg shadow-sm hover:shadow-md transition-all duration-300`}>
                <h3 className={`text-xl font-semibold text-white mb-1.5`}>{t(item.titleKey)}</h3>
                <p className="text-gray-100 leading-relaxed">{t(item.contentKey)}</p>
              </div>
            ))}
          </div>
        </AnimatedSectionCard>
      )}
      
      {plant.benefits && plant.benefits.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.BENEFITS} iconType={PlantSection.BENEFITS}>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {plant.benefits.map(benefit => (
              <div key={benefit.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border border-white/10">
                <h3 className={`text-xl font-bold text-white mb-2`}>{t(benefit.title)}</h3>
                <p className="text-gray-100 mb-2.5 text-sm leading-relaxed">{t(benefit.description)}</p>
                {benefit.details && benefit.details.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-200 space-y-1.5 pl-2">
                    {benefit.details.map((detailKey, i) => <li key={i}>{t(detailKey)}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </AnimatedSectionCard>
      )}

      {plant.generalDescriptionKey && (
         <AnimatedSectionCard titleKey={PlantSection.GENERAL_DESCRIPTION} iconType={PlantSection.GENERAL_DESCRIPTION}>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-100 leading-relaxed mb-4">{t(plant.generalDescriptionKey)}</p>
              {plant.generalDescriptionKey2 && (
                <p className="text-gray-200 leading-relaxed">{t(plant.generalDescriptionKey2)}</p>
              )}
            </div>
        </AnimatedSectionCard>
      )}

      {plant.transformationSystem && plant.transformationSystem.components.length > 0 && (
        <AnimatedSectionCard titleKey={plant.transformationSystem.titleKey} iconType={PlantSection.TRANSFORMATION_SYSTEM}>
           <div className="space-y-6">
            {plant.transformationSystem.components.map(component => (
              <div key={component.id} className="p-5 border border-white/10 rounded-xl shadow-md bg-white/10 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <h4 className={`text-lg font-semibold text-white mb-2`}>{t(component.name)}</h4>
                {typeof component.description === 'string' ? (
                  <p className="text-gray-100 text-sm leading-relaxed">{t(component.description)}</p>
                ) : (
                  <ul className="list-disc list-inside text-gray-200 space-y-1.5 text-sm">
                    {component.description.map((descKey, i) => <li key={i}>{t(descKey)}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </AnimatedSectionCard>
      )}
      
      {plant.technicalSpecs && plant.technicalSpecs.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.TECHNICAL_SPECS} iconType={PlantSection.TECHNICAL_SPECS}>
          <DetailTable data={plant.technicalSpecs} headersKey={[CommonText.TABLE_HEADER_CHARACTERISTIC, CommonText.TABLE_HEADER_SPECIFICATION]} />
        </AnimatedSectionCard>
      )}

      {/* Gráficos de producción */}
      {(liquidProductionData.length > 0 || solidProductionData.length > 0) && (
        <AnimatedSectionCard titleKey="productionChartsTitle" iconType="chart">
          {liquidProductionData.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-white">{t('liquidProductionTitle')}</h3>
              <div className="h-80 md:h-96 lg:h-[450px]">
                <ChartComponent 
                  chartId={`${plant.id}-liquid-prod-chart`} 
                  config={liquidChartConfig} 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
          {solidProductionData.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">{t('solidProductionTitle')}</h3>
              <div className="h-80 md:h-96 lg:h-[450px]">
                <ChartComponent 
                  chartId={`${plant.id}-solid-prod-chart`} 
                  config={solidChartConfig} 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </AnimatedSectionCard>
      )}

      {plant.powerAndEnergy && plant.powerAndEnergy.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.POWER_ENERGY} iconType={PlantSection.POWER_ENERGY}>
          <DetailTable data={plant.powerAndEnergy} headersKey={[CommonText.TABLE_HEADER_CONCEPT, CommonText.TABLE_HEADER_DETAIL]} />
        </AnimatedSectionCard>
      )}
      
      {plant.maintenance && plant.maintenance.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.MAINTENANCE} iconType={PlantSection.MAINTENANCE}>
          <ul className="list-none space-y-3 text-slate-700">
            {plant.maintenance.map((itemKey, i) => (
              <li key={i} className={`p-4 bg-slate-100 rounded-lg shadow-sm border-l-4 border-[#A0D468]`}>
                <span className="font-medium">{t(itemKey)}</span>
              </li>
            ))}
          </ul>
        </AnimatedSectionCard>
      )}

      {plant.consumables && plant.consumables.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.CONSUMABLES} iconType={PlantSection.CONSUMABLES}>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/3">
                    {t(CommonText.TABLE_HEADER_CONSUMABLE)}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-2/3">
                    {t(CommonText.TABLE_HEADER_RECOMMENDATION)}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#FFFFFF] divide-y divide-gray-200">
                {plant.consumables.map((item, index) => (
                  <tr key={`${item.key}-${index}`} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-[#FFFFFF] hover:bg-slate-100 transition-colors'}>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-slate-800">
                      {t(item.key)}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-line text-sm text-slate-700">
                      {t(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSectionCard>
      )}
      
      {plant.operationalRequirements && plant.operationalRequirements.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.OPERATIONAL_REQUIREMENTS} iconType={PlantSection.OPERATIONAL_REQUIREMENTS}>
          <DetailTable data={plant.operationalRequirements} headersKey={[CommonText.TABLE_HEADER_REQUIREMENT, CommonText.TABLE_HEADER_SPECIFICATION]} />
        </AnimatedSectionCard>
      )}

      {plant.additionalConsiderations && plant.additionalConsiderations.length > 0 && (
        <AnimatedSectionCard titleKey={PlantSection.ADDITIONAL_CONSIDERATIONS} iconType={PlantSection.ADDITIONAL_CONSIDERATIONS}>
          <div className="space-y-4">
            {plant.additionalConsiderations.map(item => (
              <div key={item.key} className={`p-4 border-l-4 border-slate-400 bg-slate-100 rounded-r-md shadow-sm`}>
                <h4 className={`text-md font-semibold text-[#34495e]`}>{t(item.key)}</h4>
                <p className="text-slate-600 text-sm">{t(item.value)}</p>
              </div>
            ))}
          </div>
        </AnimatedSectionCard>
      )}

      {plant.productionAnalysis && plant.productionAnalysis.tables.length > 0 && (
        <AnimatedSectionCard titleKey={plant.productionAnalysis.titleKey} iconType={PlantSection.PRODUCTION_ANALYSIS}>
          {plant.productionAnalysis.tables.map(table => (
            <div key={table.id} className="mb-8 last:mb-0">
              {table.titleKey && <h3 className={`text-xl font-semibold mb-4 text-[#34495e]`}>{t(table.titleKey)}</h3>}
              <DetailTable data={table.data} headersKey={[CommonText.TABLE_HEADER_CONCEPT, CommonText.TABLE_HEADER_SPECIFICATION]} />
            </div>
          ))}
        </AnimatedSectionCard>
      )}

      {plant.financialAnalysis && plant.financialAnalysis.data.length > 0 && (
        <AnimatedSectionCard titleKey={plant.financialAnalysis.titleKey} iconType={PlantSection.FINANCIAL_ANALYSIS}>
          <DetailTable data={plant.financialAnalysis.data} headersKey={[CommonText.TABLE_HEADER_CONCEPT, CommonText.TABLE_HEADER_SPECIFICATION]} />
        </AnimatedSectionCard>
      )}

      <div className="relative mb-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#006030] via-[#007840] to-[#006030] bg-[length:200%_auto] animate-gradient"></div>
        <div className="relative z-10 p-8">
          <h2 className="text-3xl font-bold mb-6 pb-3 flex items-center text-white">
            <SectionIcon type="priceInfoTitle" />
            {t('priceInfoTitle')}
          </h2>
          <p className="text-lg md:text-xl whitespace-pre-line font-semibold leading-relaxed text-gray-100">{t(plant.priceInfoKey)}</p>
          <p className="mt-4 text-sm md:text-base text-gray-200">
            {t('contactPrompt')}{' '}
            <a 
              href="http://www.petgas.com.mx/contacto" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-yellow-300 hover:text-white transition-colors border-b border-yellow-300 hover:border-white"
            >
              {t('contactLinkText')}
            </a>.
          </p>
        </div>
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              animation: gradient 5s ease infinite;
              background-size: 200% 200%;
            }
          `}
        </style>
      </div>

    </div>
  );
};

export default PlantDetailView;