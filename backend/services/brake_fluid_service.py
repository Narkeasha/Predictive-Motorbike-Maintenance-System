from datetime import date
#no ml just based on time since last change


def evaluate_brake_fluid_status(data):
    #getting user input 
    last_change = data.date_last_brake_fluid_change

    #todays date to compare
    today = date.today()

    #calc for how long its been.
    days_since_change = (today - last_change).days

    #calc to get it in months.
    months_since_change = round(days_since_change / 30.44, 1)



    #----------------threshold logic---------------time based only.
    if days_since_change <= 365:
        status = "Safe"
        recommendation = "Brake fluid condition looks fine. No action needed yet."

    elif days_since_change <= 730:
        status = "Warning"
        recommendation = "Brake fluid is ageing. Plan a fluid change soon."

    else:
        status = "Critical"
        recommendation = "Brake fluid overdue. Service ASAP to maintain braking performance."

    #returning result in the same schema format.
    return {
        "status": status,
        "recommendation": recommendation
    }