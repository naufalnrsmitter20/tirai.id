export interface MetricValue {
  value: string;
}

export interface DimensionValue {
  value: string;
}

export interface RowData {
  dimensionValues: DimensionValue[];
  metricValues: MetricValue[];
}

export interface AnalyticsResult {
  newUsersCurrent: number;
  averageSessionDurationCurrent: number;
  newUsersPrevious: number;
  averageSessionDurationPrevious: number;
  pagePathsCurrent: Record<string, number>;
  pagePathsPrevious: Record<string, number>;
  searchQueriesCurrent: Record<string, number>;
  searchQueriesPrevious: Record<string, number>;
  demographicsCurrent: Record<string, number>;
  demographicsPrevious: Record<string, number>;
  channelsCurrent: Record<string, number>;
  channelsPrevious: Record<string, number>;
  newUsersPercentage: number;
  averageSessionDurationPercentage: number;
}
