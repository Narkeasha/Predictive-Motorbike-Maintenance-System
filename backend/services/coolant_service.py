from datetime import date

#no ml just based on time since last change
def evaluate_coolant_status(data):
    #getting user inpput 
    last_change = data.date_last_coolant_change

    #todays date for comparison.
    today = date.today()

    #calc for how long its been since last change.
    days_since_change = (today - last_change).days
    months_since_change = round(days_since_change / 30.44, 1)

    #----------------threshold logic---------------time based only.
    if days_since_change <= 548:
        status = "Safe"
        recommendation = "Coolant condition looks good. No immediate action needed."

    elif days_since_change <= 730:
        status = "Warning"
        recommendation = "Coolant is nearing its service interval. Plan a replacement soon."

    else:
        status = "Critical"
        recommendation = "Coolant overdue for replacement. Service ASAP to help prevent overheating."

    #------------------Return result in JSON schema format------------------.
    return {
        "status": status,
        "recommendation": recommendation
    }