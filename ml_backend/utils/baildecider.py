def decide_bail(case_points):
    risk_score = 0
    red_flags = []
    green_flags = []

    if not isinstance(case_points, dict):
        return {
            "decision": "Error",
            "score": 0,
            "reasoning": {
                "red_flags": ["Invalid or missing casePoints data."],
                "green_flags": []
            }
        }

    # Helper function to check boolean strings
    def is_true(key):
        return str(case_points.get(key, 'false')).lower() == 'true'

    # Red Flags (Arguments AGAINST Bail)
    bns_sections = case_points.get("bnsSections", "").split(', ')
    crime_type = case_points.get("crimeType", "")
    heinous_crimes = ["302", "307", "376", "395", "397"]
    economic_crimes = ["420", "406", "409", "468", "471"]
    serious_crimes = ["326", "325", "363", "366", "392"]
    
    is_heinous = any(sec in bns_sections for sec in heinous_crimes)
    is_economic = any(sec in bns_sections for sec in economic_crimes)
    is_serious = any(sec in bns_sections for sec in serious_crimes)

    if is_heinous:
        risk_score += 20
        red_flags.append("The accused is charged with heinous crimes.")
    elif is_economic:
        risk_score += 15
        red_flags.append("The case involves serious economic or financial crimes.")
    elif is_serious:
        risk_score += 10
        red_flags.append("The offense is of a serious nature causing significant harm.")
    else:
        risk_score += 5
        red_flags.append("The offense is of a minor nature.")

    evidence = case_points.get("availableEvidence", "")
    if len(evidence.split(', ')) > 2 and ("CCTV" in evidence or "DNA" in evidence or "confession" in evidence):
        risk_score += 10
        red_flags.append("The prosecution's evidence appears to be strong and multifaceted.")
    
    prior_conviction_sections = case_points.get("priorConvictionSections", "")
    if is_true("hasPriorRecord"):
        current_sections_set = set(bns_sections)
        prior_sections_set = set(prior_conviction_sections.split(', '))
        if not prior_sections_set.isdisjoint(current_sections_set):
            risk_score += 15
            red_flags.append("The accused has a history of similar offenses.")
        else:
            risk_score += 10
            red_flags.append("The accused has a prior criminal record for different offenses.")

    if is_true("holdsPassport") and is_true("hasFinancialMeansToTravel"):
        risk_score += 15
        red_flags.append("There is a potential flight risk due to a valid passport and financial means.")

    if is_true("witnessThreatReports"):
        risk_score += 20
        red_flags.append("There is a credible risk of witness intimidation based on reports.")

    if is_true("evidenceTamperingReports"):
        risk_score += 15
        red_flags.append("There is a risk of evidence tampering based on reports.")

    if is_true("allegedOrganizedCrimeLinks"):
        risk_score += 15
        red_flags.append("The accused is allegedly part of an organized crime network.")
    
    if is_true("historyOfViolence"):
        risk_score += 15
        red_flags.append("The accused has a documented history of violent behavior.")

    # Green Flags (Arguments FOR Bail)
    if is_true("ownsProperty") and is_true("isEmployed") and is_true("hasLocalFamily"):
        risk_score -= 15
        green_flags.append("The accused has deep roots in the community (property, job, family).")
    elif is_true("isEmployed") or is_true("hasLocalFamily"):
        risk_score -= 5
        green_flags.append("The accused has some established ties to the community.")

    if not is_true("hasPriorRecord"):
        risk_score -= 10
        green_flags.append("This is the accused's first alleged offense.")
        
    days_in_detention = int(case_points.get("daysInDetention", 0))
    if days_in_detention > 180:
        risk_score -= 10
        green_flags.append("The accused has already undergone a significant period of incarceration.")

    if case_points.get("medicalConditions", "None reported").lower() != "none reported":
        risk_score -= 15
        green_flags.append("The accused has documented health issues requiring special medical attention.")

    if is_true("isSoleFamilyEarner"):
        risk_score -= 5
        green_flags.append("The accused is the sole financial provider for their family.")

    if "secondary" in case_points.get("allegedRoleInCrime", ""):
        risk_score -= 10
        green_flags.append("The accused's alleged role in the crime was minor.")

    accused_age = int(case_points.get("accusedAge", 30))
    if accused_age < 21 or accused_age > 65:
        risk_score -= 15
        green_flags.append("The age of the accused (either young or elderly) is a mitigating factor.")

    decision = ""
    if risk_score >= 20:
        decision = "Deny Bail"
    elif risk_score > 0 and risk_score < 20:
        decision = "Discretionary"
    else:
        decision = "Grant Bail"
    
    return {
        "decision": decision,
        "score": risk_score,
        "reasoning": {
            "red_flags": red_flags,
            "green_flags": green_flags
        }
    }