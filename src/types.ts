

export interface KeyValueSpec {
  key: string;
  value: string;
  isTitle?: boolean; // Optional flag for section titles within a list
}

export interface Benefit {
  id: string;
  title: string; // Can be a direct title or a translation key if benefits are very dynamic
  description: string;
  details?: string[];
}

export interface SystemComponent {
  id: string;
  name: string; // Can be a direct title or a translation key
  description: string | string[];
}

export interface ProductionTableEntry {
  concept: string; // Represents the 'key' part, should be a translation key
  specification: string; // The value, might contain numbers or text
}

export interface ProductionAnalysisTable {
  id: string;
  titleKey: string; // Translation key for the table's title (e.g., "1 Cycle per Day")
  data: ProductionTableEntry[];
}

export interface PlantData {
  id: string;
  shortName: string; // For tabs/buttons e.g. "P-90"
  fullName: string; // e.g., "PETGAS P-90" (can be a translation key if needed, or used to derive one)
  titleKey: string; // Translation key for the main page title (e.g., "Ficha Técnica Planta PETGAS P-90")
  cardDisplayNameKey: string; // Translation key for the name displayed on hero cards
  logoUrl: string; 
  mainImage: string; 
  
  generalities: Array<{id: string; titleKey: string; contentKey: string;}>; // title and content are now keys
  benefits: Benefit[]; // Assuming benefit titles/descriptions are complex enough to be translation keys themselves or structured within translations
  generalDescriptionKey: string; // Translation key
  
  transformationSystem: {
    titleKey: string; // Translation key for the section title
    components: SystemComponent[]; // Component names/descriptions might also need to be keys
  };
  
  technicalSpecs: KeyValueSpec[]; // Keys here might need to be translation keys if not already
  powerAndEnergy?: KeyValueSpec[]; 
  maintenance?: string[]; // These could be keys if complex, or direct if simple bullet points
  consumables?: KeyValueSpec[];

  operationalRequirements: KeyValueSpec[];
  additionalConsiderations?: KeyValueSpec[];
  
  productionAnalysis?: { 
    titleKey: string; // Translation key for the main section title
    tables: ProductionAnalysisTable[];
  };

  financialAnalysis?: { 
    titleKey: string; // Translation key for the section title
    data: ProductionTableEntry[];
  };

  priceInfoKey: string; // Translation key for the full price string
}

export enum PlantSection {
  GENERALITIES = "generalities_section_title",
  BENEFITS = "benefits_section_title",
  GENERAL_DESCRIPTION = "general_description_section_title",
  TRANSFORMATION_SYSTEM = "transformation_system_section_title",
  TECHNICAL_SPECS = "technical_specs_section_title",
  POWER_ENERGY = "power_energy_section_title",
  MAINTENANCE = "maintenance_section_title",
  CONSUMABLES = "consumables_section_title",
  OPERATIONAL_REQUIREMENTS = "operational_requirements_section_title",
  ADDITIONAL_CONSIDERATIONS = "additional_considerations_section_title",
  PRODUCTION_ANALYSIS = "production_analysis_section_title",
  FINANCIAL_ANALYSIS = "financial_analysis_section_title",
}

// For table headers and other common strings
export enum CommonText {
  // Table Headers
  TABLE_HEADER_CHARACTERISTIC = "table_header_characteristic",
  TABLE_HEADER_SPECIFICATION = "table_header_specification",
  TABLE_HEADER_CONCEPT = "table_header_concept",
  TABLE_HEADER_DETAIL = "table_header_detail",
  TABLE_HEADER_CONSUMABLE = "table_header_consumable",
  TABLE_HEADER_RECOMMENDATION = "table_header_recommendation",
  TABLE_HEADER_REQUIREMENT = "table_header_requirement",
  // Plant specific generalities titles (example, needs full list)
  PROCESS_TITLE = "process_title",
  ENERGY_SELF_SUFFICIENCY_TITLE = "energy_self_sufficiency_title",
  REACTOR_PROCESS_TIME_TITLE = "reactor_process_time_title",
  SUITABLE_PLASTICS_TITLE = "suitable_plastics_title",
  // Plant specific generalities content (example)
  PROCESS_CONTENT = "process_content",
  ENERGY_SELF_SUFFICIENCY_CONTENT = "energy_self_sufficiency_content",
  REACTOR_PROCESS_TIME_CONTENT = "reactor_process_time_content",
  SUITABLE_PLASTICS_CONTENT = "suitable_plastics_content",
   // Benefits titles (example)
  TRAINING_BENEFIT_TITLE = "training_benefit_title",
  INSTALLATION_BENEFIT_TITLE = "installation_benefit_title",
  QUALITY_MANAGEMENT_BENEFIT_TITLE = "quality_management_benefit_title",
  INDUSTRIAL_SAFETY_BENEFIT_TITLE = "industrial_safety_benefit_title",
  TECH_SUPPORT_BENEFIT_TITLE = "tech_support_benefit_title",
   // Transformation system component names (example)
  REACTOR_SYSTEM_COMPONENT_NAME = "reactor_system_component_name",
  CONDENSERS_COMPONENT_NAME = "condensers_component_name",
  PROCESS_TANKS_COMPONENT_NAME = "process_tanks_component_name",
  COOLING_SYSTEM_COMPONENT_NAME = "cooling_system_component_name",
  PUMP_SYSTEMS_COMPONENT_NAME = "pump_systems_component_name",
  GAS_FEED_SYSTEM_COMPONENT_NAME = "gas_feed_system_component_name",
}