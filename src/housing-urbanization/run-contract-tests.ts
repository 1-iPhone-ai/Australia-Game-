/**
 * Operation 111 · Agent 39 — Housing & Urbanization contract tests.
 * Imports pure V10.13 / Living Regions boundary helpers from the canonical monolith.
 */
import {
  V1013_HOUSING_PRESSURE_ORDER,
  V1013_HOUSING_PRESSURE_RANK,
  computeNationalHouseholdEconomy,
  createInitialHouseholdEconomyPersisted,
  makeDefaultV1013TestInputs,
  runV1013HouseholdsLivingStandardsSelfTests,
} from "../../(V9.4) australia-game-with-ai.tsx";

type CaseResult = { name: string; passed: boolean; detail: string };

function check(results: CaseResult[], name: string, passed: boolean, detail: string) {
  results.push({ name, passed: Boolean(passed), detail });
}

function runHousingUrbanizationContractTests(): {
  passed: number;
  failed: number;
  total: number;
  results: CaseResult[];
} {
  const results: CaseResult[] = [];

  // Rank order — `strained` and `high` intentionally share rank 3 (hysteresis plateau)
  {
    const order = V1013_HOUSING_PRESSURE_ORDER;
    let ok = true;
    let detail = "";
    for (let i = 1; i < order.length; i++) {
      const prev = order[i - 1];
      const cur = order[i];
      const prevRank = V1013_HOUSING_PRESSURE_RANK[prev];
      const curRank = V1013_HOUSING_PRESSURE_RANK[cur];
      const allowedPlateau = prev === "strained" && cur === "high";
      if (curRank < prevRank || (curRank === prevRank && !allowedPlateau)) {
        ok = false;
        detail = `${prev}(${prevRank})→${cur}(${curRank})`;
        break;
      }
    }
    check(
      results,
      "HOUSING_PRESSURE_RANK order (with strained/high plateau)",
      ok,
      detail || `order=${order.join("→")}`
    );
  }

  // Living Regions housing need → regional pressure (V10.13 TEST 9 / 10 semantics)
  {
    const critical = makeDefaultV1013TestInputs(
      {},
      { NSW: { housingNeedSeverity: "critical", investmentPressure: "high", clusterConcentration: 72 } }
    );
    const calm = makeDefaultV1013TestInputs(
      {},
      { TAS: { housingNeedSeverity: "none", investmentPressure: "balanced", clusterConcentration: 25 } }
    );
    const criticalOut = computeNationalHouseholdEconomy(critical, createInitialHouseholdEconomyPersisted(), null);
    const calmOut = computeNationalHouseholdEconomy(calm, createInitialHouseholdEconomyPersisted(), null);
    const nsw = criticalOut.state.regions["NSW"];
    const tas = calmOut.state.regions["TAS"];
    check(
      results,
      "LR housing need drives pressure bands",
      (nsw.housingPressure === "high" || nsw.housingPressure === "severe") &&
        (tas.housingPressure === "low" || tas.housingPressure === "manageable"),
      `NSW=${nsw.housingPressure}, TAS=${tas.housingPressure}`
    );
  }

  // Completed urban/housing infrastructure eases pressure (Part 38–40 relief path)
  {
    const baseRegion = {
      housingNeedSeverity: "critical" as const,
      investmentPressure: "overheated" as const,
      clusterConcentration: 88,
    };
    const withoutInfra = makeDefaultV1013TestInputs({}, { VIC: baseRegion });
    const withInfra = makeDefaultV1013TestInputs(
      {
        completedProjects: [
          {
            id: "vic_urban_housing_precinct",
            title: "Melbourne Urban Housing Precinct",
            regionId: "VIC",
            projectType: "housing",
            status: "completed",
          },
        ],
      },
      { VIC: baseRegion }
    );
    const outBase = computeNationalHouseholdEconomy(withoutInfra, createInitialHouseholdEconomyPersisted(), null);
    const outRelief = computeNationalHouseholdEconomy(withInfra, createInitialHouseholdEconomyPersisted(), null);
    const baseScore = outBase.state.regions["VIC"].labScores.housingPressureScore;
    const reliefScore = outRelief.state.regions["VIC"].labScores.housingPressureScore;
    const hasInfraEvidence = outRelief.state.regions["VIC"].evidence.some(
      (e) => e.sourceId === "housing_infra" && e.sourceSystem === "infrastructure"
    );
    check(
      results,
      "Urban housing infra completion eases pressure",
      reliefScore < baseScore && hasInfraEvidence,
      `VIC score ${baseScore} → ${reliefScore}, infraEvidence=${hasInfraEvidence}`
    );
  }

  // Overheated investment + clusters worsen affordability without breaking boom prosperity signal
  {
    const inp = makeDefaultV1013TestInputs(
      {},
      {
        VIC: {
          economyBand: "booming",
          investmentPressure: "overheated",
          housingNeedSeverity: "critical",
          clusterConcentration: 90,
          transportNeedSeverity: "high",
        },
      }
    );
    const out = computeNationalHouseholdEconomy(inp, createInitialHouseholdEconomyPersisted(), null);
    const vic = out.state.regions["VIC"];
    check(
      results,
      "Urban overheating: prosperity vs affordability tension",
      (vic.prosperity === "strong" || vic.prosperity === "prosperous") &&
        V1013_HOUSING_PRESSURE_RANK[vic.housingPressure] >= V1013_HOUSING_PRESSURE_RANK["strained"],
      `prosperity=${vic.prosperity}, housing=${vic.housingPressure}, affordability=${vic.affordability}`
    );
  }

  // National housing cost pressure surfaces when scores cross threshold
  {
    const inp = makeDefaultV1013TestInputs(
      {},
      {
        NSW: { housingNeedSeverity: "critical", investmentPressure: "overheated", clusterConcentration: 90 },
        VIC: { housingNeedSeverity: "critical", investmentPressure: "overheated", clusterConcentration: 90 },
      }
    );
    const out = computeNationalHouseholdEconomy(inp, createInitialHouseholdEconomyPersisted(), null);
    const housingCp = out.state.affordability.costPressures.find((c) => c.domain === "housing");
    check(
      results,
      "National housing cost pressure item",
      Boolean(housingCp) && housingCp!.regionIds.length > 0,
      `domain=${housingCp?.domain}, severity=${housingCp?.severity}, regions=${housingCp?.regionIds.join(",")}`
    );
  }

  // Re-use canonical V10.13 self-tests whose names mention housing / overheating / boom pressure
  const v1013 = runV1013HouseholdsLivingStandardsSelfTests();
  const housingNamed = v1013.results.filter((r) => /housing|overheat|boom \+ housing/i.test(r.name));
  for (const r of housingNamed) {
    check(results, `[V1013] ${r.name}`, r.passed, r.detail);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, results };
}

const summary = runHousingUrbanizationContractTests();
for (const r of summary.results) {
  const mark = r.passed ? "PASS" : "FAIL";
  console.log(`${mark}  ${r.name} — ${r.detail}`);
}
console.log(`\nHousing & urbanization contracts: ${summary.passed}/${summary.total} passed`);
if (summary.failed > 0) {
  process.exitCode = 1;
}
