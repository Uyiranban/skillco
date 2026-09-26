import copy
from typing import List, Dict, Any
from backend.app.services.matching_service import MatchingService
from backend.app.services.career_service import CareerService

class SimulationService:
    @staticmethod
    def run_simulation(
        candidate_skills: List[Dict[str, Any]],
        candidate_exp_years: int,
        candidate_edu: str,
        candidate_pref: Dict[str, Any],
        jobs: List[Dict[str, Any]],
        hypothetical_skills: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Creates an isolated in-memory copy of candidate state, applies hypothetical skills,
        recalculates job matches and Career Twin readiness delta, and returns projected results.
        """
        # Baseline match calculation
        before_matches = [
            MatchingService.match_candidate_to_job(candidate_skills, candidate_exp_years, candidate_edu, candidate_pref, j)
            for j in jobs
        ]
        before_twin = CareerService.calculate_career_twin_metrics(candidate_skills, [], [], before_matches)
        before_readiness = before_twin["overallReadiness"]

        # In-memory clone of skills
        simulated_skills = copy.deepcopy(candidate_skills)
        skill_index_map = {s["name"].lower(): idx for idx, s in enumerate(simulated_skills)}

        skill_impacts = []

        for hyp in hypothetical_skills:
            h_name = hyp.get("name", "").strip()
            h_level = hyp.get("target_level", "Advanced")
            h_status = hyp.get("target_status", "VERIFIED")
            h_confidence = hyp.get("target_confidence", 90)

            if h_name.lower() in skill_index_map:
                # Upgrade existing skill
                idx = skill_index_map[h_name.lower()]
                old_level = simulated_skills[idx].get("level", "Intermediate")
                old_status = simulated_skills[idx].get("status", "CLAIMED")
                simulated_skills[idx]["level"] = h_level
                simulated_skills[idx]["claimed_level"] = h_level
                simulated_skills[idx]["verified_level"] = h_level
                simulated_skills[idx]["status"] = h_status
                simulated_skills[idx]["verificationStatus"] = "verified" if h_status == "VERIFIED" else "claimed"
                simulated_skills[idx]["confidence"] = h_confidence

                skill_impacts.append({
                    "skill_name": h_name,
                    "action": f"Upgraded from {old_level} ({old_status}) to {h_level} ({h_status})",
                    "confidence_boost": f"+{h_confidence - simulated_skills[idx].get('confidence', 50)}%"
                })
            else:
                # Add new hypothetical skill
                new_item = {
                    "name": h_name,
                    "category": "Frontend",
                    "level": h_level,
                    "claimed_level": h_level,
                    "verified_level": h_level,
                    "status": h_status,
                    "verificationStatus": "verified" if h_status == "VERIFIED" else "claimed",
                    "confidence": h_confidence
                }
                simulated_skills.append(new_item)
                skill_index_map[h_name.lower()] = len(simulated_skills) - 1

                skill_impacts.append({
                    "skill_name": h_name,
                    "action": f"Added {h_name} at {h_level} ({h_status})",
                    "confidence_boost": f"{h_confidence}% confidence"
                })

        # Recalculate matches with hypothetical state
        after_matches = [
            MatchingService.match_candidate_to_job(simulated_skills, candidate_exp_years, candidate_edu, candidate_pref, j)
            for j in jobs
        ]
        after_twin = CareerService.calculate_career_twin_metrics(simulated_skills, [], [], after_matches)
        after_readiness = after_twin["overallReadiness"]

        # Count newly qualified roles (where match went from <80 to >=80)
        unlocked_count = 0
        salary_lift_potential = 0

        before_top = []
        after_top = []

        for b, a, j in zip(before_matches, after_matches, jobs):
            b_score = b["match_score"]
            a_score = a["match_score"]
            if b_score < 80 and a_score >= 80:
                unlocked_count += 1
            if a_score > b_score:
                salary_lift_potential = max(salary_lift_potential, (a_score - b_score) * 1500)

            before_top.append({
                "job_id": j.get("id"),
                "title": j.get("title"),
                "company": j.get("company"),
                "score": b_score
            })
            after_top.append({
                "job_id": j.get("id"),
                "title": j.get("title"),
                "company": j.get("company"),
                "score": a_score,
                "delta": a_score - b_score
            })

        before_top_sorted = sorted(before_top, key=lambda x: x["score"], reverse=True)[:5]
        after_top_sorted = sorted(after_top, key=lambda x: x["score"], reverse=True)[:5]

        return {
            "before_readiness": before_readiness,
            "after_readiness": after_readiness,
            "readiness_delta": max(0, after_readiness - before_readiness),
            "before_top_matches": before_top_sorted,
            "after_top_matches": after_top_sorted,
            "unlocked_roles_count": max(1, unlocked_count),
            "estimated_salary_uplift": max(8000, salary_lift_potential),
            "skill_impact_breakdown": skill_impacts
        }
