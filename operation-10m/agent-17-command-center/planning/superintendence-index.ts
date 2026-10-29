import type {
  Agent17AdministratorAccordSnapshot,
  Agent17CuratorAccordSnapshot,
  Agent17CuratorshipIndexSnapshot,
  Agent17SuperintendenceIndexSnapshot,
} from '../types/command-center-types.ts';
import { administratorAccordBlocksExecutor } from './administrator-accord.ts';
import { curatorAccordBlocksAdministrator } from './curator-accord.ts';
import { curatorshipIndexBlocksCurator } from './curatorship-index.ts';

export interface Agent17SuperintendenceIndexInputs {
  curatorAccord: Agent17CuratorAccordSnapshot;
  curatorshipIndex: Agent17CuratorshipIndexSnapshot;
  administratorAccord: Agent17AdministratorAccordSnapshot;
}

export function buildAgent17SuperintendenceIndex(
  inputs: Agent17SuperintendenceIndexInputs
): Agent17SuperintendenceIndexSnapshot {
  const mandates: Agent17SuperintendenceIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'curator_inducted',
    label: 'Curator accord curator-inducted',
    empowered:
      inputs.curatorAccord.curatorInducted &&
      !curatorAccordBlocksAdministrator(inputs.curatorAccord),
    weight: 30,
  });

  mandates.push({
    id: 'curator_band',
    label: 'Curator inducted or serving',
    empowered:
      inputs.curatorAccord.band === 'inducted' ||
      inputs.curatorAccord.band === 'serving',
    weight: 25,
  });

  mandates.push({
    id: 'curatorship_entrusted',
    label: 'Curatorship index curatorship-entrusted',
    empowered:
      inputs.curatorshipIndex.curatorshipEntrusted &&
      !curatorshipIndexBlocksCurator(inputs.curatorshipIndex),
    weight: 20,
  });

  mandates.push({
    id: 'administrator_clear',
    label: 'Administrator accord not blocking executor',
    empowered: !administratorAccordBlocksExecutor(inputs.administratorAccord),
    weight: 15,
  });

  mandates.push({
    id: 'curatorship_score',
    label: 'Curatorship score headroom',
    empowered: inputs.curatorshipIndex.curatorshipScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.empowered ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const superintendenceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dissolvedSignals =
    curatorAccordBlocksAdministrator(inputs.curatorAccord) ||
    curatorshipIndexBlocksCurator(inputs.curatorshipIndex) ||
    administratorAccordBlocksExecutor(inputs.administratorAccord);

  const band: Agent17SuperintendenceIndexSnapshot['band'] = dissolvedSignals
    ? 'dissolved'
    : superintendenceScore >= 44 &&
        inputs.curatorAccord.band === 'inducted' &&
        inputs.curatorshipIndex.band === 'entrusted'
      ? 'empowered'
      : 'provisional';

  const superintendenceEmpowered =
    band === 'empowered' &&
    inputs.curatorAccord.curatorInducted &&
    !curatorAccordBlocksAdministrator(inputs.curatorAccord);

  return {
    superintendenceScore,
    band,
    mandates,
    curatorBand: inputs.curatorAccord.band,
    curatorshipBand: inputs.curatorshipIndex.band,
    superintendenceEmpowered,
    headline: `Superintendence ${band} (${superintendenceScore}/100) · ${mandates.filter(m => m.empowered).length}/${mandates.length} mandates`,
  };
}

export function superintendenceIndexBlocksSuperintendent(
  snapshot: Agent17SuperintendenceIndexSnapshot
): boolean {
  return snapshot.band === 'dissolved' || !snapshot.superintendenceEmpowered;
}
