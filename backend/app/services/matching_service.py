from typing import List, Dict, Any, Optional

# Numeric level rankings for accurate level distance calculation
LEVEL_RANK: Dict[str, int] = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Expert": 4,
}

IMPORTANCE_WEIGHTS: Dict[str, float] = {
    "critical": 3.0,
    "high": 2.0,
    "medium": 1.2,
    "nice-to-have": 0.8,
}

class MatchingService:
    """
    Deterministic 6-Factor Job-Skill Match Engine.
    Formula:
      Score = (Factor1 * 0.35) + (Factor2 * 0.25) + (Factor3 * 0.15) + (Factor4 * 0.10) + (Factor5 * 0.10) + (Factor6 * 0.05)
    """

    @staticmethod
    def match_candidate_to_job(
        candidate_skills: List[Dict[str, Any]],
        candidate_experience_years: int,
        candidate_education_degree: str,
        candidate_preferences: Dict[str, Any],
        job: Dict[str, Any]
    ) -> Dict[str, Any]:
        required_skills = job.get("required_skills", [])
        if not required_skills:
            return {
                "match_score": 75,
                "matched_skills": [],
                "partial_skills": [],
                "missing_skills": [],
                "score_breakdown": {},
                "readiness_level": "Moderate Fit"
            }

        # Build candidate skill map
        user_skill_map: Dict[str, Dict[str, Any]] = {}
        for s in candidate_skills:
            name_key = s.get("name", "").strip().lower()
            user_skill_map[name_key] = s

        matched_skills = []
        partial_skills = []
        missing_skills = []

        total_importance_weight = 0.0
        earned_skill_weight = 0.0
        verified_evidence_sum = 0.0
        verified_evidence_count = 0

        for req in required_skills:
            skill_name = req.get("skill_name", "").strip()
            req_level = req.get("minimum_level", "Intermediate")
            importance = req.get("importance", "high").lower()
            weight = IMPORTANCE_WEIGHTS.get(importance, 1.5)
            req_rank = LEVEL_RANK.get(req_level, 2)

            total_importance_weight += weight

            user_skill = user_skill_map.get(skill_name.lower())
            if not user_skill:
                missing_skills.append({
                    "skill_name": skill_name,
                    "importance": importance,
                    "required_level": req_level,
                    "gap": "Missing in profile",
                    "impact": "High" if importance in ["critical", "high"] else "Moderate"
                })
                continue

            # Determine user level and verification
            current_level = user_skill.get("verified_level") or user_skill.get("level") or user_skill.get("claimed_level") or "Beginner"
            user_rank = LEVEL_RANK.get(current_level, 1)
            is_verified = user_skill.get("verificationStatus") == "verified" or user_skill.get("status") == "VERIFIED"
            confidence = user_skill.get("confidence", 50)

            if is_verified:
                verified_evidence_sum += (confidence / 100.0)
                verified_evidence_count += 1

            if user_rank >= req_rank:
                # Full or exceeding match
                earned_skill_weight += weight
                matched_skills.append({
                    "skill_name": skill_name,
                    "candidate_level": current_level,
                    "required_level": req_level,
                    "status": "VERIFIED" if is_verified else "CLAIMED",
                    "confidence": confidence,
                    "importance": importance,
                    "strength": "Exceeds requirement" if user_rank > req_rank else "Meets requirement"
                })
            else:
                # Partial match
                level_ratio = user_rank / float(req_rank)
                earned_skill_weight += weight * level_ratio
                partial_skills.append({
                    "skill_name": skill_name,
                    "candidate_level": current_level,
                    "required_level": req_level,
                    "status": "VERIFIED" if is_verified else "CLAIMED",
                    "confidence": confidence,
                    "importance": importance,
                    "gap": f"Need {req_level} (Currently {current_level})"
                })

        # Factor 1: Required Skill Coverage (0.35)
        total_req_count = len(required_skills)
        matched_req_count = len(matched_skills) + (len(partial_skills) * 0.5)
        coverage_ratio = (matched_req_count / float(total_req_count)) if total_req_count > 0 else 1.0
        f1_score = min(100.0, coverage_ratio * 100.0)

        # Factor 2: Skill Importance & Level Match (0.25)
        f2_score = (earned_skill_weight / total_importance_weight * 100.0) if total_importance_weight > 0 else 80.0
        f2_score = min(100.0, f2_score)

        # Factor 3: Experience Alignment (0.15)
        job_exp_years = job.get("experience_years_required", 3)
        if candidate_experience_years >= job_exp_years:
            f3_score = 100.0
        elif candidate_experience_years >= (job_exp_years - 1):
            f3_score = 85.0
        else:
            f3_score = max(50.0, (candidate_experience_years / float(max(1, job_exp_years))) * 100.0)

        # Factor 4: Verified Evidence Quality (0.10)
        if len(matched_skills) > 0:
            verified_ratio = (verified_evidence_count / float(len(matched_skills) + len(partial_skills))) if (len(matched_skills) + len(partial_skills)) > 0 else 0.5
            f4_score = (verified_ratio * 80.0) + (min(1.0, verified_evidence_sum / max(1, verified_evidence_count or 1)) * 20.0)
        else:
            f4_score = 40.0
        f4_score = min(100.0, max(20.0, f4_score))

        # Factor 5: Education & Domain Match (0.10)
        edu_str = candidate_education_degree.lower()
        if "computer" in edu_str or "software" in edu_str or "engineering" in edu_str:
            f5_score = 95.0
        elif "science" in edu_str or "math" in edu_str or "bachelor" in edu_str:
            f5_score = 85.0
        else:
            f5_score = 75.0

        # Factor 6: Career & Location Preference (0.05)
        job_work_mode = job.get("work_mode", "Hybrid").lower()
        cand_work_mode = candidate_preferences.get("workMode", "Hybrid").lower()
        if job_work_mode == cand_work_mode or "remote" in cand_work_mode:
            f6_score = 95.0
        else:
            f6_score = 75.0

        # Deterministic Weighted Total
        total_raw = (
            (f1_score * 0.35) +
            (f2_score * 0.25) +
            (f3_score * 0.15) +
            (f4_score * 0.10) +
            (f5_score * 0.10) +
            (f6_score * 0.05)
        )

        final_match_score = int(round(total_raw))
        final_match_score = max(15, min(99, final_match_score))

        # Readiness categorization
        if final_match_score >= 88:
            readiness_level = "High Fit"
        elif final_match_score >= 75:
            readiness_level = "Strong Fit"
        elif final_match_score >= 60:
            readiness_level = "Moderate Fit"
        else:
            readiness_level = "Growth Opportunity"

        return {
            "match_score": final_match_score,
            "matched_skills": matched_skills,
            "partial_skills": partial_skills,
            "missing_skills": missing_skills,
            "score_breakdown": {
                "skill_coverage": int(round(f1_score)),
                "importance_match": int(round(f2_score)),
                "experience_alignment": int(round(f3_score)),
                "verified_evidence": int(round(f4_score)),
                "education_domain": int(round(f5_score)),
                "preference_fit": int(round(f6_score)),
            },
            "verified_boost": int(round(f4_score * 0.10)),
            "readiness_level": readiness_level,
            "growth_index": job.get("growth_index", 85)
        }
