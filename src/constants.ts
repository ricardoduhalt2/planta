import { PlantData, CommonText, PlantSection } from './types';

// Updated Logo URLs
export const MAIN_LOGO_URL = 'https://www.petgas.com.mx/wp-content/uploads/2025/06/LogoConTexto.png';
export const NAVBAR_LOGO_URL = 'https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png';

const P90_DATA: PlantData = {
  id: 'p-90',
  shortName: 'P-90', // Stays as is, used for button text, not directly translated unless necessary
  fullName: 'PETGAS P-90', // Used in titles, could be a key if plant names need translation
  cardDisplayNameKey: 'p90_card_display_name',
  titleKey: 'p90_title', // Translation key for the title
  logoUrl: NAVBAR_LOGO_URL,
  mainImage: 'https://www.petgas.com.mx/wp-content/uploads/2025/06/p01.jpeg', // Updated P-90 image
  generalities: [
    { id: 'g1', titleKey: CommonText.PROCESS_TITLE, contentKey: 'p90_process_content' },
    { id: 'g2', titleKey: CommonText.ENERGY_SELF_SUFFICIENCY_TITLE, contentKey: 'p90_energy_self_sufficiency_content' },
    { id: 'g3', titleKey: CommonText.REACTOR_PROCESS_TIME_TITLE, contentKey: 'p90_reactor_process_time_content' },
    { id: 'g4', titleKey: CommonText.SUITABLE_PLASTICS_TITLE, contentKey: 'p90_suitable_plastics_content' },
  ],
  benefits: [
    { id: 'b1', title: 'benefit_training_title', description: 'benefit_training_desc', details: ['benefit_training_detail1', 'benefit_training_detail2'] },
    { id: 'b2', title: 'benefit_installation_title', description: 'benefit_installation_desc' },
    { id: 'b3', title: 'benefit_quality_title', description: 'benefit_quality_desc' },
    { id: 'b4', title: 'benefit_safety_title', description: 'benefit_safety_desc' },
    { id: 'b5', title: 'benefit_support_title', description: 'benefit_support_desc' },
  ],
  generalDescriptionKey: 'p90_general_desc',
  transformationSystem: {
    titleKey: 'common_transformation_system_title',
    components: [
      { id: 'ts1', name: CommonText.REACTOR_SYSTEM_COMPONENT_NAME, description: ['p90_reactor_comp_desc1', 'p90_reactor_comp_desc2', 'p90_reactor_comp_desc3'] },
      { id: 'ts2', name: CommonText.CONDENSERS_COMPONENT_NAME, description: 'p90_condensers_comp_desc' },
      { id: 'ts3', name: CommonText.PROCESS_TANKS_COMPONENT_NAME, description: ['p90_tanks_comp_desc1', 'p90_tanks_comp_desc2'] },
      { id: 'ts4', name: CommonText.COOLING_SYSTEM_COMPONENT_NAME, description: 'p90_cooling_comp_desc' },
      { id: 'ts5', name: CommonText.PUMP_SYSTEMS_COMPONENT_NAME, description: 'p90_pumps_comp_desc' },
      { id: 'ts6', name: CommonText.GAS_FEED_SYSTEM_COMPONENT_NAME, description: 'p90_gasfeed_comp_desc' },
    ]
  },
  technicalSpecs: [ // Keys for 'key' field should be translation keys. Values are often specific.
    { key: 'tech_spec_capacity', value: '90 kg por ciclo' },
    { key: 'tech_spec_process_duration', value: '5 - 6 horas por ciclo' },
    { key: 'tech_spec_operators', value: '3 operadores por ciclo' },
    { key: 'tech_spec_burners', value: '1 quemador Marca PETGAS' },
    { key: 'tech_spec_reactor_type', value: '1 reactor forrado en acero inoxidable' },
    { key: 'tech_spec_gasoline_prod', value: '45 litros' },
    { key: 'tech_spec_diesel_prod', value: '25 litros' },
    { key: 'tech_spec_kerosene_prod', value: '10 litros' },
    { key: 'tech_spec_paraffin_prod', value: '2.5 kilogramos' },
    { key: 'tech_spec_coke_prod', value: '3.5 kilogramos' },
    { key: 'tech_spec_lp_gas_consumption', value: '15 Litros por hora. Consumo de gas LP entre 1 y 2 horas por encendido.' },
    { key: 'tech_spec_energy', value: '48 000 BTU (enfriador, bomba, tablero, sensores)' },
    { key: 'tech_spec_power', value: '5 kW' },
  ],
  maintenance: [
    'p90_maintenance_item1',
    'p90_maintenance_item2',
    'p90_maintenance_item3',
  ],
  operationalRequirements: [ // Keys for 'key' field should be translation keys
    { key: 'op_req_water', value: '1 200 Litros' },
    { key: 'op_req_piping', value: 'Por definir' }, // "Por definir" itself could be a common translation key "to_be_defined"
    { key: 'op_req_wiring', value: 'to_be_defined_value' },
    { key: 'op_req_gas_tank', value: 'op_req_gas_tank_value_process_start' },
    { key: 'op_req_gasoline_storage', value: 'Recomendación 500 litros (1 ciclo al día)\nRecomendación 1,000 litros (2 ciclos al día)' },
    { key: 'op_req_diesel_storage', value: 'Recomendación 300 litros (1 ciclo al día)\nRecomendación 500 litros (2 ciclos al día)' },
    { key: 'op_req_kerosene_storage', value: 'Recomendación 100 litros (1 ciclo al día)\nRecomendación 200 litros (2 ciclos al día)' },
    { key: 'op_req_paraffin_storage', value: 'to_be_defined_value_containers' },
    { key: 'op_req_coke_storage', value: 'to_be_defined_value_sacks' },
  ],
  additionalConsiderations: [ // Keys for 'key' field should be translation keys
      { key: 'add_cons_tank_material', value: 'add_cons_tank_material_value_p90' },
      { key: 'add_cons_ventilation_safety', value: 'add_cons_ventilation_safety_value' },
      { key: 'add_cons_location', value: 'add_cons_location_value' },
  ],
  productionAnalysis: {
    titleKey: PlantSection.PRODUCTION_ANALYSIS,
    tables: [
      {
        id: 'pa1', titleKey: 'prod_analysis_table_1_cycle_title',
        data: [ // 'concept' fields should be translation keys
          { concept: 'prod_analysis_op_days', specification: '26 días laborables' },
          { concept: 'prod_analysis_cycles_per_day', specification: '1 ciclo por día' },
          { concept: 'prod_analysis_kg_transformed_cycle', specification: '90 kg por ciclo' },
          { concept: 'prod_analysis_kg_transformed_month', specification: '2,340 kg al mes' },
          { concept: 'prod_analysis_gasoline_monthly', specification: '1,170 litros' },
          { concept: 'prod_analysis_diesel_monthly', specification: '650 litros' },
          { concept: 'prod_analysis_kerosene_monthly', specification: '260 litros' },
          { concept: 'prod_analysis_paraffin_monthly', specification: '65 kg' },
          { concept: 'prod_analysis_coke_monthly', specification: '91 kg' },
          { concept: 'prod_analysis_manpower', specification: '3 personas' },
        ]
      },
      {
        id: 'pa2', titleKey: 'prod_analysis_table_2_cycles_title',
        data: [
          { concept: 'prod_analysis_op_days', specification: '26 días laborables' },
          { concept: 'prod_analysis_cycles_per_day', specification: '2 ciclos por día' },
          { concept: 'prod_analysis_kg_transformed_day', specification: '180 kg por día' }, // Note: Key slightly different from above table
          { concept: 'prod_analysis_kg_transformed_month', specification: '4,680 kg al mes' },
          { concept: 'prod_analysis_gasoline_monthly', specification: '2,340 litros' },
          { concept: 'prod_analysis_diesel_monthly', specification: '1,300 litros' },
          { concept: 'prod_analysis_kerosene_monthly', specification: '520 litros' },
          { concept: 'prod_analysis_paraffin_monthly', specification: '130 kg' },
          { concept: 'prod_analysis_coke_monthly', specification: '182 kg' },
          { concept: 'prod_analysis_manpower_per_cycle', specification: '3 personas por turno' },
        ]
      }
    ]
  },
  priceInfoKey: 'p90_price_info',
};

