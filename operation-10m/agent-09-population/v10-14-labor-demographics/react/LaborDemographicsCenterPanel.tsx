import type { LaborDemographicsWorldView } from '../types';
import {
  DEMOGRAPHIC_STRUCTURE_LABEL,
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  WAGE_PRESSURE_LABEL
} from '../types';

/** Lightweight panel — React types only at runtime when bundled with game. */
export function LaborDemographicsCenterPanel(props: { view: LaborDemographicsWorldView | null }) {
  const view = props.view;
  if (!view || !view.enabled || !view.state?.enabled) {
    return {
      kind: 'labor_demographics_off' as const,
      message: 'Labor Demographics (V10.14) is off. Enable National Systems, Industries, and Labor Demographics in Settings.'
    };
  }
  const st = view.state;
  return {
    kind: 'labor_demographics_on' as const,
    testId: 'v1014-labor-center',
    summary: st.summary,
    outlook: st.outlook,
    automationFeedbackSummary: st.automationFeedbackSummary,
    tiles: [
      ['Demographics', DEMOGRAPHIC_STRUCTURE_LABEL[st.nationalDemographicStructure]],
      ['Employment', EMPLOYMENT_LINKAGE_LABEL[st.nationalEmploymentLinkage]],
      ['Wages', WAGE_PRESSURE_LABEL[st.nationalWagePressure]],
      ['Migration', MIGRATION_FLOW_LABEL[st.nationalMigrationFlow]]
    ] as const,
    industryLinks: st.industryLinks.map(l => ({
      industry: INDUSTRY_LABEL[l.industry],
      linkageScore: Math.round(l.linkageScore),
      sharePct: Math.round(l.nationalOutputShare * 100)
    }))
  };
}
