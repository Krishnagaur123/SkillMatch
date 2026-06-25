package com.skillmatch.opportunity.projection;

import com.skillmatch.common.enums.SkillImportance;

import java.util.UUID;

/**
 * Spring Data projection returned by the market-stat aggregate query.
 * Lives in the opportunity projection package because the underlying
 * opportunity_skills table is owned by the opportunity domain.
 */
public interface SkillMarketStatRow {

    UUID            getSkillId();
    String          getSkillName();
    SkillImportance getImportance();
    long            getCnt();
}
