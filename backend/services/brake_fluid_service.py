from datetime import date


def evaluate_brake_fluid_status(data):
    last_change = data.date_last_brake_fluid_change
    today = date.today()

    days_since_change = (today - last_change).days
    months_since_change = round(days_since_change / 30.44, 1)

    if days_since_change <= 365:
        status = "Safe"
        recommendation = "Brake fluid condition looks fine. No action needed yet."

    elif days_since_change <= 730:
        status = "Warning"
        recommendation = "Brake fluid is ageing. Plan a fluid change soon."

    else:
        status = "Critical"
        recommendation = "Brake fluid overdue. Service ASAP to maintain braking performance."

    return {
        "status": status,
        "recommendation": recommendation
    }