const PETGAS_4K_DATA: PlantData = {
  id: 'petgas-4k',
  shortName: '4K - 1R', // Shortened for navbar
  fullName: 'PETGAS 4K -1R (Dual Reactor Opcional)',
  cardDisplayNameKey: 'petgas_4k_card_display_name',
  titleKey: 'petgas_4k_title', // Translation key for the title
  logoUrl: NAVBAR_LOGO_URL,
  mainImage: 'https://www.petgas.com.mx/wp-content/uploads/2023/04/plantaimg3.jpg', // Updated 4K-1R plant image
  generalities: [
    { id: 'g1', titleKey: CommonText.PROCESS_TITLE, contentKey: 'petgas_4k_process_content' },
    { id: 'g2', titleKey: CommonText.ENERGY_SELF_SUFFICIENCY_TITLE, contentKey: 'petgas_4k_energy_self_sufficiency_content' },
    { id: 'g3', titleKey: CommonText.REACTOR_PROCESS_TIME_TITLE, contentKey: 'petgas_4k_reactor_process_time_content' },
    { id: 'g4', titleKey: CommonText.SUITABLE_PLASTICS_TITLE, contentKey: 'petgas_4k_suitable_plastics_content' },
  ],
  benefits: [ // Using same benefit keys as P90 for now, assuming they are common
    { id: 'b1', title: 'benefit_training_title', description: 'benefit_training_desc', details: ['benefit_training_detail1', 'benefit_training_detail2'] },
    { id: 'b2', title: 'benefit_installation_title', description: 'benefit_installation_desc' },
    { id: 'b3', title: 'benefit_quality_title', description: 'benefit_quality_desc' },
    { id: 'b4', title: 'benefit_safety_title', description: 'benefit_safety_desc' },
    { id: 'b5', title: 'benefit_support_title', description: 'benefit_support_desc' },
  ],
  generalDescriptionKey: 'petgas_4k_general_desc',
  transformationSystem: {
    titleKey: 'common_transformation_system_title',
    components: [
      { id: 'ts1', name: CommonText.REACTOR_SYSTEM_COMPONENT_NAME, description: ['petgas_4k_reactor_comp_desc1', 'petgas_4k_reactor_comp_desc2', 'petgas_4k_reactor_comp_desc3'] },
      { id: 'ts2', name: CommonText.CONDENSERS_COMPONENT_NAME, description: 'petgas_4k_condensers_comp_desc' },
      { id: 'ts3', name: CommonText.PROCESS_TANKS_COMPONENT_NAME, description: ['petgas_4k_tanks_comp_desc1', 'petgas_4k_tanks_comp_desc2'] },
      { id: 'ts4', name: CommonText.COOLING_SYSTEM_COMPONENT_NAME, description: 'petgas_4k_cooling_comp_desc' },
      { id: 'ts5', name: CommonText.PUMP_SYSTEMS_COMPONENT_NAME, description: 'petgas_4k_pumps_comp_desc' },
      { id: 'ts6', name: CommonText.GAS_FEED_SYSTEM_COMPONENT_NAME, description: 'petgas_4k_gasfeed_comp_desc' },
    ]
  },
  technicalSpecs: [
    { key: 'tech_spec_processing_capacity', value: '8,000 kg por día promedio' },
    { key: 'tech_spec_process_duration', value: '8 - 10 horas por ciclo' },
    { key: 'tech_spec_operators', value: '3 operadores por ciclo' },
    { key: 'tech_spec_burners', value: '1 quemador Marca PETGAS' },
    { key: 'tech_spec_reactor_type', value: '1 reactor forrado en acero inoxidable (Opción Doble Reactor)' },
    { key: 'tech_spec_gasoline_prod', value: '3,600 litros' },
    { key: 'tech_spec_diesel_prod', value: '2,000 litros' },
    { key: 'tech_spec_kerosene_prod', value: '800 litros' },
    { key: 'tech_spec_paraffin_prod', value: '200 kilogramos' },
    { key: 'tech_spec_coke_prod', value: '280 kilogramos' },
  ],
  powerAndEnergy: [
    { key: 'tech_spec_lp_gas_consumption', value: '15 Litros por hora. Consumo de gas LP entre 1 y 2 horas por encendido.' },
    { key: 'tech_spec_energy', value: '48 000 BTU (enfriador, bomba, tablero, sensores)' },
    { key: 'tech_spec_power', value: '5 kW' },
  ],
  maintenance: [
    'petgas_4k_maintenance_item1',
    'petgas_4k_maintenance_item2',
    'petgas_4k_maintenance_item3',
    'petgas_4k_maintenance_item4',
  ],
  consumables: [
    { key: 'consumable_gaskets', value: 'consumable_gaskets_recommendation_4k'}
  ],
  operationalRequirements: [
    { key: 'op_req_water', value: '1 200 Litros' },
    { key: 'op_req_piping', value: 'to_be_defined_value' },
    { key: 'op_req_wiring', value: 'to_be_defined_value' },
    { key: 'op_req_gas_tank', value: 'op_req_gas_tank_value_process_start' },
    { key: 'op_req_gasoline_storage_6days', value: 'Recomendación tanque de 25,000 litros o 2 tanques de 12,000 litros' },
    { key: 'op_req_diesel_storage_6days', value: 'Recomendación 15,000 litros' },
    { key: 'op_req_kerosene_storage_6days', value: 'Recomendación 6,000 litros' },
    { key: 'op_req_paraffin_storage', value: 'to_be_defined_value_containers' },
    { key: 'op_req_coke_storage', value: 'to_be_defined_value_sacks' },
  ],
  additionalConsiderations: [
      { key: 'add_cons_tank_material', value: 'add_cons_tank_material_value_4k' },
      { key: 'add_cons_ventilation_safety', value: 'add_cons_ventilation_safety_value' },
      { key: 'add_cons_location', value: 'add_cons_location_value' },
      { key: 'add_cons_safety_margin', value: 'add_cons_safety_margin_value' },
      { key: 'add_cons_regulations', value: 'add_cons_regulations_value_nom_em_005' },
  ],
  productionAnalysis: {
    titleKey: PlantSection.PRODUCTION_ANALYSIS,
    tables: [
      {
        id: 'pa1_4k', titleKey: 'prod_analysis_table_4k_main_title', // Generic title as there's only one table
        data: [
          { concept: 'prod_analysis_op_days_estimated', specification: '26 días laborables' },
          { concept: 'prod_analysis_kg_transformed_day_4k', specification: '8,000 kg por día' },
          { concept: 'prod_analysis_gasoline_monthly_4k', specification: '93,600 litros' },
          { concept: 'prod_analysis_diesel_monthly_4k', specification: '52,000 litros' },
          { concept: 'prod_analysis_kerosene_monthly_4k', specification: '20,800 litros' },
          { concept: 'prod_analysis_paraffin_monthly_4k', specification: '5,200 kg' },
          { concept: 'prod_analysis_coke_monthly_4k', specification: '7,280 kg' },
          { concept: 'prod_analysis_manpower_per_cycle', specification: '3 personas por turno' },
        ]
      }
    ]
  },
  priceInfoKey: 'petgas_4k_price_info',
};


export const ALL_PLANTS_DATA: PlantData[] = [P90_DATA, PETGAS_4K_DATA];

// Base Colors (ensure these are used consistently, Tailwind JIT can use them in bg-[#...])
export const PETGAS_GREEN = '#009A44';
export const PETGAS_LIGHT_GREEN = '#8CC63F'; // A more vibrant light green
export const PETGAS_ACCENT_GREEN = '#A0D468'; // Even lighter for hovers or highlights

export const PETGAS_DARK_GREY = '#34495e'; // Cooler, more modern dark grey
export const PETGAS_MEDIUM_GREY = '#7f8c8d'; // Muted medium grey
export const PETGAS_LIGHT_GREY = '#ecf0f1'; // Very light grey for backgrounds/borders
export const PETGAS_WHITE = '#FFFFFF';

// Semantic Colors for Charts/UI elements for modern look
export const MODERN_BLUE = '#3498db';
export const MODERN_PURPLE = '#9b59b6';
export const MODERN_RED = '#e74c3c';
export const MODERN_YELLOW = '#f1c40f';
export const MODERN_TEAL = '#1abc9c';