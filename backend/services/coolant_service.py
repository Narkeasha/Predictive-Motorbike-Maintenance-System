from datetime import date, datetime

SAFE_DAYS = 548
CRITICAL_DAYS = 730
AVG_DAYS_PER_MONTH = 30.44


def evaluate_coolant_status(date_last_coolant_change: str | None):
    today = date.today()

    # missing date -> conservative warning
    if not date_last_coolant_change:
        return {
            "coolant_status": "Warning",
            "days_since_change": None,
            "months_since_change": None,
            "reason": "Coolant change date unknown; conservative assumption applied.",
            "recommended_action": "Plan a coolant change or verify service history.",
            "confidence": "High"
        }

    # validate date format
    try:
        last_change_date = datetime.strptime(
            date_last_coolant_change, "%Y-%m-%d"
        ).date()
    except ValueError:
        raise ValueError("Invalid date format. Expected YYYY-MM-DD.")

    # reject future dates
    if last_change_date > today:
        raise ValueError("Last coolant change date cannot be in the future.")

    days_since_change = (today - last_change_date).days
    months_since_change = round(days_since_change / AVG_DAYS_PER_MONTH, 1)

    if days_since_change <= SAFE_DAYS:
        status = "Safe"
        reason = "Coolant is within the conservative service interval."
        action = "No action required; continue routine monitoring."
    elif days_since_change <= CRITICAL_DAYS:
        status = "Warning"
        reason = "Coolant is approaching the conservative service limit."
        action = "Plan a coolant change in the near future."
    else:
        status = "Critical"
        reason = "Coolant service interval exceeded."
        action = "Coolant change overdue; inspection and replacement recommended."

    return {
        "coolant_status": status,
        "days_since_change": days_since_change,
        "months_since_change": months_since_change,
        "reason": reason,
        "recommended_action": action,
        "confidence": "High"
    }