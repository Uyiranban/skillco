from typing import List, Dict, Any
from backend.app.services.matching_service import MatchingService

class CareerService:
    @staticmethod
    def calculate_career_twin_metrics(
        skills: List[Dict[str, Any]],
        experiences: List[Dict[str, Any]],
        projects: List[Dict[str, Any]],
        job_matches: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        if not skills:
            return {
                "overallReadiness": 50,
                "technicalDepth": 50,
                "portfolioEvidence": 40,
                "skillConfidence": 50,
                "marketAlignment": 50
            }

        total_skills = len(skills)
        verified_count = sum(1 for s in skills if s.get("status") == "VERIFIED" or s.get("verificationStatus") == "verified")
        avg_confidence = sum(s.get("confidence", 50) for s in skills) / float(total_skills)

        # Technical depth (based on advanced/expert skills)
        advanced_count = sum(1 for s in skills if s.get("level") in ["Advanced", "Expert"] or s.get("claimed_level") in ["Advanced", "Expert"])
        technical_depth = min(98, int(round((advanced_count / float(max(1, total_skills))) * 60 + 35)))

        # Portfolio evidence (based on verified ratio & projects)
        portfolio_evidence = min(95, int(round((verified_count / float(max(1, total_skills))) * 50 + len(projects) * 10 + 20)))

        # Skill confidence
        skill_confidence = min(98, int(round(avg_confidence)))

        # Market alignment (based on top job match scores)
        if job_matches:
            top_3_avg = sum(m.get("match_score", 70) for m in job_matches[:3]) / min(3, len(job_matches))
            market_alignment = min(99, int(round(top_3_avg)))
        else:
            market_alignment = 75

        # Overall readiness
        overall_readiness = int(round(
            (technical_depth * 0.30) +
            (portfolio_evidence * 0.25) +
            (skill_confidence * 0.25) +
            (market_alignment * 0.20)
        ))

        return {
            "overallReadiness": overall_readiness,
            "technicalDepth": technical_depth,
            "portfolioEvidence": portfolio_evidence,
            "skillConfidence": skill_confidence,
            "marketAlignment": market_alignment,
            "verifiedSkillsCount": verified_count,
            "totalSkillsCount": total_skills
        }

    @staticmethod
    def calculate_skill_gaps(job_matches: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        gap_frequency: Dict[str, Dict[str, Any]] = {}

        for match in job_matches:
            job_title = match.get("job", {}).get("title", "Job")
            for missing in match.get("missing_skills", []):
                s_name = missing.get("skill_name")
                if not s_name:
                    continue
                if s_name not in gap_frequency:
                    gap_frequency[s_name] = {
                        "skill_name": s_name,
                        "frequency": 0,
                        "required_by": [],
                        "importance": missing.get("importance", "high"),
                        "required_level": missing.get("required_level", "Intermediate"),
                        "estimated_match_boost": 6
                    }
                gap_frequency[s_name]["frequency"] += 1
                gap_frequency[s_name]["required_by"].append(job_title)

            for partial in match.get("partial_skills", []):
                s_name = partial.get("skill_name")
                if not s_name:
                    continue
                if s_name not in gap_frequency:
                    gap_frequency[s_name] = {
                        "skill_name": s_name,
                        "frequency": 0,
                        "required_by": [],
                        "importance": partial.get("importance", "medium"),
                        "required_level": partial.get("required_level", "Advanced"),
                        "estimated_match_boost": 4
                    }
                gap_frequency[s_name]["frequency"] += 1
                if job_title not in gap_frequency[s_name]["required_by"]:
                    gap_frequency[s_name]["required_by"].append(job_title)

        # Sort by frequency descending
        sorted_gaps = sorted(gap_frequency.values(), key=lambda x: x["frequency"], reverse=True)
        return sorted_gaps
