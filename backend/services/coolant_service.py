from datetime import date


def evaluate_coolant_status(data):
    last_change = data.date_last_coolant_change
    today = date.today()

    days_since_change = (today - last_change).days
    months_since_change = round(days_since_change / 30.44, 1)

    if days_since_change <= 548:
        status = "Safe"
        recommendation = "Coolant condition looks good. No immediate action needed."

    elif days_since_change <= 730:
        status = "Warning"
        recommendation = "Coolant is nearing its service interval. Plan a replacement soon."

    else:
        status = "Critical"
        recommendation = "Coolant overdue for replacement. Service ASAP to help prevent overheating."

    return {
        "status": status,
        "recommendation": recommendation
    }