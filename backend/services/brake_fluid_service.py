from datetime import date, datetime

SAFE_DAYS = 365
CRITICAL_DAYS = 730
AVG_DAYS_PER_MONTH = 30.44


def evaluate_brake_fluid_status(date_last_brake_fluid_change: str | None):
    today = date.today()

    # missing date -> conservative warning
    if not date_last_brake_fluid_change:
        return {
            "brake_fluid_status": "Warning",
            "days_since_change": None,
            "months_since_change": None,
            "reason": "Brake fluid change date unknown; conservative assumption applied.",
            "recommended_action": "Plan a brake fluid change or verify service history.",
            "confidence": "High"
        }

    # validate date format
    try:
        last_change_date = datetime.strptime(
            date_last_brake_fluid_change, "%Y-%m-%d"
        ).date()
    except ValueError:
        raise ValueError("Invalid date format. Expected YYYY-MM-DD.")

    # reject future dates
    if last_change_date > today:
        raise ValueError("Last brake fluid change date cannot be in the future.")

    days_since_change = (today - last_change_date).days
    months_since_change = round(days_since_change / AVG_DAYS_PER_MONTH, 1)

    if days_since_change <= SAFE_DAYS:
        status = "Safe"
        reason = "Brake fluid is within the conservative service interval."
        action = "No action required; continue routine monitoring."
    elif days_since_change <= CRITICAL_DAYS:
        status = "Warning"
        reason = "Brake fluid is approaching the conservative service limit."
        action = "Plan a brake fluid change in the near future."
    else:
        status = "Critical"
        reason = "Brake fluid service interval exceeded."
        action = "Brake fluid change overdue; braking performance may be compromised."

    return {
        "brake_fluid_status": status,
        "days_since_change": days_since_change,
        "months_since_change": months_since_change,
        "reason": reason,
        "recommended_action": action,
        "confidence": "High"
    }